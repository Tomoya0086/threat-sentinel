export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface Finding {
  id: string;
  severity: Severity;
  check: string;
  url: string;
  detail: string;
  evidence?: string;
  remediation?: string;
  timestamp: string;
}

export interface ScanStats {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  total: number;
}

export interface ScanConfig {
  target: string;
  depth: number;
  threads: number;
  checkHeaders: boolean;
  checkSensitivePaths: boolean;
  checkCORS: boolean;
  checkInjection: boolean;
  checkSSL: boolean;
}
