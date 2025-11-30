import { GoogleGenAI } from "@google/genai";
import { DeploymentConfig, GeneratedScript } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert DevOps Engineer specializing in Django deployments on Ubuntu. 
You write robust, idempotent, non-interactive bash scripts.
Target OS: Ubuntu 22.04 LTS or 24.04 LTS.
Key Focus: Security, Handling Edge Cases (line endings, permissions, missing settings), and "Zero-Touch" automation.
`;

export const generateDeploymentScript = async (config: DeploymentConfig): Promise<GeneratedScript> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const envVarsString = config.envVars
    .map(v => `${v.key}=${v.value}`)
    .join('\n');

  const githubAuthRepo = config.githubToken 
    ? config.repoUrl.replace('https://', `https://${config.githubToken}@`) 
    : config.repoUrl;

  const prompt = `
    Create a highly robust "Zero-Touch" deployment script for a Django project on Ubuntu.
    
    CONFIGURATION:
    ---------------------------------------------------
    Repo: ${githubAuthRepo}
    Branch: ${config.branch}
    Domain: ${config.domainName}
    Server IP: ${config.serverIp}
    App Name: ${config.appName}
    WSGI: ${config.wsgiPath}
    Contact Email: ${config.email}
    
    Database:
    - Name: ${config.dbName}
    - User: ${config.dbUser}
    - Password: ${config.dbPassword}

    Superuser:
    - User: ${config.adminUser}
    - Email: ${config.adminEmail}
    - Pass: ${config.adminPassword}
    
    Extra Env Vars:
    ${envVarsString}
    ---------------------------------------------------

    CRITICAL REQUIREMENTS:

    1. **System Dependencies**: 
       - Install: \`pkg-config\`, \`libmysqlclient-dev\` (for broad compatibility), \`python3-pip\`, \`python3-venv\`, \`python3-dev\`, \`libpq-dev\`, \`postgresql\`, \`postgresql-contrib\`, \`nginx\`, \`curl\`, \`git\`, \`ufw\`, \`certbot\`, \`python3-certbot-nginx\`.
    
    2. **Git Safety**:
       - Run \`git config --global --add safe.directory /var/www/${config.domainName}\` to prevent ownership errors.

    3. **Application Setup & Settings Injection**:
       - Clone to \`/var/www/${config.domainName}\`.
       - Create venv.
       - Install \`requirements.txt\`.
       - Force install: \`gunicorn\`, \`psycopg2-binary\`.
       - **Settings.py Modification**: Append a code block to the end of \`settings.py\` to FORCE production settings. Do not rely on the user having these set correctly.
         - Set \`DEBUG = False\`
         - Set \`ALLOWED_HOSTS = ['${config.domainName}', '${config.serverIp}', 'localhost', '127.0.0.1']\`
         - Set \`STATIC_ROOT = '/var/www/${config.domainName}/static'\`
         - Set \`DATABASES\` config using credentials provided.
       - Create \`.env\` file with user variables.

    4. **Database & Migrations**:
       - Start Postgres.
       - Create DB/User idempotently.
       - Run \`python manage.py migrate\`.
       - Run \`python manage.py collectstatic --noinput\`.

    5. **Superuser Creation**:
       - Use environment variables (\`DJANGO_SUPERUSER_USERNAME\`, etc.) to run \`python manage.py createsuperuser --noinput\`.

    6. **Gunicorn with Socket Safety**:
       - Create directory \`/run/gunicorn/\` and assign ownership to the user (e.g., \`www-data\` or \`root\` depending on who runs the script, preferably run app as standard user or handle root correctly). 
       - For this script, assume running as root for setup, but Gunicorn should run as \`www-data\` or the current user. 
       - **Crucial**: Configure Gunicorn to bind to \`unix:/run/gunicorn/${config.appName}.sock\`.
       - Ensure systemd service file reflects this socket path.

    7. **Nginx**:
       - Configure standard proxy to the unix socket above.
       - **Static Files**: configure \`/static/\` location to alias \`/var/www/${config.domainName}/static/\` (MUST match the STATIC_ROOT set earlier).
       - Setup SSL with certbot.

    8. **Formatting**:
       - Use quoted heredocs (e.g., \`cat << 'EOF' > ...\`) when writing config files to prevent bash variable expansion issues during script execution.
       - Handle line endings (use \`sed -i 's/\r$//'\` on the generated file if needed, though usually fine via bash input).

    OUTPUT JSON FORMAT:
    {
      "bashScript": "...",
      "nginxConfig": "...",
      "gunicornConfig": "...",
      "explanation": "..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const data = JSON.parse(text);
    
    // Construct the one-liner command
    // Added -o StrictHostKeyChecking=no to avoid prompt on first connect
    const executionCommand = `ssh -o StrictHostKeyChecking=no ${config.sshUser}@${config.serverIp} "bash -s" < deploy_app.sh`;

    return {
      bashScript: data.bashScript || "# Error generating script",
      nginxConfig: data.nginxConfig || "# Error generating nginx config",
      gunicornConfig: data.gunicornConfig || "# Error generating gunicorn config",
      explanation: data.explanation || "No explanation provided.",
      executionCommand: executionCommand
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate deployment script. Please try again.");
  }
};