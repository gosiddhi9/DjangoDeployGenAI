export interface DeploymentConfig {
  // Step 1: Project
  repoUrl: string;
  branch: string;
  pythonVersion: string;
  githubToken?: string; // Optional for private repos
  
  // Step 2: Server
  serverIp: string;
  sshUser: string;
  domainName: string;
  
  // Step 3: App Config
  appName: string;
  wsgiPath: string;
  email: string; // For Certbot
  
  // Database
  dbName: string;
  dbUser: string;
  dbPassword: string;

  // Django Admin
  adminUser: string;
  adminEmail: string;
  adminPassword: string;

  envVars: EnvVar[];
}

export interface EnvVar {
  key: string;
  value: string;
}

export interface GeneratedScript {
  bashScript: string;
  nginxConfig: string;
  gunicornConfig: string;
  explanation: string;
  executionCommand: string;
}

export enum WizardStep {
  PROJECT_DETAILS = 1,
  SERVER_DETAILS = 2,
  APP_CONFIG = 3,
  GENERATION = 4
}