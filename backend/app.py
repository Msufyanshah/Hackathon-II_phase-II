# Hugging Face Spaces App Entry Point
# This file enables deployment to Hugging Face Spaces

import os
from src.main import app

# This is the entry point for Hugging Face Spaces
# The Spaces runner will look for an 'app' object in this file

if __name__ == "__main__":
    # For local development
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 7860)))