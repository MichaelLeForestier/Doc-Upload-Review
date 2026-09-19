# PDF Analysis with Local LLM (Ollama) Setup Guide

## Overview

This project implements local LLM integration following the AI Foundry Integration Guide pattern, specifically for PDF document analysis using Ollama.

## Features

- **Drag-and-Drop PDF Upload**: Simple drag and drop interface for PDF files
- **Local AI Analysis**: Uses Ollama with local models (llama3, mistral, etc.)
- **Thinking Steps Display**: Shows AI thinking process
- **Graceful Fallbacks**: Handles errors gracefully

## Prerequisites

### 1. Install Ollama

```bash
# macOS
brew install ollama || curl -fsSL https://ollama.com/install.sh | sh

# Verify installation
ollama --version
```

### 2. Pull a Local Model

```bash
# Recommended models for PDF analysis
ollama pull llama3
# or
ollama pull mistral
# or
ollama pull mxbai-embed-large
```

### 3. Ensure Ollama is Running

```bash
ollama serve &
# Should be accessible at http://localhost:11434
```

## Setup

### Backend (.NET API)

1. **Configuration**: The `appsettings.Development.json` already has Ollama configured:
   ```json
   {
     "Ollama": {
       "Enabled": true,
       "Endpoint": "http://localhost:11434",
       "Model": "llama3"
     }
   }
   ```

2. **Build and Run**:
   ```bash
   cd /Users/michael/Documents/Dev/Lor/API
   dotnet build
   dotnet run
   ```

### Frontend (React)

1. **Install Dependencies**:
   ```bash
   cd /Users/michael/Documents/Dev/Lor/Frontend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Access the App**: http://localhost:3000

## Usage

1. Start Ollama: `ollama serve`
2. Pull a model: `ollama pull llama3`
3. Run both frontend and backend servers
4. Drag PDF files onto the drop zone or click to select
5. Wait for analysis to complete

## API Endpoint

### POST /api/analyze-pdf

**Request**: Multipart form-data with file field containing PDF

**Response**:
```json
{
  "thinking": [
    "Extracting document metadata",
    "Analyzing content structure", 
    "Generating summary"
  ],
  "answer": "AI-generated analysis of the PDF content",
  "fileName": "filename.pdf"
}
```

## Configuration Options

Edit `appsettings.Development.json`:

```json
{
  "Ollama": {
    "Enabled": true,        // Enable/disable AI features
    "Endpoint": "http://localhost:11434",  // Ollama server URL
    "Model": "llama3",      // Model to use
    "TimeoutSeconds": 120,  // Request timeout
    "MaxTokens": 2048,      // Max response tokens
    "Temperature": 0.7       // Creativity (0=deterministic)
  }
}
```

## Security Notes (Following Guide)

- ✅ Secrets are not in source control
- ✅ Feature flag can disable AI instantly (`Enabled: false`)
- ✅ Input validation for file types (PDF only)
- ✅ Response sanitization before returning to frontend
- ✅ Controlled error responses

## Troubleshooting

### "Ollama service unavailable"
```bash
ollama serve &
# Make sure port 11434 is not blocked
lsof -i :11434
```

### "Model not found"
```bash
ollama pull llama3
```

### Analysis returns empty response
- Ensure Ollama is running
- Check model is pulled: `ollama list`
- Try a different model if needed

## Architecture (Following Guide)

This implementation follows the AI Foundry Integration Guide pattern:

1. **Backend-first architecture**: Frontend calls backend API, not Ollama directly
2. **Reusable AI client**: OllamaPdfClient handles all API calls
3. **Scoped context**: Only extracts PDF content needed for analysis
4. **Strict output validation**: Validates response format before returning
5. **Feature-flagged endpoints**: Disabled by default in production
6. **Graceful fallbacks**: Returns controlled errors when AI unavailable

## License

MIT