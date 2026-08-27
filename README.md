# AI Productivity Assistant

A modern, responsive **AI Workplace Productivity Assistant** designed to help professionals plan their workload, conduct research, and get AI-powered workplace assistance from a single interface.

The application is built as a **frontend-only prototype/MVP**, requiring no user account, authentication, database, or backend.

## 🚀 Project Overview

The AI Productivity Assistant provides professionals with an intuitive workspace for managing everyday tasks and using AI to improve productivity.

Users can:

* Plan their day or week using AI-assisted scheduling
* Prioritise workplace tasks
* Research and summarise information
* Generate insights and recommendations
* Interact with an AI workplace chatbot
* Manage tasks through a central dashboard
* Save research during their current session

The application is designed to demonstrate how AI can be integrated into a modern workplace productivity platform.

## ✨ Features Implemented

### Dashboard

* Productivity overview
* Today's tasks
* Upcoming tasks
* Productivity score
* Recent AI activity
* Quick AI actions

### AI Task Planner

* Add and manage tasks
* Set task priorities
* Add deadlines
* Estimate task duration
* Generate daily schedules
* Generate weekly schedules
* AI-assisted task prioritisation
* Timeline-based schedule display
* Complete, edit and delete tasks

### AI Research Assistant

* Research topic input
* Article/text input
* AI-generated summaries
* Key points extraction
* Insights generation
* Recommendations
* Simple explanations
* Question generation
* Copy and regenerate responses
* Session-based saved research

### AI Workplace Assistant

* Conversational AI interface
* Workplace-focused suggested prompts
* User/AI message interface
* Loading/typing states
* Clear conversation functionality
* Context-aware mock AI responses

### Task Management

* Task list
* Search
* Filtering
* Priority indicators
* Status management
* Due dates
* Task completion

### Responsive Design

* Desktop dashboard
* Tablet optimisation
* Mobile navigation
* Responsive cards
* Mobile-friendly forms
* Responsive AI chat interface
* Responsive task scheduling

### Responsible AI

The application includes a Responsible AI disclaimer informing users that AI-generated information may contain inaccuracies and should be reviewed before making important decisions.

## 🛠️ Technologies & Tools

* React
* JavaScript / TypeScript
* Vite
* HTML5
* CSS3
* Responsive Web Design
* Modern component-based architecture
* AI/LLM-ready service architecture
* Git
* GitHub
* Lovable

## 🔐 Privacy & Architecture

This project is intentionally designed as a **frontend-only application**.

It does not require:

* User registration
* Login
* Passwords
* User accounts
* A backend server
* A database
* Supabase
* Firebase
* Persistent cloud storage

No personal user information is required.

Application data is maintained in frontend/browser state and may be reset when the application is refreshed.

The AI functionality currently uses demonstration/mock responses where a real AI API is not configured.

The AI service is structured so that a production LLM API can be integrated in the future without requiring a complete redesign of the application.

## 💻 Setup Instructions

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/AI-Productivity-Assistant.git
```

### 2. Navigate to the project

```bash
cd AI-Productivity-Assistant
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application should then be available at the local development URL provided by Vite, typically:

```text
http://localhost:5173
```

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

## 📱 Responsive Support

The application is designed to provide a consistent experience across:

* Desktop
* Laptop
* Tablet
* Mobile devices

## 🤖 AI Integration

The current application uses frontend-based demonstration AI responses.

The architecture is intentionally designed to allow a real AI provider/API to be connected later.

Potential future integrations include:

* OpenAI API
* Microsoft Azure AI
* Google Gemini
* Anthropic Claude
* Other compatible LLM providers

Any production API integration should be implemented securely through an appropriate backend or serverless environment rather than exposing API credentials in frontend code.

## 🔮 Future Improvements

Potential future features include:

* Real LLM integration
* Calendar integration
* Microsoft 365 integration
* Google Workspace integration
* Email summarisation
* Meeting summarisation
* AI-generated meeting agendas
* Browser notifications
* Export schedules to calendar
* Advanced productivity analytics
* Voice-based AI assistant
* Document analysis

## ⚠️ Responsible AI

AI-generated content can contain inaccurate, incomplete, or outdated information.

Users should verify important information before relying on AI-generated recommendations or making professional, financial, legal, or business decisions.

Do not enter confidential, sensitive, proprietary, or personally identifiable information into the application unless appropriate safeguards and organisational approval are in place.

## 📄 License

This project is intended as a demonstration/MVP project.

Add an appropriate open-source license if the project will be publicly distributed.
