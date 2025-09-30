import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  addPoints,
  addAnalysis,
  setUserScore,
} from "../../store/leaderboardSlice";

import CameraView from "./CameraView";
import AnalysisView from "./AnalysisView";
import "./WasteAnalysis.css";

// Helper component to render bounding boxes
const BoundingBoxOverlay = ({ bboxes, scale = 1 }) => {
  return (
    <div className="bbox-container">
      {bboxes.map((box, index) => {
        const [x1, y1, x2, y2] = box.bbox.map((v) => v * scale);
        return (
          <div
            key={index}
            className="bbox"
            style={{
              left: x1,
              top: y1,
              width: x2 - x1,
              height: y2 - y1,
              borderColor: "red",
            }}
            title={`${box.label} (${Math.round(box.confidence * 100)}%)`}
          ></div>
        );
      })}
    </div>
  );
};

const WasteAnalysis = () => {
  const [selectedMode, setSelectedMode] = useState("image");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState([]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [error, setError] = useState(null);

  const imageInputRef = useRef();
  const videoInputRef = useRef();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const points = useSelector((state) => state.leaderboard.points);

  // Removed prompt, simplified
  const handleFirstAnalysis = useCallback(async () => {
    if (!user || !user.name) {
      console.warn("No logged-in user found. Leaderboard updates will be skipped.");
    }
  }, [user]);

  const validateFile = (file, type) => {
    const maxSize = type === "image" ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
    const allowedTypes =
      type === "image"
        ? ["image/jpeg", "image/png", "image/gif", "image/webp"]
        : ["video/mp4", "video/webm", "video/ogg"];
    if (file.size > maxSize)
      throw new Error(`File too large: ${maxSize / (1024 * 1024)}MB`);
    if (!allowedTypes.includes(file.type))
      throw new Error(`Invalid type. Allowed: ${allowedTypes.join(", ")}`);
    return true;
  };

  const analyzeAllFilesSequentially = useCallback(
    async (fileBlobs, fileDataArray, mode) => {
      setShowAnalysis(true);
      setIsAnalyzing(true);
      setError(null);
      const analysisResults = [];

      try {
        await handleFirstAnalysis();

        for (let i = 0; i < fileBlobs.length; i++) {
          setCurrentIndex(i);
          const formData = new FormData();
          formData.append("file", fileBlobs[i]);

          try {
            const response = await fetch("http://localhost:8000/api/v1/predict", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || `Server error: ${response.status}`);
            }

            const data = await response.json();

            const bboxes = (data.bboxes || []).map((box) => ({
              label: box.label,
              confidence: box.confidence,
              bbox: box.bbox,
            }));

            const result = {
              item: data.label || "Unknown Item",
              color: "blue",
              category: data.category || data.label || "Uncategorized",
              confidence: data.confidence ? Math.round(data.confidence * 100) : null,
              instructions: data.instructions || "No sorting instructions.",
              facts: data.facts || "Recycling reduces waste pollution.",
              ecoTip: data.eco_tip || "Clean items before recycling.",
              bboxes: bboxes,
            };

            analysisResults.push(result);

            dispatch(addPoints(10));
            dispatch(
              addAnalysis({
                ...result,
                timestamp: new Date().toISOString(),
              })
            );

            // Post leaderboard update only if user logged in
            if (user?.name) {
              await axios.post("http://localhost:8000/api/v1/leaderboard", {
                user_id: user.name,
                score: points + 10,
                itemsAnalyzed: i + 1,
              });
              dispatch(setUserScore({ username: user.name, points: points + 10 }));
            }
          } catch (error) {
            console.error(`Analysis error for file ${i + 1}:`, error);
            analysisResults.push({
              item: `Analysis Failed (File ${i + 1})`,
              color: "red",
              category: "Error",
              instructions: `Could not analyze: ${error.message}`,
              ecoTip: "Try a clearer photo with better lighting.",
              bboxes: [],
            });
          }
        }

        setResults(analysisResults);
      } catch (error) {
        console.error("Sequential analysis error:", error);
        setError(error.message);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [dispatch, handleFirstAnalysis, points, user?.name]
  );

  const handleImageUpload = useCallback(
    (e) => {
      try {
        setError(null);
        const files = Array.from(e.target.files);
        if (!files.length) return;
        if (files.length > 10) throw new Error("Maximum 10 images allowed");

        files.forEach((file) => validateFile(file, "image"));

        const readers = files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (ev) => resolve(ev.target.result);
              reader.onerror = () => reject(new Error(`Failed to read: ${file.name}`));
              reader.readAsDataURL(file);
            })
        );

        Promise.all(readers)
          .then((fileDataArray) => {
            setSelectedFiles(fileDataArray);
            setCurrentIndex(0);
            analyzeAllFilesSequentially(files, fileDataArray, "image");
          })
          .catch((err) => setError(err.message));
      } catch (err) {
        setError(err.message);
      } finally {
        e.target.value = "";
      }
    },
    [analyzeAllFilesSequentially]
  );

  const handleVideoUpload = useCallback(
    (e) => {
      try {
        setError(null);
        const file = e.target.files[0];
        if (!file) return;

        validateFile(file, "video");
        const url = URL.createObjectURL(file);

        setSelectedFiles([url]);
        setCurrentIndex(0);
        analyzeAllFilesSequentially([file], [url], "video");
      } catch (err) {
        setError(err.message);
      } finally {
        e.target.value = "";
      }
    },
    [analyzeAllFilesSequentially]
  );

  const handleTakePhoto = useCallback(() => {
    alert("Camera access needs to be implemented.");
  }, []);

  const handleAnalyzeAgain = useCallback(() => {
    setShowAnalysis(false);
    setSelectedFiles([]);
    setCurrentIndex(0);
    setResults([]);
    setIsAnalyzing(false);
    setError(null);

    selectedFiles.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      selectedFiles.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [selectedFiles]);

  return (
    <div>
      {showAnalysis ? (
        <AnalysisView
          results={results}
          isAnalyzing={isAnalyzing}
          selectedFiles={selectedFiles}
          selectedMode={selectedMode}
          currentIndex={currentIndex}
          isVoiceEnabled={isVoiceEnabled}
          setIsVoiceEnabled={setIsVoiceEnabled}
          onAnalyzeAgain={handleAnalyzeAgain}
          onShare={() => {
            if (navigator.share && results.length > 0) {
              navigator
                .share({
                  title: "My Waste Analysis Results",
                  text: `I analyzed ${results.length} items and learned how to sort them properly!`,
                  url: window.location.href,
                })
                .catch(console.error);
            }
          }}
          user={user}
          error={error}
          BoundingBoxOverlay={BoundingBoxOverlay} // pass overlay component
        />
      ) : (
        <CameraView
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          imageInputRef={imageInputRef}
          videoInputRef={videoInputRef}
          onImageUpload={handleImageUpload}
          onVideoUpload={handleVideoUpload}
          onTakePhoto={handleTakePhoto}
          isProcessing={isAnalyzing}
        />
      )}
    </div>
  );
};

export default WasteAnalysis;
