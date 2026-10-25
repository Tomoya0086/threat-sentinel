import React from 'react';
import { ShieldCheck, Key, Lock, FileCode } from 'lucide-react';

export const RemediationGuide: React.FC = () => {
  const guides = [
    {
      title: '1. Hardening HTTP Response Security Headers',
      icon: Lock,
      description: 'Defend against MITM SSL downgrades, clickjacking, and MIME-type sniffing across your web application.',
      solutionSnippet: `// vercel.json or reverse-proxy headers configuration
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self'; object-src 'none';" }
      ]
    }
  ]
}`
    },
    {
      title: '2. Denying Access to Repository & Environment Secrets (/.env, /.git)',
      icon: FileCode,
      description: 'Ensure configuration files, environment variables, and git metadata are permanently denied by the web server.',
      solutionSnippet: `# Nginx reverse proxy configuration
location ~ /\\.(env|git|htpasswd) {
    deny all;
    return 404;
}

location ~* \\.(bak|sql|zip|tar\\.gz)$ {
    deny all;
    return 404;
}`
    },
    {
      title: '3. Protecting API Keys & Automated Secret Scrubbing',
      icon: Key,
      description: 'How to remediate exposed OpenAI, Anthropic, AWS, or database credentials and enforce git secret scanning.',
      solutionSnippet: `1. Revoke and regenerate any compromised API credentials in your cloud console.
2. Store keys ONLY in backend server environment variables (never client-side).
3. Do not prefix private secrets with VITE_ or NEXT_PUBLIC_.
4. Install local pre-commit hooks using Gitleaks:
   $ brew install gitleaks
   $ gitleaks protect --staged`
    },
    {
      title: '4. Restricting Cross-Origin Resource Sharing (CORS)',
      icon: ShieldCheck,
      description: 'Eliminate wildcard origins and reflection vulnerabilities on authenticated API routes.',
      solutionSnippet: `// Express / Node.js CORS configuration
import cors from 'cors';

const allowedOrigins = ['https://threatsentinel.io', 'https://your-domain.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));`
    }
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-150">
      <div className="bg-[#0B0F17] border border-zinc-800 rounded-lg p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5 font-sans">
          Security Hardening & Remediation Blueprint
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Validated mitigation playbooks to patch identified vulnerabilities and harden your web attack surface.
        </p>
      </div>

      <div className="space-y-4">
        {guides.map((g, idx) => {
          const Icon = g.icon;
          return (
            <div key={idx} className="bg-[#0B0F17] border border-zinc-800 rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-zinc-900 text-cyan-400 border border-zinc-800">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white font-sans">{g.title}</h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {g.description}
              </p>
              <pre className="p-3.5 rounded bg-[#07090E] border border-zinc-800 text-cyan-300 font-mono-code text-[11px] overflow-x-auto whitespace-pre leading-relaxed">
                {g.solutionSnippet}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
