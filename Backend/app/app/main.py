from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.app.config import settings
from app.api.v1 import (
    predict, 
    chatbot, 
    feedback, 
    gamification, 
    analytics, 
    tts,
    auth  # Import the auth router
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predict.router, prefix=settings.API_V1_STR, tags=["predict"])
app.include_router(chatbot.router, prefix=settings.API_V1_STR, tags=["chatbot"])
app.include_router(feedback.router, prefix=settings.API_V1_STR, tags=["feedback"])
app.include_router(gamification.router, prefix=settings.API_V1_STR, tags=["gamification"])
app.include_router(analytics.router, prefix=settings.API_V1_STR, tags=["analytics"])
app.include_router(tts.router, prefix=settings.API_V1_STR, tags=["tts"])

# ✅ Include authentication endpoints
app.include_router(auth.router, prefix=settings.API_V1_STR + "/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"message": "Welcome to EcoSort AI API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
