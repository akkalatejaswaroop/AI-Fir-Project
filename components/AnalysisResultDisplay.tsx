import React, { useState, useEffect } from 'react';
import { type AnalysisResult, type IPCSection } from '../types';
import { CheckCircleIcon, ExclamationCircleIcon, TrashIcon } from '../constants';

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
  videoFile: File;
}

const AuthenticityReportCard: React.FC<{ report: AnalysisResult['authenticityAnalysis'] }> = ({ report }) => {
  const { isAuthentic, confidenceScore, summary, findings } = report;
  const scorePercent = (confidenceScore * 100).toFixed(0);

  return (
    <div className={`p-4 rounded-lg border ${isAuthentic ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
      <div className="flex items-start">
        {isAuthentic ? <CheckCircleIcon /> : <ExclamationCircleIcon />}
        <div className="ml-3 flex-1">
          <h4 className={`text-lg font-semibold ${isAuthentic ? 'text-green-800' : 'text-yellow-800'}`}>
            {isAuthentic ? 'Video Appears Authentic' : 'Potential Manipulation Detected'}
          </h4>
          <p className={`text-sm font-medium ${isAuthentic ? 'text-green-700' : 'text-yellow-700'}`}>
            Confidence Score: {scorePercent}%
          </p>
          <p className={`mt-1 text-sm ${isAuthentic ? 'text-green-600' : 'text-yellow-600'}`}>{summary}</p>
        </div>
      </div>
      
      {findings && findings.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-md font-semibold text-gray-700 mb-2">Key Findings (Proofs):</h5>
            <ul className="space-y-2 list-disc list-inside">
                {findings.map((finding, index) => (
                    <li key={index} className="text-sm text-gray-600">
                        <span className="font-semibold">{finding.type}:</span> {finding.observation}
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};


export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result, videoFile }) => {
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(videoFile);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-brand-blue border-b pb-2">AI Analysis Report</h2>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Video Evidence</h3>
        {videoUrl && (
          <video controls src={videoUrl} className="w-full rounded-lg shadow-inner"></video>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Evidence Metadata</h3>
        <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-700 space-y-2">
            <p><strong>File Name:</strong> {videoFile.name}</p>
            <p><strong>File Size:</strong> {(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>File Type:</strong> {videoFile.type}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Authenticity Check</h3>
        <AuthenticityReportCard report={result.authenticityAnalysis} />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Event Summary</h3>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border">{result.eventSummary}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Detected Activities</h3>
        <div className="flex flex-wrap gap-2">
          {result.detectedActivities.map((activity, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{activity}</span>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">AI-Suggested IPC Sections</h3>
        <div className="space-y-3">
          {result.suggestedIPCSections.map((ipc, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg border">
              <p className="font-bold text-brand-blue">Section {ipc.section}: {ipc.title}</p>
              <p className="text-sm text-gray-600 mt-1">{ipc.description}</p>
              <p className="text-xs text-gray-500 mt-2 italic">Reasoning: {ipc.reasoning}</p>
            </div>
          ))}
          {result.suggestedIPCSections.length === 0 && (
             <p className="text-gray-500 text-sm italic">No specific IPC sections were suggested by the AI.</p>
          )}
        </div>
      </div>

    </div>
  );
};