import React from "react";
import {
  Camera, Upload, Recycle, Zap, Leaf,
  Volume2, VolumeX, Share2, RotateCcw
} from "lucide-react";
import "./WasteAnalysis.css";

const CameraView = ({ onImageUpload, fileInputRef }) => (
  <div className="wa-container">
    <div className="wa-header">
      <h2>Analyze Your Waste</h2>
      <p>Upload an image or take a photo to get instant sorting guidance</p>
    </div>

    <div className="wa-upload-card">
      <div className="wa-camera-icon">
        <Camera className="text-white" size={40} />
      </div>

      <div>
        <h3>Ready to Analyze</h3>
        <p>Our AI will identify the material and provide disposal instructions</p>
      </div>

      <div className="wa-btn-group">
        <button onClick={() => fileInputRef.current?.click()} className="wa-btn wa-btn-primary">
          <Upload size={20} />
          <span>Upload Photo</span>
        </button>
        <button className="wa-btn wa-btn-outline">
          <Camera size={20} />
          <span>Take Photo</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />
    </div>

    {/* Tips */}
    <div className="wa-tips">
      <h4>📸 Photo Tips for Best Results</h4>
      <ul>
        <li>• Ensure good lighting and clear focus</li>
        <li>• Center the item in the frame</li>
        <li>• Avoid cluttered backgrounds</li>
        <li>• Take photos from multiple angles if needed</li>
      </ul>
    </div>
  </div>
);

const AnalysisView = ({ result, isAnalyzing, selectedImage, isVoiceEnabled, setIsVoiceEnabled }) => {
  if (isAnalyzing) {
    return (
      <div className="wa-analyzing">
        <div className="wa-spinner"></div>
        <div>
          <h2>Analyzing your waste...</h2>
          <p>Our AI is processing your image</p>
        </div>
        {selectedImage && <img src={selectedImage} alt="Analyzing" className="wa-preview" />}
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="wa-analysis-container">
      <div className="wa-header">
        <h2>Analysis Complete!</h2>
        <p>Here's what our AI found</p>
      </div>

      <div className="wa-grid">
        {selectedImage && (
          <div className="wa-img-card">
            <img src={selectedImage} alt="Analyzed item" />
          </div>
        )}

        <div className="wa-results">
          {/* Item result */}
          <div className={`wa-result-card ${result.color}`}>
            <div className="wa-result-header">
              <h3>{result.item}</h3>
              <button onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} className="wa-voice-btn">
                {isVoiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>
            <div className="wa-category">
              <span>{result.category}</span>
              <span className="wa-confidence">{result.confidence}% confident</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="wa-card">
            <h4><Recycle size={20} className="icon-green" /> How to Sort</h4>
            <p>{result.instructions}</p>
          </div>

          {/* Fun Fact */}
          <div className="wa-card blue">
            <h4><Zap size={20} className="icon-blue" /> Did You Know?</h4>
            <p>{result.facts}</p>
          </div>

          {/* Eco Tip */}
          <div className="wa-card green">
            <h4><Leaf size={20} className="icon-green" /> Eco Tip</h4>
            <p>{result.ecoTip}</p>
          </div>

          {/* Actions */}
          <div className="wa-actions">
            <button className="wa-btn wa-btn-primary">
              <Share2 size={18} />
              <span>Share Result</span>
            </button>
            <button className="wa-btn wa-btn-outline">
              <RotateCcw size={18} />
              <span>Analyze Another</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WasteAnalysis = ({ result, isAnalyzing, selectedImage, isVoiceEnabled, setIsVoiceEnabled, onImageUpload, fileInputRef, showAnalysis }) => {
  return showAnalysis ? (
    <AnalysisView
      result={result}
      isAnalyzing={isAnalyzing}
      selectedImage={selectedImage}
      isVoiceEnabled={isVoiceEnabled}
      setIsVoiceEnabled={setIsVoiceEnabled}
    />
  ) : (
    <CameraView onImageUpload={onImageUpload} fileInputRef={fileInputRef} />
  );
};

export default WasteAnalysis;
