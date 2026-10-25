import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ScanForm } from './components/ScanForm';
import { FindingsTable } from './components/FindingsTable';
import { RemediationGuide } from './components/RemediationGuide';
import { AboutSection } from './components/AboutSection';
import { NotFoundPage } from './components/NotFoundPage';
import { Footer } from './components/Footer';
import { Finding } from './types';
import { executeVulnerabilityScan } from './services/scannerEngine';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('scanner');
  const [targetUrl, setTargetUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('Idle');
  const [findings, setFindings] = useState<Finding[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dynamic Page Title (Rule 4: Fix page titles)
  useEffect(() => {
    if (isScanning) {
      document.title = `[Scanning ${progressPercent}%] ThreatSentinel — Vulnerability Scanner`;
    } else if (findings.length > 0) {
      document.title = `(${findings.length} Findings) ThreatSentinel — Scan Report`;
    } else {
      document.title = 'ThreatSentinel — Enterprise Web Vulnerability & Attack Surface Scanner';
    }
  }, [isScanning, progressPercent, findings.length]);

  const handleStartScan = async (url: string, depth: number, threads: number) => {
    setTargetUrl(url);
    setIsScanning(true);
    setProgressPercent(0);
    setProgressStatus('Initializing scanner engine...');
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
      setSuccessMessage(`Scan finished successfully. Found ${results.length} total security observations.`);
    } catch (err: any) {
      setIsScanning(false);
      setErrorMessage(err.message || 'An unexpected error occurred during the vulnerability scan.');
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    setProgressStatus('Scan cancelled by user.');
    setSuccessMessage('Scan halted. Partial findings preserved below.');
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
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 overflow-x-hidden">
      {/* Navigation Bar */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {currentTab === 'scanner' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Hero Sub-header */}
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Active Threat Defense & Credential Redaction</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Web Application Vulnerability Scanner
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Scan targets for missing security headers, exposed environment files, CORS reflections, XSS, and SQLi with automated API key redaction.
              </p>
            </div>

            {/* Scan Form Input */}
            <ScanForm
              onStartScan={handleStartScan}
              onStopScan={handleStopScan}
              isScanning={isScanning}
              progressPercent={progressPercent}
              progressStatus={progressStatus}
              errorMessage={errorMessage}
              successMessage={successMessage}
            />

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

      {/* Footer (Rule 6: Email, Rule 17: Phone) */}
      <Footer />
    </div>
  );
};

export default App;
