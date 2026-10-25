import React from 'react';
import { ShieldCheck, Key, Lock, FileCode, CheckCircle2 } from 'lucide-react';

export const RemediationGuide: React.FC = () => {
  const guides = [
    {
      title: '1. Hardening HTTP Response Security Headers',
      icon: Lock,
      description: 'Defend against MITM SSL downgrades, clickjacking, and MIME-type sniffing across your modern web deployment.',
      solutionSnippet: `// vercel.json or Next.js headers config
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" }
      ]
    }
  ]
}`
    },
    {
      title: '2. Blocking Leaked Files & Sensitive Paths (/.env, /.git)',
      icon: FileCode,
      description: 'Ensure configuration backups, git metadata, and environment secret files are permanently blocked from web access.',
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
      description: 'How to remediate exposed OpenAI, Anthropic, AWS, or database credentials and prevent recurring leaks.',
      solutionSnippet: `1. Immediately revoke and regenerate any leaked API key in your provider console.
2. Store keys ONLY in backend server environment variables (e.g. process.env.API_KEY).
3. Never prefix secrets with VITE_ or NEXT_PUBLIC_ which bundles them into client JS.
4. Install pre-commit hooks using Gitleaks:
   $ brew install gitleaks
   $ gitleaks protect --staged`
    },
    {
      title: '4. Restricting Cross-Origin Resource Sharing (CORS)',
      icon: ShieldCheck,
      description: 'Eliminate insecure wildcard origins and origin-reflection vulnerabilities.',
      solutionSnippet: `// Express / Node.js CORS configuration
import cors from 'cors';

const allowedOrigins = ['https://app.threatsentinel.io', 'https://your-domain.com'];

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
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
      <div className="bg-[#0b1020] border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Security Hardening & Remediation Blueprint
        </h2>
        <p className="text-sm text-slate-400">
          Follow these authoritative best practices to patch identified vulnerabilities, sanitize sensitive assets, and protect your cloud attack surface.
        </p>
      </div>

      <div className="space-y-5">
        {guides.map((g, idx) => {
          const Icon = g.icon;
          return (
            <div key={idx} className="bg-[#0b1020] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{g.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {g.description}
              </p>
              <pre className="p-4 rounded-xl bg-[#060a14] border border-slate-800/80 text-cyan-300 font-mono-code text-xs overflow-x-auto whitespace-pre leading-relaxed">
                {g.solutionSnippet}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
