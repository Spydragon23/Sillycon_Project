# Sillycon_Project
# 🌐 Dark Web Dating Sim - Backend
https://www.youtube.com/watch?v=-a2QV6ri5DM

A FastAPI backend for a hilarious dating simulator where you chat with criminals who try to scam you while flirting!

## 🎭 Characters

- **🏴‍☠️ Pirate Identity Thief** - Flirts while asking for your SSN and mother's maiden name
- **👹 Internet Troll Scammer** - Begs for Venmo and gift cards while confessing love
- **🐱 Hitman Cat** - Offers assassination services as romantic date activities

---

## 🚀 How to Start the Server

### Prerequisites

- **Python 3.8 or higher** installed
- **OpenAI API Key** from https://platform.openai.com/api-keys

### Step-by-Step Setup

#### 1. Navigate to Backend Folder

Open PowerShell and navigate to the backend directory:

```powershell
cd path\to\your\project\backend
```

#### 2. Create Virtual Environment

```powershell
python -m venv venv
```

This creates an isolated Python environment for the project.

#### 3. Activate Virtual Environment

```powershell
.\venv\Scripts\Activate
```

You should see `(venv)` appear at the start of your terminal line.

#### 4. Install Dependencies

```powershell
pip install -r requirements.txt
```

This installs all required Python packages (see [What is requirements.txt?](#what-is-requirementstxt) below).

#### 5. Set Up Environment Variables

Create a `.env` file in the backend folder:

```powershell
copy .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-proj-your-full-api-key-here
```

**Important:** 
- Copy the ENTIRE key from OpenAI (100+ characters)
- No quotes around the key
- No spaces around the `=` sign

#### 6. Run the Server

```powershell
python main.py
```

**OR** using uvicorn directly:

```powershell
uvicorn main:app --reload
```

#### 7. Verify It's Running

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Open your browser and go to:
- **API Documentation:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

---

## 📦 What is requirements.txt?

The `requirements.txt` file is a list of all Python packages (libraries) that your project needs to run. Think of it as a shopping list for Python dependencies.

### Our Requirements:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
openai==1.6.1
python-dotenv==1.0.0
pydantic==2.5.0
```

### What Each Package Does:

#### 1. **fastapi** (v0.104.1)
- **What it is:** A modern, fast web framework for building APIs
- **Why we need it:** Powers our entire backend server
- **What it does:** Handles HTTP requests, routes, and responses

#### 2. **uvicorn[standard]** (v0.24.0)
- **What it is:** An ASGI server implementation
- **Why we need it:** Runs the FastAPI application
- **What it does:** Acts as the web server that receives and processes requests
- **Note:** `[standard]` includes additional optimizations and websocket support

#### 3. **openai** (v1.6.1)
- **What it is:** Official OpenAI Python client library
- **Why we need it:** Connects to OpenAI's GPT models
- **What it does:** Sends messages to GPT-4 and receives AI-generated responses

#### 4. **python-dotenv** (v1.0.0)
- **What it is:** Environment variable loader
- **Why we need it:** Loads your API key from the `.env` file
- **What it does:** Reads `.env` file and makes variables available to Python

#### 5. **pydantic** (v2.5.0)
- **What it is:** Data validation library
- **Why we need it:** Validates API requests and responses
- **What it does:** Ensures data has correct types and structure (e.g., messages are strings, history is a list)

---

## 🧪 Testing the API

### Using the Interactive Docs

1. Go to http://localhost:8000/docs
2. Click on `POST /api/chat`
3. Click "Try it out"
4. Paste this JSON:

```json
{
  "message": "Hey there!",
  "personality": "pirate_thief",
  "history": []
}
```

5. Click "Execute"
6. See the response!

### Using PowerShell (curl)

```powershell
curl -X POST "http://localhost:8000/api/chat" `
  -H "Content-Type: application/json" `
  -d '{\"message\":\"Hi!\",\"personality\":\"pirate_thief\",\"history\":[]}'
```

### Using PowerShell (Invoke-RestMethod)

```powershell
$body = @{
    message = "Tell me about yourself"
    personality = "hitman_cat"
    history = @()
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/chat" `
                  -Method Post `
                  -Body $body `
                  -ContentType "application/json"
```

---

## 🗂️ Project Structure

```
backend/
├── main.py                      # FastAPI application entry point
├── requirements.txt             # Python dependencies list
├── .env                         # Your API keys (create this!)
├── .env.example                # Template for .env
│
├── routers/
│   ├── __init__.py
│   └── chat.py                 # Chat endpoint with OpenAI integration
│
└── lib/
    ├── __init__.py
    └── personality_enhancer.py  # Personality transformation logic
```

---

## 🔧 Troubleshooting

### "python is not recognized"

Try:
```powershell
py -m venv venv
py main.py
```

### "Scripts execution is disabled"

Run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Module not found: openai"

Make sure virtual environment is activated:
```powershell
.\venv\Scripts\Activate
pip install -r requirements.txt
```

### "API key not found"

1. Make sure `.env` file exists in `backend/` folder
2. Check that it contains: `OPENAI_API_KEY=sk-proj-...`
3. No quotes, no spaces around `=`

### Port 8000 already in use

Use a different port:
```powershell
uvicorn main:app --reload --port 8001
```

---

## 🛑 Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

---

## 📝 Available Personalities

When calling the API, use these personality values:

- `pirate_thief` - Identity thief pirate 🏴‍☠️
- `troll_scammer` - Money-begging troll 👹
- `hitman_cat` - Professional assassin cat 🐱

---

## 🌐 API Endpoints

### POST /api/chat

Main chat endpoint for talking to criminal characters.

**Request:**
```json
{
  "message": "string",
  "personality": "pirate_thief | troll_scammer | hitman_cat",
  "history": [
    {
      "role": "user | assistant",
      "content": "string"
    }
  ]
}
```

**Response:**
```json
{
  "response": "Enhanced AI response with personality",
  "emotion": "flirty | panic | excited | talking",
  "shouldExpand": false
}
```

### GET /

Returns API status and available endpoints.

### GET /health

Simple health check endpoint (returns `{"status": "healthy"}`).

---

## 💰 OpenAI Costs

The API uses GPT-4 by default. Approximate costs:

- **GPT-4:** ~$0.03 per 1,000 tokens (characters)
- **GPT-3.5-turbo:** ~$0.002 per 1,000 tokens

To use the cheaper model, edit `routers/chat.py` line ~108:
```python
model="gpt-3.5-turbo"  # Change from "gpt-4"
```

---

## 🔒 Security Notes

- **Never commit `.env` file to Git** - it contains your API key
- **Never share your API key** - treat it like a password
- **Set up billing limits** on OpenAI dashboard to avoid unexpected charges

---

## 📚 Additional Resources

- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **OpenAI API Reference:** https://platform.openai.com/docs/
- **Python Dotenv:** https://github.com/theskumar/python-dotenv

---

## 🆘 Need Help?

If you're stuck:
1. Check the [Troubleshooting](#troubleshooting) section
2. Make sure virtual environment is activated
3. Verify your `.env` file has the full API key
4. Check server logs for error messages

---

## 📄 License

This is a hackathon project. Use and modify as you like!

---

**Made with 💕 (and criminal intent) for Sillycon Valley Hackathon 2025**
