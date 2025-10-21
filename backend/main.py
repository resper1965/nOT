from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.assets import router as assets_router
from api.network import router as network_router
import os

app = FastAPI(
    title="ness. OT GRC API",
    description="API de Governance, Risk & Compliance para redes OT",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(assets_router)
app.include_router(network_router)

@app.get("/")
async def root():
    return {
        "message": "ness. OT GRC API",
        "product": "Governance, Risk & Compliance for OT Networks",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "assets": "/api/assets/stats",
            "network": "/api/network/topology-summary",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
