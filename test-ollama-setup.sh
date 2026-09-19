#!/bin/bash

# Quick Start Script for Ollama PDF Analysis

echo "=== Ollama PDF Analysis - Quick Start ==="
echo ""

# Step 1: Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed!"
    echo "Please install first:"
    echo "  macOS: brew install ollama || curl -fsSL https://ollama.com/install.sh | sh"
    echo "  Linux: see https://ollama.ai/download"
    echo "  Windows: see https://ollama.ai/download"
    exit 1
fi

echo "✅ Ollama is installed"

# Step 2: Check if Ollama server is running
if ! pgrep -x "ollama" > /dev/null; then
    echo ""
    echo "🔄 Starting Ollama server..."
    ollama serve &
    sleep 3
fi

echo "✅ Ollama server should be running on http://localhost:11434"

# Step 3: Check if a model is available
MODEL=$(ollama list --no-pager -f '{{.Name}}' | grep -m1 -E '^(llama|mistral|gemma)' || echo "")

if [ -z "$MODEL" ]; then
    echo ""
    echo "⚠️  No suitable model found. Pulling llama3..."
    echo "   This may take a few minutes on first run."
    ollama pull llama3
    
    if [ $? -eq 0 ]; then
        echo "✅ Model pulled successfully"
    else
        echo "❌ Failed to pull model. Please run: ollama pull llama3"
    fi
else
    echo "✅ Model available: $MODEL"
fi

# Step 4: Show project structure
echo ""
echo "=== Project Structure ==="
echo ""
echo "Backend (.NET API):"
echo "  /Users/michael/Documents/Dev/Lor/API/"
echo "    - Program.cs (with PDF analysis endpoint)"
echo "    - OllamaPdfService/ (AI service classes)"
echo "    - appsettings.Development.json (Ollama config enabled)"
echo ""
echo "Frontend (React):"
echo "  /Users/michael/Documents/Dev/Lor/Frontend/src/"
echo "    - App.jsx (with PDF drag-and-drop UI)"
echo ""

# Step 5: Run instructions
echo "=== Next Steps ==="
echo ""
echo "1. Build and run the backend:"
echo "   cd /Users/michael/Documents/Dev/Lor/API"
echo "   dotnet build"
echo "   dotnet run"
echo ""
echo "2. In another terminal, start the frontend:"
echo "   cd /Users/michael/Documents/Dev/Lor/Frontend"
echo "   npm start"
echo ""
echo "3. Open browser to http://localhost:3000"
echo ""
echo "4. Drag and drop a PDF file to see AI analysis!"
echo ""

# Step 6: Test API endpoint (optional, requires backend running)
echo ""
echo "=== Testing API Endpoint ==="
echo ""
if curl -s http://localhost:5050/health &> /dev/null; then
    echo "✅ Backend API is responding on port 5050"
else
    echo "⚠️  Backend not running yet. Start with: dotnet run in /API folder"
fi

echo ""
echo "=== Ready! ==="
echo "Once both frontend and backend are running, drag a PDF file to the upload zone."