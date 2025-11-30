import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { InputField } from './components/InputField';
import { CodeBlock } from './components/CodeBlock';
import { WizardStep, DeploymentConfig, GeneratedScript } from './types';
import { generateDeploymentScript } from './services/geminiService';
import { ArrowRight, ArrowLeft, Loader2, Sparkles, Plus, Trash2, Check, Shield, Database, Globe, Lock, UserCog } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<WizardStep>(WizardStep.PROJECT_DETAILS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedScript | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState<DeploymentConfig>({
    repoUrl: '',
    branch: 'main',
    pythonVersion: '3.10',
    githubToken: '',
    serverIp: '',
    sshUser: 'root',
    domainName: '',
    appName: 'django_app',
    wsgiPath: 'config.wsgi:application',
    email: '',
    dbName: 'django_db',
    dbUser: 'django_user',
    dbPassword: '',
    adminUser: 'admin',
    adminEmail: '',
    adminPassword: '',
    envVars: [{ key: 'DJANGO_SECRET_KEY', value: '' }]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleEnvVarChange = (index: number, field: 'key' | 'value', value: string) => {
    const newEnvVars = [...config.envVars];
    newEnvVars[index][field] = value;
    setConfig(prev => ({ ...prev, envVars: newEnvVars }));
  };

  const addEnvVar = () => {
    setConfig(prev => ({ ...prev, envVars: [...prev.envVars, { key: '', value: '' }] }));
  };

  const removeEnvVar = (index: number) => {
    const newEnvVars = config.envVars.filter((_, i) => i !== index);
    setConfig(prev => ({ ...prev, envVars: newEnvVars }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const generated = await generateDeploymentScript(config);
      setResult(generated);
      setStep(WizardStep.GENERATION);
    } catch (err: any) {
      setError(err.message || "Something went wrong generating the script.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 1, label: "Project", icon: <Globe className="w-4 h-4" /> },
      { id: 2, label: "Server", icon: <Lock className="w-4 h-4" /> },
      { id: 3, label: "Config", icon: <Database className="w-4 h-4" /> },
      { id: 4, label: "Deploy", icon: <Sparkles className="w-4 h-4" /> }
    ];

    return (
      <div className="flex items-center justify-between mb-10 px-4">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className={`flex flex-col items-center z-10 ${step >= s.id ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 border-2 ${step >= s.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300 text-slate-500'}`}>
                {s.id}
              </div>
              <span className="text-xs font-medium mt-2">{s.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${step > s.id ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[600px] border border-slate-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        {renderStepIndicator()}

        {step === WizardStep.PROJECT_DETAILS && (
          <div className="animate-fade-in space-y-6 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Source Control</h2>
              <p className="text-slate-600">Where is your Django project hosted?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <InputField 
                  label="GitHub Repository URL" 
                  name="repoUrl" 
                  value={config.repoUrl} 
                  onChange={handleInputChange} 
                  placeholder="https://github.com/username/project.git"
                  required
                />
              </div>
              <InputField 
                label="Branch Name" 
                name="branch" 
                value={config.branch} 
                onChange={handleInputChange} 
                placeholder="main"
              />
              <InputField 
                label="Python Version" 
                name="pythonVersion" 
                value={config.pythonVersion} 
                onChange={handleInputChange} 
                placeholder="3.10"
              />
              <div className="col-span-1 md:col-span-2">
                <InputField 
                  label="GitHub Personal Access Token (Optional)" 
                  name="githubToken" 
                  value={config.githubToken || ''} 
                  onChange={handleInputChange} 
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxx"
                  helperText="Required only if the repository is private."
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                onClick={nextStep}
                disabled={!config.repoUrl}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200"
              >
                Next Step <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === WizardStep.SERVER_DETAILS && (
          <div className="animate-fade-in space-y-6 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Target Server</h2>
              <p className="text-slate-600">Connect to your Ubuntu VPS.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <InputField 
                  label="Domain Name" 
                  name="domainName" 
                  value={config.domainName} 
                  onChange={handleInputChange} 
                  placeholder="app.example.com"
                  helperText="This domain should point to your server IP."
                  required
                />
              </div>
              <InputField 
                label="Server IP Address" 
                name="serverIp" 
                value={config.serverIp} 
                onChange={handleInputChange} 
                placeholder="203.0.113.1"
                required
              />
              <InputField 
                label="SSH Username" 
                name="sshUser" 
                value={config.sshUser} 
                onChange={handleInputChange} 
                placeholder="root"
                required
              />
            </div>
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Security Note</p>
                We do not ask for SSH passwords. You will run the generated command locally.
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button 
                onClick={prevStep}
                className="flex items-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </button>
              <button 
                onClick={nextStep}
                disabled={!config.domainName || !config.serverIp}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200"
              >
                Next Step <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === WizardStep.APP_CONFIG && (
          <div className="animate-fade-in space-y-6 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Application Configuration</h2>
              <p className="text-slate-600">Define secrets, database, and admin user details.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Application Name" 
                name="appName" 
                value={config.appName} 
                onChange={handleInputChange} 
                placeholder="my_django_project"
              />
              <InputField 
                label="WSGI Path" 
                name="wsgiPath" 
                value={config.wsgiPath} 
                onChange={handleInputChange} 
                placeholder="config.wsgi:application"
              />
              <div className="col-span-1 md:col-span-2">
                <InputField 
                  label="SSL Contact Email" 
                  name="email" 
                  value={config.email} 
                  onChange={handleInputChange} 
                  type="email"
                  placeholder="admin@example.com"
                  helperText="Required for Let's Encrypt certificates."
                  required
                />
              </div>
            </div>

            {/* Database Section */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                    <Database className="w-4 h-4 mr-2 text-indigo-500" /> Database Setup
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <InputField label="DB Name" name="dbName" value={config.dbName} onChange={handleInputChange} />
                 <InputField label="DB User" name="dbUser" value={config.dbUser} onChange={handleInputChange} />
                 <InputField 
                    label="DB Password" 
                    name="dbPassword" 
                    value={config.dbPassword} 
                    onChange={handleInputChange} 
                    type="password" 
                    placeholder="SecureDBPass"
                    required
                 />
              </div>
            </div>

            {/* Superuser Section */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                    <UserCog className="w-4 h-4 mr-2 text-indigo-500" /> Admin User Setup
                </h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Auto-Created</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <InputField label="Username" name="adminUser" value={config.adminUser} onChange={handleInputChange} />
                 <InputField label="Email" name="adminEmail" value={config.adminEmail} onChange={handleInputChange} type="email" />
                 <InputField 
                    label="Password" 
                    name="adminPassword" 
                    value={config.adminPassword} 
                    onChange={handleInputChange} 
                    type="password" 
                    placeholder="AdminPass123"
                    required
                 />
              </div>
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Environment Variables (.env)</label>
              <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                {config.envVars.map((env, idx) => (
                  <div key={idx} className="flex space-x-2">
                    <input 
                      className="flex-1 px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                      placeholder="KEY"
                      value={env.key}
                      onChange={(e) => handleEnvVarChange(idx, 'key', e.target.value)}
                    />
                    <input 
                      className="flex-1 px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                      placeholder="VALUE"
                      value={env.value}
                      onChange={(e) => handleEnvVarChange(idx, 'value', e.target.value)}
                    />
                    <button onClick={() => removeEnvVar(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={addEnvVar} className="flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800">
                  <Plus className="w-4 h-4 mr-1" /> Add Environment Variable
                </button>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <button 
                onClick={prevStep}
                className="flex items-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </button>
              <button 
                onClick={handleGenerate}
                disabled={loading || !config.dbPassword || !config.email || !config.adminPassword}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" /> Designing Architecture...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-4 h-4" /> Create Deployment Agent
                  </>
                )}
              </button>
            </div>
            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          </div>
        )}

        {step === WizardStep.GENERATION && result && (
          <div className="animate-fade-in relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Deployment Agent Ready</h2>
              <p className="text-slate-600 mt-2 max-w-xl mx-auto">
                The autonomous deployment script has been generated. Execute the command below to deploy your app to <strong>{config.domainName}</strong>.
              </p>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 shadow-2xl mb-8 transform transition-all hover:scale-[1.01]">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-400" /> One-Touch Automation Command
              </h3>
              <div className="font-mono text-sm text-white break-all bg-black/30 p-4 rounded border border-slate-700">
                1. Save the "Bash Script" below as <span className="text-indigo-400">deploy_app.sh</span><br/>
                2. Run this on your local machine:<br/><br/>
                <span className="text-green-400">{result.executionCommand}</span>
              </div>
            </div>

            <div className="mt-6 space-y-8">
              <div>
                 <h3 className="text-lg font-bold text-slate-800 mb-2">Master Bash Script</h3>
                 <p className="text-sm text-slate-600 mb-2">This script handles everything: packages, database creation, firewall, SSL, superuser creation, and app code.</p>
                 <CodeBlock code={result.bashScript} language="bash" title="deploy_app.sh" />
              </div>
              
              <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                 <h3 className="font-bold text-indigo-900 mb-2">Agent Summary</h3>
                 <p className="text-indigo-800 text-sm whitespace-pre-wrap">{result.explanation}</p>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <button 
                    onClick={() => {
                        const el = document.getElementById('details-section');
                        if (el) el.classList.toggle('hidden');
                    }}
                    className="text-sm text-slate-500 underline mb-4"
                >
                    Show Technical Config Files
                </button>
                <div id="details-section" className="hidden grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Nginx Config</h3>
                    <CodeBlock code={result.nginxConfig} language="nginx" title="Generated Config" />
                    </div>
                    <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Gunicorn Service</h3>
                    <CodeBlock code={result.gunicornConfig} language="ini" title="Generated Service" />
                    </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button 
                onClick={() => setStep(WizardStep.APP_CONFIG)}
                className="flex items-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Edit Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;