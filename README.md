# 🚔 AI Vision FIR  
### Intelligent Computer Vision–Powered First Information Report Automation System

---

## 📌 Overview

AI Vision FIR is an AI-powered platform that automates FIR (First Information Report) generation using Computer Vision and Natural Language Processing.  
The system analyzes images, videos, voice, and text inputs to extract key details and generate a structured FIR draft in minutes.

This project aims to enhance transparency, speed, and accuracy in crime reporting systems.

---

## 🚨 Problem Statement

The traditional FIR filing process is manual, time-consuming, and prone to errors.  
Visual evidence is not automatically analyzed, classification depends on human interpretation, and language barriers make reporting difficult for many citizens.

AI Vision FIR solves this by integrating AI-based automation into the reporting workflow.

---

## 💡 Solution

The system uses:

- Computer Vision for object and scene detection  
- NLP for entity extraction and crime classification  
- Speech-to-Text for multilingual voice reporting  
- Automated FIR draft generation  
- Duplicate detection and analytics dashboard  

---

## 🏗️ System Architecture

1. **User Interface Layer** – Web frontend for citizens and authorities  
2. **Application Layer** – Backend API handling & authentication  
3. **AI Processing Layer** – Vision + NLP + Classification modules  
4. **Database Layer** – Secure storage of FIR records  

Microservices architecture ensures scalability.

---

## 🛠️ Technology Stack

### Languages
- Python
- JavaScript

### Frameworks
- FastAPI / Flask (Backend)
- React.js (Frontend)

### AI/ML Libraries
- PyTorch / TensorFlow
- Transformers (BERT / Granite)
- OpenCV
- YOLO (Object Detection)

### Database
- PostgreSQL
- MongoDB

### Cloud
- IBM Cloud Lite

### Tools
- Docker
- GitHub
- Postman

---

## 🔄 System Workflow

1. User logs in
2. Uploads image/video OR gives voice/text complaint
3. Speech module converts voice to text
4. NLP extracts key entities (location, names, date, crime type)
5. Vision model analyzes evidence
6. Classification engine predicts crime category
7. FIR draft is auto-generated
8. User reviews and submits
9. Data stored in database & dashboard updated

---

## ✨ Key Features

- Automated visual evidence analysis  
- Multilingual voice-based reporting  
- Intelligent entity extraction  
- Crime category prediction  
- Structured FIR generation  
- Duplicate complaint detection  
- Crime heatmap analytics  
- Role-based authentication  

---

## 🔌 APIs Used

- Whisper / IBM Speech-to-Text API
- NLP Transformer APIs
- YOLO Detection API
- Google Maps / Mapbox API

---

## 📊 Datasets Used

- COCO Dataset (object detection)
- Public crime datasets
- Custom FIR training dataset

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/ai-vision-fir.git
cd ai-vision-fir
