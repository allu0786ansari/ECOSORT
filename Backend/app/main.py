# app/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import get_settings
from app.core.logging import logger


settings = get_settings()

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        debug=settings.APP_DEBUG,
        docs_url="/docs" if settings.APP_ENV != "production" else None,
        redoc_url="/redoc" if settings.APP_ENV != "production" else None,
    )

    # CORS (allow dev origins; tighten for production)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # TODO: restrict in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount static directories for uploads/audio so the frontend can fetch them
    static_dir = os.path.join(os.getcwd(), "app", "static")
    if not os.path.exists(static_dir):
        os.makedirs(static_dir, exist_ok=True)
        os.makedirs(os.path.join(static_dir, "uploads"), exist_ok=True)
        os.makedirs(os.path.join(static_dir, "audio"), exist_ok=True)

    app.mount("/static", StaticFiles(directory=static_dir), name="static")

    # Include API routers (import routers lazily; file not present until implemented)
    try:
        # versioned API package
        from app.api.v1 import predict, chatbot, feedback, analytics, gamification, tts,auth, user  # type: ignore

        # Each module should expose `router` variable
        app.include_router(predict.router, prefix="/api/v1", tags=["predict"])
        app.include_router(chatbot.router, prefix="/api/v1", tags=["chatbot"])
        app.include_router(feedback.router, prefix="/api/v1", tags=["feedback"])
        app.include_router(analytics.router, prefix="/api/v1", tags=["analytics"])
        app.include_router(gamification.router, prefix="/api/v1", tags=["gamification"])
        app.include_router(tts.router, prefix="/api/v1", tags=["tts"])
        app.include_router(user.router, prefix="/api/v1", tags=["user"])
        app.include_router(auth.router, prefix="/api/v1", tags=["auth"])

    except Exception as exc:  # modules likely not implemented yet
        logger.debug("API routers not yet available to include: {}", exc)

    # Root health check
    @app.get("/", tags=["health"])
    async def root():
        return {
            "app": settings.APP_NAME,
            "env": settings.APP_ENV,
            "status": "ok",
        }

    @app.on_event("startup")
    async def startup_event():
        logger.info("Starting {app} (env={env})", app=settings.APP_NAME, env=settings.APP_ENV)

    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info("Shutting down {app}", app=settings.APP_NAME)

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.APP_ENV != "production",
    )
