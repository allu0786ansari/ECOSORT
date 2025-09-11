# app/api/v1/feedback.py
from fastapi import APIRouter, Body

router = APIRouter()

@router.post("/feedback")
async def submit_feedback(
    predicted_label: str = Body(...),
    correct_label: str = Body(...),
    user_id: str = Body(None)
):
    """
    Collects feedback (correct/incorrect classification).
    TODO: store in feedback_service.py + database.
    """
    return {
        "status": "success",
        "predicted": predicted_label,
        "correct": correct_label,
        "user_id": user_id,
    }
