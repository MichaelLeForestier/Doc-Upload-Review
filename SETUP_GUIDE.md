# Complete Setup Guide for Lor - AI-Powered PDF Analysis Application

**Last Updated:** 2026-09-19  
**Version:** 1.0.0

---

## 📋 Overview

This guide provides step-by-step instructions to set up and run the **Lor** application, which uses local LLMs (via Ollama) to analyze PDF documents.

---

## 🎯 What This Application Does

The Lor application is a full-stack solution for:
- **PDF Analysis**: Upload PDFs and get AI-generated summaries
- **Content Extraction**: Extract text content from PDF files
- **Smart Summarization**: Get concise summaries of document content
- **Local Processing**: All processing happens on your machine - no data leaves your system

---

## ✅ System Requirements

### Hardware Requirements
- **RAM**: 8 GB minimum (16 GB recommended for better performance)
- **Storage**: 20 GB free space (for models and dependencies)
- **GPU** (Optional): NVIDIA GPU with 6+ GB VRAM for faster inference

### Software Requirements
| Component | Version | Source |
|-----------|---------|--------|
| Node.js | v18 or higher | [nodejs.org](https://nodejs.org/) |
| .NET 8 SDK | v8.0 or higher | [dotnet.microsoft.com](https://dotnet.microsoft.com/download) |
| Ollama | Latest version | [ollama.ai](https://ollama.ai) |
| Git | Any recent version | [git-scm.com](https://git-scm.com/) |

### Operating Systems Supported
- ✅ macOS (12.0 or later)
- ✅ Windows 10/11 (64-bit)
- ✅ Linux (Ubuntu 20.04+, Debian 10+, Fedora, etc.)

---

## 📥 Initial Setup

### Step 1: Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/YOUR_USERNAME/Lor.git
cd Lor

# Or using SSH
git clone git@github.com:YOUR_USERNAME/Lor.git
cd Lor
```

---

### Step 2: Install Backend Dependencies (.NET API)

```bash
cd /Users/michael/Documents/Dev/Lor/API

# Restore NuGet packages
dotnet restore

# Build the project
dotnet build

# Expected output:
# Build succeeded in 0.1s
# The Lor project will be produced at [path to bin]
```

---

### Step 3: Install Frontend Dependencies (React)

```bash
cd /Users/michael/Documents/Dev/Lor/Frontend

# Install npm packages
npm install

# Expected output:
# added XXXXX packages in YY seconds
# total XXXXX packages are installed
```

---

## 🧪 Ollama Setup

### Step 4: Install Ollama

#### For macOS:

**Option A: Using Homebrew (Recommended):**

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Ollama
brew install ollama
```

**Option B: Using the official installer:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```


---

## 📚 Additional Resources

- [Ollama Documentation](https://ollama.ai/docs)
- [React Official Docs](https://react.dev/)
- [Material UI Components](https://mui.com/material-ui/getting-started/usage/)
- [.NET API Documentation](https://docs.microsoft.com/dotnet/api/)
- [PDFPig Documentation](https://github.com/EvotecSupport/pdfpig)

---

## 🤝 Support

For issues, questions, or feature requests:

1. **GitHub Issues**: Create an issue at the repository
2. **Documentation**: Check `README.md` and other docs in the repo
3. **FAQ**: See the FAQ section in `README.md`

---

## ✅ Completion Checklist

After completing this guide, you should be able to:

- [ ] Install Ollama on your system
- [ ] Pull and run an AI model
- [ ] Configure the API to use Ollama
- [ ] Build and run both frontend and backend
- [ ] Upload and analyze PDFs in the application
- [ ] Troubleshoot common issues

**Congratulations! You're now running Lor!** 🎉


```

```


---

## 🔒 Security Best Practices

### For Development

- ✅ Never commit `.env` files with secrets
- ✅ Use `appsettings.Development.json` for local config
- ✅ Validate file uploads on the backend (not just frontend)

### For Production

1. **Update CORS settings** for your production domain:
   ```json
   {
     "Cors": {
       "AllowedOrigins": ["https://your-production-domain.com"]
     }
   }
   ```

2. **Secure Ollama**:
   - Don't expose Ollama to the public internet
   - Use reverse proxy (Nginx, Apache) if needed
   - Restrict network access to localhost only

3. **Keep dependencies updated**:
   ```bash
   cd Frontend && npm update
   cd ../API && dotnet restore
   ```


#### For Linux:

```


---

## 📊 Monitoring and Maintenance

### Check Application Logs

```bash
# Backend logs (depending on setup)
tail -f /Users/michael/Documents/Dev/Lor/API/logs/Application.log

# Frontend build artifacts
ls /Users/michael/Documents/Dev/Lor/Frontend/build/

# View all processes
ps aux | grep -E 'dotnet|node'
```

---

### Restart Services

If the application behaves unexpectedly:

```bash
# Stop services (Ctrl+C in each terminal)

# Clear Ollama cache (optional, for testing)
ollama rm llama3
ollama pull llama3

# Restart both services
cd /Users/michael/Documents/Dev/Lor/API && dotnet run &
sleep 2
cd ../Frontend && npm start
```


```bash
curl -fsSL https://ollama.com/download/ollama-linux-amd64.tgz -o ollama.tar.gz
```


---

### Problem: CORS errors on frontend

**Solution:**

```bash
# Open appsettings.Development.json and add your frontend URL:
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://your-domain.com"
    ]
  }
}

# Then rebuild the backend
cd /Users/michael/Documents/Dev/Lor/API
dotnet build && dotnet run
```

---

### Problem: Slow analysis results

**Causes:**
- Large PDF files (>120 pages)
- Model not cached in memory
- Hardware limitations

**Solutions:**
1. Use smaller models for faster responses
2. Keep the model loaded: `ollama run llama3` (keeps it warm)
3. Split large documents if needed
4. Consider using a GPU


tar -xzf ollama.tar.gz -C /usr/local
ollama serve &
```


---

## 🐛 Troubleshooting

### Problem: "Ollama service unavailable"

**Solution:**

```bash
# Make sure Ollama is running
ollama serve &

# Check if port 11434 is in use
lsof -i :11434

# If another process is using the port, kill it:
kill <PID>

# Restart Ollama
killall ollama
ollama serve &
```

---

### Problem: "Model not found" error

**Solution:**

```bash
# List available models
ollama list

# Pull a model (this may take several minutes)
ollama pull llama3

# Verify it's loaded
ollama run llama3 --version
```

---

### Problem: "No text could be extracted" from PDF

**Possible Causes:**
- The PDF is an image-only (scanned) document
- The PDF uses unusual fonts or formatting

**Solutions:**
1. Use a different model optimized for OCR
2. Convert the PDF to text first using OCR tools like Tesseract
3. Ensure the PDF is not image-based


```

```


---

## 🧪 Testing the Application

### Test 1: Verify Backend is Running

```bash
# Open browser and go to http://localhost:5050/weatherforecast
# Or use curl:
curl http://localhost:5050/weatherforecast

# Expected response: JSON with weather forecast data
```

---

### Test 2: Test PDF Analysis API

```bash
# Create a test PDF (for demo purposes)
echo "Test content" > /tmp/test.txt
# Convert to PDF using any tool

# Upload the file via curl:
curl -X POST http://localhost:5050/api/analyze-pdf \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/test.pdf"

# Expected response:
{
  "thinking": ["Extracting document metadata", "..."],
  "answer": "AI analysis of your PDF...",
  "fileName": "test.pdf"
}
```

---

### Test 3: Open the Frontend in Browser

1. Start both backend and frontend servers (as shown above)
2. Open http://localhost:3000 in your browser
3. You should see the Material UI interface
4. Drag and drop a PDF file to test the analysis feature


#### For Windows:

```


---

## 🚀 Running the Application

### Option 1: Run Both Services Separately (Recommended for Development)

**Terminal 1 - Start Backend:**

```bash
cd /Users/michael/Documents/Dev/Lor/API

# Build and run
dotnet build
dotnet run

# Expected output:
# Application started. Press Ctrl+C to shut down.
# Listening on: http://localhost:5050
```

**Terminal 2 - Start Frontend:**

```bash
cd /Users/michael/Documents/Dev/Lor/Frontend

# Start development server
npm start

# Expected output:
# Compiled successfully!
# You can now view the application in the browser.
// Opening http://localhost:3000...
```

---

### Option 2: Run Using the Quick Start Script

```bash
# Make script executable if needed
chmod +x /Users/michael/Documents/Dev/Lor/test-ollama-setup.sh

# Run the setup and start script
cd /Users/michael/Documents/Dev/Lor
./test-ollama-setup.sh

# The script will:
# 1. Verify Ollama is installed and running
# 2. Pull a model if needed
# 3. Show you the next steps
```

---

### Option 3: Production Deployment Script

For production deployments, use this command to start both services in background:

```bash
cd /Users/michael/Documents/Dev/Lor/API

# Start backend in background
dotnet build -c Release
dotnet run --no-build &

sleep 2

cd ../Frontend

# Start frontend
npm start > /dev/null 2>&1 &

echo "Both services started!"
```


1. Download the installer from [Ollama's website](https://ollama.ai/download/windows)
2. Run the installer and follow the prompts
```


### Step 7: Configure Ollama Connection

Edit `appsettings.Development.json` in the `/API` directory:

```bash
cd /Users/michael/Documents/Dev/Lor/API
nano appsettings.Development.json
# Or use any text editor: code, vim, nano, etc.
```

Update the configuration:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000"
    ]
  },
  "Ollama": {
    "Enabled": true,
    "Endpoint": "http://localhost:11434",
    "Model": "llama3",
    "TimeoutSeconds": 120,
    "MaxTokens": 2048,
    "Temperature": 0.7
  }
}
```

**Configuration Options Explained:**

| Setting | Type | Default Value | Description |
|---------|------|---------------|-------------|
| `Enabled` | Boolean | `true` | Set to `false` to disable AI features |
| `Endpoint` | String | `http://localhost:11434` | Ollama server address |
| `Model` | String | `llama3` | Which model to use |
| `TimeoutSeconds` | Integer | `120` | Maximum time for API call (seconds) |
| `MaxTokens` | Integer | `2048` | Maximum number of tokens in response |
| `Temperature` | Float | `0.7` | 0=deterministic, 1=creative |


3. Restart your computer if prompted
Restart your computer if prompted


### Step 5: Verify Ollama Installation

```bash
# Check Ollama version
ollama --version

# Expected output:
# ollama version 0.x.x

# Check if server is running
ps aux | grep ollama
# Should show the ollama process running

# Or check port 11434
lsof -i :11434
# Should show Ollama listening on localhost:11434
```

---

### Step 6: Pull a Model

This step downloads an AI model that will be used for PDF analysis. This may take several minutes depending on your internet connection.

```bash
# Recommended models for PDF analysis:
ollama pull llama3

# Alternative models you can use:
ollama pull mistral
ollama pull gemma2
ollama pull mxbai-embed-large

# Verify the model is installed
ollama list

# Expected output:
# NAME           ID               SIZE      MODIFIED
# llama3         bla123...        4.7 GB    5 minutes ago
```



