<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/14Wd4BtwCG-E1PHhP9FTTw3DKaY1z1V82

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# 🚀 DjangoDeploy GenAI

**DjangoDeploy GenAI** is an intelligent deployment assistant that automates the complex process of hosting Django applications on Ubuntu VPS servers. 

Built with **React**, **TypeScript**, and **Google Gemini 2.5**, this tool acts as an AI DevOps engineer. It takes your project details and generates a robust, production-ready "Zero-Touch" Bash script that handles the entire stack configuration—from system dependencies to SSL certification.

## ✨ Key Features

*   **🤖 AI-Architected Stack:** Generates custom Nginx, Gunicorn, and Systemd configurations tailored to your specific project structure.
*   **⚡ Zero-Touch Automation:** Produces a single `deploy_app.sh` script that automates:
    *   System dependency installation (`apt`, `pip`, `venv`).
    *   **PostgreSQL** database & user creation.
    *   **Django Superuser** auto-creation.
    *   Static file collection & Nginx aliasing.
    *   SSL Certificate setup via **Certbot** (Let's Encrypt).
    *   Firewall (UFW) configuration.
*   **🔒 Secure by Design:** 
    *   No SSH keys are sent to the server.
    *   Generates an SSH tunneling command to execute the deployment script locally against your remote server.
    *   Injects secrets directly into a production `.env` file.
*   **🛠️ Tech Stack:**
    *   React 19 & TypeScript
    *   Tailwind CSS (UI/UX)
    *   Google GenAI SDK (Gemini 2.5 Flash)
    *   Lucide React (Icons)

## 📋 Prerequisites

To use the generated scripts, you need:
1.  An **Ubuntu 22.04/24.04 VPS** (fresh install recommended).
2.  **SSH Access** (root or sudo user).
3.  A **Domain Name** pointing to your server IP.

## 🛠️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/django-deploy-genai.git
    cd django-deploy-genai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add your Google Gemini API key:
    ```env
    API_KEY=your_google_genai_api_key_here
    ```

4.  **Run the App**
    ```bash
    npm start
    # or
    npm run dev
    ```

## 🚀 Usage Workflow

1.  **Project Details:** Enter your GitHub URL, branch, and python version.
2.  **Server Config:** Provide your VPS IP, SSH User, and Domain Name.
3.  **App & DB:** Configure your Database name, User, Password, and Admin credentials.
4.  **Generate:** The AI Agent creates a custom `deploy_app.sh`.
5.  **Deploy:** Run the provided one-line SSH command in your terminal to deploy instantly.

## ⚠️ Disclaimer

This tool uses an LLM (Large Language Model) to generate deployment scripts. While the prompts are engineered for security and stability, always review the generated code before running it on a production server.
