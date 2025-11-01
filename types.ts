export enum AppStateEnum {
    IDLE = 'IDLE',
    ANALYZING = 'ANALYZING',
    RESULTS = 'RESULTS',
}
export type AppState = AppStateEnum;


export interface IPCSection {
  section: string;
  title: string;
  description: string;
  reasoning: string;
}

export interface AuthenticityFinding {
  observation: string;
  type: string;
}

export interface AuthenticityReport {
  isAuthentic: boolean;
  confidenceScore: number;
  summary: string;
  findings: AuthenticityFinding[];
}

export interface AnalysisResult {
  eventSummary: string;
  detectedActivities: string[];
  suggestedIPCSections: IPCSection[];
  authenticityAnalysis: AuthenticityReport;
}

export interface FIRData {
  complainantName: string;
  address: string;
  dateTime: string;
  placeOfOccurrence: string;
  incidentDetails: string;
  ipcSections: IPCSection[];
}

export interface StoredFIRData extends FIRData {
  id: string;
  submissionDate: string;
}
