import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ScanForm } from './components/ScanForm';
import { FindingsTable } from './components/FindingsTable';
import { RemediationGuide } from './components/RemediationGuide';
import { AboutSection } from './components/AboutSection';
import { NotFoundPage } from './components/NotFoundPage';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModals';
import { Finding } from './types';
import { executeVulnerabilityScan } from './services/scannerEngine';
import { CyberRadarAnimation } from './components/CyberRadarAnimation';
import { Shield, Lock, Cpu, Database } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('scanner');
  const [targetUrl, setTargetUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('Idle');
  const [findings, setFindings] = useState<Finding[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | null>(null);

  // Dynamic Page Title (No Em Dashes)
  useEffect(() => {
    if (isScanning) {
      document.title = `[SCANNING ${progressPercent}%] ThreatSentinel | Web Vulnerability Scanner`;
    } else if (findings.length > 0) {
      document.title = `(${findings.length} FINDINGS) ThreatSentinel | Security Report`;
    } else {
      document.title = 'ThreatSentinel | Enterprise Web Vulnerability & Attack Surface Scanner';
    }
  }, [isScanning, progressPercent, findings.length]);

  const handleStartScan = async (url: string, depth: number, threads: number) => {
    setTargetUrl(url);
    setIsScanning(true);
    setProgressPercent(0);
    setProgressStatus('Initializing reconnaissance engine...');
    setFindings([]);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const results = await executeVulnerabilityScan(
        url,
        (percent, status) => {
          setProgressPercent(percent);
          setProgressStatus(status);
        },
        (finding) => {
          setFindings((prev) => [finding, ...prev]);
        }
      );

      setIsScanning(false);
      setSuccessMessage(`Assessment completed. Identified ${results.length} total security findings across target host.`);
    } catch (err: any) {
      setIsScanning(false);
      setErrorMessage(err.message || 'An unexpected error occurred during the vulnerability scan.');
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    setProgressStatus('Scan halted by operator.');
    setSuccessMessage('Assessment paused. Recorded findings preserved below.');
  };

  const handleExportJSON = () => {
    if (findings.length === 0) return;
    const report = {
      title: 'ThreatSentinel Vulnerability Audit Report',
      target: targetUrl,
      timestamp: new Date().toISOString(),
      findings_count: findings.length,
      findings: findings
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-sentinel-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setSuccessMessage('Scan report downloaded as JSON.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08090D] text-zinc-100 overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Navigation Bar */}
      <Navbar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        onOpenPrivacy={() => setActiveLegalModal('privacy')}
        onOpenTerms={() => setActiveLegalModal('terms')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {currentTab === 'scanner' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Tactical Hero Header */}
            <div className="space-y-3 border-b border-zinc-800/80 pb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-cyan-400 text-xs font-mono-code font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>ATTACK SURFACE RECONNAISSANCE & ZERO-LEAK AUDITING</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-sans">
                Automated Web Application Vulnerability Scanner
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed font-sans">
                Conduct non-destructive heuristic audits across web endpoints. Evaluates HTTP transport headers, CORS cross-origin policies, exposed repository directories, and sanitizes API credentials client-side prior to rendering.
              </p>

              {/* Operational Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono-code text-zinc-400">
                <div className="p-2.5 rounded bg-[#0B0F17] border border-zinc-800 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-zinc-500 block text-[10px]">CORE RULES:</span>
                    <span className="text-white font-bold">10 HEURISTICS</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#0B0F17] border border-zinc-800 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-zinc-500 block text-[10px]">REDACTION:</span>
                    <span className="text-emerald-400 font-bold">ENTROPY SCRUBBER</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#0B0F17] border border-zinc-800 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-zinc-500 block text-[10px]">EXECUTION:</span>
                    <span className="text-white font-bold">CLIENT LOCAL RUNTIME</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#0B0F17] border border-zinc-800 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-zinc-500 block text-[10px]">CVE HARMONIZATION:</span>
                    <span className="text-white font-bold">MITRE 2026.4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Execution Console */}
            <ScanForm
              onStartScan={handleStartScan}
              onStopScan={handleStopScan}
              isScanning={isScanning}
              progressPercent={progressPercent}
              progressStatus={progressStatus}
              errorMessage={errorMessage}
              successMessage={successMessage}
            />

            {/* Aerospace/Cyber Vector Radar Canvas */}
            <CyberRadarAnimation isScanning={isScanning} findingsCount={findings.length} />

            {/* Findings Display & Analysis */}
            <FindingsTable
              findings={findings}
              targetUrl={targetUrl}
              isScanning={isScanning}
              onExport={handleExportJSON}
            />
          </div>
        )}

        {currentTab === 'remediation' && <RemediationGuide />}
        {currentTab === 'about' && <AboutSection />}
        {currentTab === '404' && <NotFoundPage onReturnHome={() => setCurrentTab('scanner')} />}
      </main>

      {/* Footer */}
      <Footer 
        onOpenPrivacy={() => setActiveLegalModal('privacy')}
        onOpenTerms={() => setActiveLegalModal('terms')}
      />

      {/* Compliance / Legal Modal */}
      <LegalModal 
        type={activeLegalModal} 
        onClose={() => setActiveLegalModal(null)} 
      />
    </div>
  );
};

export default App;
