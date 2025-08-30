# 🖼️ Smart Visual Product Finder

> A modern web app that allows users to upload an image and instantly discover visually similar products.  
> Built as part of a technical assessment, this project highlights **problem-solving**, **clean architecture**, and **real-world usability**.

---

## ✨ Core Highlights

### 📤 Image Upload Options

- Drag & Drop or file selection
- Paste image URLs for instant analysis
- Support for multiple formats: `.jpg`, `.png`, `.webp`

### 🔎 Smart Search & Matching

- Side-by-side view of uploaded image + matching results
- AI-driven scoring system for **accuracy and ranking**
- Filter results by **score** or **product category**
- Works seamlessly on **desktop & mobile**

### 📚 Product Knowledge Base

- 50+ preloaded products with rich metadata
- Fields: `title`, `category`, `brand`, `tags`, `color palette`, `description`
- Backed by **AI-enhanced product analysis** (Google Gemini AI)

### 🌟 User-Focused Experience

- Smooth loader animations during processing
- Meaningful error feedback (bad input, upload errors, etc.)
- Responsive & modern design powered by TailwindCSS
- Intuitive layout for quick discovery

---

## 🛠️ Tech Stack

**Frontend**

- ⚛️ Next.js 13 (App Router) + TypeScript
- 🎨 TailwindCSS for styling
- 🎬 Framer Motion for animations
- 🧩 Radix UI components

**Backend & Database**

- 🍃 MongoDB + Mongoose ORM
- ⚡ Next.js API routes (serverless)
- Optimized queries using compound + text indexes

**AI Integration**

- 🤖 Google Gemini AI for image analysis
- Multi-modal input handling (image + text)
- Scoring logic combining **semantic tags**, **color analysis**, **brand recognition**, and **category matching**

---

## 🏗️ Architecture Overview

---

## 🚀 Quick Start

### 📌 Prerequisites

- Node.js ≥ 18
- MongoDB instance
- Google Gemini API Key

### ⚡ Installation

```bash
# Clone repository
git clone https://github.com/Aslaan001/Image-Analayzing-Tool.git
cd Image-Analayzing-Tool

# Install dependencies
npm install
⚙️ Environment Setup

Create .env.local from the example file:

cp .env.example .env.local


Fill in required keys:

MONGODB_URI=your_mongo_uri
GEMINI_API_KEY=your_google_gemini_key

🗄️ Database Setup
node scripts/migrate-products.js

▶️ Run Development Server
npm run dev


App runs on http://localhost:3000

🏭 Production
npm run build
npm start

```
