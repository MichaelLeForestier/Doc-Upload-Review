# Lor - Full-Stack AI-Powered PDF Analysis Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)](https://reactjs.org/)
[!.NET](https://img.shields.io/badge/.NET-8.x-512be4?logo=.net)](https://dotnet.microsoft.com/)
[![Ollama](https://img.shields.io/badge/Ollama-local%20LLM-green?logo=ollama)](https://ollama.ai/)

<div align="center">

**AI-powered PDF analysis and summarization using local LLMs via Ollama**

</div>
</div>

---

---

## ✨ Features

- 📄 **Drag-and-Drop Upload**: Intuitive interface for uploading PDF files
- 🤖 **Local AI Analysis**: Uses Ollama with models like Llama3, Mistral, etc.
- 🔍 **Smart Extraction**: Extracts and analyzes text content from PDFs
- 📊 **Thinking Steps Display**: Shows the AI's analysis process in real-time
- 🛡️ **Secure & Private**: All processing happens locally on your machine
- ⚙️ **Feature Flagged**: Can enable/disable AI features instantly via configuration
- 🎨 **Modern UI**: Clean Material Design interface with error handling

---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| **React 18** | Frontend framework |
| **Material UI** | UI component library |
| **.NET 8** | Backend API framework |
| **Ollama** | Local LLM inference server |
| **PdfPig** | PDF text extraction library |
| **Axios** | HTTP client for API calls |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

1. **[Node.js](https://nodejs.org/)** (v18 or higher)
2. **[Ollama](https://ollama.com/)** - For running local LLMs
3. **.NET 8 SDK** ([Download here](https://dotnet.microsoft.com/download))
4. **[Git](https://git-scm.com/)** - For cloning the repository

---

### Installation

#### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Lor.git
cd Lor
```

#### Step 2: Install Dependencies

**Backend (.NET API):**

```bash
cd /Users/michael/Documents/Dev/Lor/API
dotnet restore
```

**Frontend (React):**

```bash
cd /Users/michael/Documents/Dev/Lor/Frontend
npm install
```

#### Step 3: Install and Start Ollama

```bash
# Install Ollama (macOS)
brew install ollama || curl -fsSL https://ollama.com/install.sh | sh

# Verify installation
ollama --version

# Start the Ollama server
ollama serve &

# Pull a model (this may take several minutes on first run)
ollama pull llama3
```

---

---

### Running the Application

#### Option 1: Run Both Services in Separate Terminals

**Terminal 1 - Backend (.NET API):**

```bash
cd /Users/michael/Documents/Dev/Lor/API
dotnet build
dotnet run
```

Expected output: `Application started. Press Ctrl+C to shut down.`  
API running on: `http://localhost:5050`

**Terminal 2 - Frontend (React):**

```bash
cd /Users/michael/Documents/Dev/Lor/Frontend
npm start
```

Expected output: Application compiled successfully...  
Frontend running on: `http://localhost:3000`

#### Option 2: Run Using the Quick Start Script

```bash
# Ensure you're in the project root
chmod +x test-ollama-setup.sh
./test-ollama-setup.sh
```

This script will:
1. Check if Ollama is installed and running
2. Pull a suitable model if needed
3. Show the project structure and next steps

---

### Quick Start with One Command

```bash
# This single command installs everything and starts both servers
cd /Users/michael/Documents/Dev/Lor && \
  (./test-ollama-setup.sh || true) && \
  dotnet build -c Release -p:PublishWithAspNetCoreTargetManifest=false & && \
  cd API && dotnet run & && \
  cd ../Frontend && npm start
```

---

## 📡 API Reference

### Base URL

`http://localhost:5050` (or configured endpoint in `appsettings.Development.json`)

---

#### POST /api/analyze-pdf

Analyzes a PDF file and returns an AI-generated summary.

**Request:**

```bash
curl -X POST http://localhost:5050/api/analyze-pdf \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/document.pdf"
```

**Response:**

```json
{
  "thinking": [
    "Extracting document metadata",
    "Analyzing content structure",
    "Generating summary"
  ],
  "answer": "This document covers the fundamentals of artificial intelligence, including machine learning algorithms, neural networks, and practical applications...",
  "fileName": "document.pdf"
}
```

**Response Codes:**

| Code | Description |
|------|-------------|
| `200` | Analysis successful |
| `400` | Invalid request (no file, wrong format) |
| `503` | AI service unavailable |

---

---

## 📁 Project Structure

```
Lor/
├── README.md                    # This file - Project documentation
├── SETUP_GUIDE.md              # Comprehensive setup instructions
├── API/                        # .NET Backend API
│   ├── OllamaPdfService/      # AI service classes
│   │   ├── OllamaClient.cs    # Ollama HTTP client
│   │   ├── PdfAnalyzer.cs     # PDF analysis logic
│   │   └── Options/           # Configuration options
│   ├── appsettings.json       # Production config
│   ├── appsettings.Development.json  # Development config
│   ├── Program.cs             # API entry point
│   ├── API.http               # API client for testing
│   └── obj/                   # Build artifacts
│       └── Debug/
│           └── net10.0/
│               ├── staticwebassets.build.json
│               ├── staticwebassets.build.endpoints.json
│               └── API.deps.json
│
├── Frontend/                   # React Frontend
│   ├── public/
│   │   ├── index.html         # HTML entry point
│   │   └── images/            # App screenshots and assets
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── index.jsx         # React entry point
│   │   ├── index.css         # Global styles
│   │   ├── components/       # UI components
│   │   │   ├── UploadZone.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── ErrorAlert.jsx
│   │   │   └── AnalysisResult.jsx
│   │   ├── hooks/
│   │   │   └── usePdfAnalysis.jsx
│   │   └── theme.js          # Material UI theme
│   ├── .env                  # Environment variables
│   ├── package.json          # Dependencies
│   └── package-lock.json     # Lock file
├── test-ollama-setup.sh      # Quick start script
└── PROJECT_SUMMARY.md        # Initial project summary
```

---

## 🔒 Security

This project follows security best practices:

- ✅ **Feature Flag**: AI can be disabled instantly via configuration
- ✅ **Input Validation**: Only PDF files are accepted (file extension check)
- ✅ **Response Sanitization**: Removes code fences and normalizes output
- ✅ **No Secrets in Logs**: Sensitive data is never logged
- ✅ **CORS Protection**: Configurable allowed origins for frontend
- ✅ **Timeout Protection**: Prevents hanging requests with configurable timeouts

---

## 🐛 Troubleshooting

### "Ollama service unavailable"

**Solution:** Ensure Ollama server is running:

```bash
# Check if Ollama is running
ollama list

# Start the server
ollama serve &

# Verify it's listening on port 11434
lsof -i :11434
```

### "Model not found"

**Solution:** Pull a model:

```bash
ollama pull llama3
# or try other models: mistral, gemma, etc.
```

### "No text could be extracted"

**Possible Causes:**
- PDF is an image-only (scanned) document
- PDF uses unusual fonts or formatting

**Solution:** Convert images to text first using OCR before analysis.

### CORS Errors on Frontend

**Solution:** Check `appsettings.Development.json` and add your frontend URL:

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000"
    ]
  }
}
```

### Slow Analysis Results

**Possible Causes:**
- Large PDF files (>120 pages)
- Low-powered hardware running local models
- Model not loaded in Ollama cache

**Solution:** 
- Use smaller models for faster responses
- Keep models loaded: `ollama run llama3` (keeps it warm)
- Split large documents if needed

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


### FAQ

**Q: Can I use my own models?**  
A: Yes! Simply change the `Model` setting in `appsettings.Development.json` to any model available in Ollama.

**Q: Does this work on Windows?**  
A: Yes, but you'll need to install Ollama for Windows first. See [Ollama's Windows installation guide](https://ollama.ai/download/windows).

**Q: What about scanned PDFs (image-only)?**  
A: Currently the app extracts text from vector-based PDFs. For scanned images, consider adding an OCR step using Tesseract or similar.

**Q: Can I run this in production?**  
A: Yes! Follow these steps:
1. Update CORS settings for your domain
2. Use `appsettings.Production.json` instead of Development config
3. Secure your Ollama instance on the server

**Q: How much VRAM do I need?**  
A: It depends on the model:
- llama3 (8B): ~6 GB VRAM recommended
- mistral: ~4 GB VRAM
- Smaller models: 2-4 GB should suffice

---

## 📞 Support

For issues, questions, or feature requests:
- [Create an Issue](https://github.com/YOUR_USERNAME/Lor/issues)
- Email: support@example.com


