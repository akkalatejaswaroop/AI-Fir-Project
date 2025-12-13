import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { LiveCapture } from './components/LiveCapture';
import { Spinner } from './components/Spinner';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { FIReport } from './components/FIReport';
import { HistoryView } from './components/HistoryView';
import { analyzeVideoAndGenerateReport } from './services/geminiService';
import { type AnalysisResult, type FIRData, type AppState, AppStateEnum } from './types';
import { VideoIcon } from './constants';
const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppStateEnum.IDLE);
  const [currentView, setCurrentView] = useState<'main' | 'history'>('main');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [analyzedVideoFile, setAnalyzedVideoFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [firData, setFirData] = useState<FIRData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = [
    "Initializing AI analysis...",
    "Detecting events and objects in video...",
    "Generating a chronological summary...",
    "Cross-referencing with Indian Penal Code sections...",
    "Running deepfake detection algorithms...",
    "Compiling final report...",
  ];
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    let messageIndex = 0;
    let intervalId: number;
    if (appState === AppStateEnum.ANALYZING) {
      intervalId = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setCurrentLoadingMessage(loadingMessages[messageIndex]);
      }, 3000);
    }
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  const handleVideoReady = useCallback((file: File) => {
    setVideoFile(file);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!videoFile) {
      setError("Please select a video file first.");
      return;
    }
    setAppState(AppStateEnum.ANALYZING);
    setError(null);
    setAnalysisResult(null);
    setFirData(null);

    try {
      const result = await analyzeVideoAndGenerateReport(videoFile);
      setAnalysisResult(result);
      setFirData({
        incidentDetails: result.eventSummary,
        ipcSections: result.suggestedIPCSections,
        complainantName: '',
        address: '',
        dateTime: new Date().toISOString().slice(0, 16),
        placeOfOccurrence: '',
      });
      setAnalyzedVideoFile(videoFile);
      setVideoFile(null); // Clear video file after analysis to allow new upload
      setAppState(AppStateEnum.RESULTS);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze video. Please check the console for details and try again.");
      setAppState(AppStateEnum.IDLE);
    }
  }, [videoFile]);

  const handleReset = () => {
    setAppState(AppStateEnum.IDLE);
    setVideoFile(null);
    setAnalyzedVideoFile(null);
    setAnalysisResult(null);
    setFirData(null);
    setError(null);
  };

  const handleToggleView = () => {
    if (currentView === 'main') {
      handleReset();
      setCurrentView('history');
    } else {
      setCurrentView('main');
    }
  };

  const renderMainContent = () => {
    switch (appState) {
      case AppStateEnum.ANALYZING:
        return (
          <div className="text-center p-8">
            <Spinner />
            <h2 className="text-xl font-semibold mt-4 text-brand-blue">Analyzing Video</h2>
            <p className="text-gray-600 mt-2 animate-pulse">{currentLoadingMessage}</p>
          </div>
        );
      case AppStateEnum.RESULTS:
        if (analysisResult && firData && analyzedVideoFile) {
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
               <AnalysisResultDisplay result={analysisResult} videoFile={analyzedVideoFile} />
               <FIReport firData={firData} setFirData={setFirData} onReset={handleReset} />
            </div>
          );
        }
        return null; // Should not happen
      case AppStateEnum.IDLE:
      default:
        return (
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-brand-blue">Welcome to AI-FIR Vision</h1>
              <p className="mt-2 text-lg text-gray-700">Automate FIR generation from video evidence with the power of AI.</p>
            </div>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FileUpload onFileReady={handleVideoReady} />
              <LiveCapture onRecordingComplete={handleVideoReady} />
            </div>
            {videoFile && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-center">
                 <div className="flex items-center justify-center text-green-600">
                    <VideoIcon/>
                    <p className="ml-2 font-medium">Video selected: {videoFile.name}</p>
                </div>
                <button
                  onClick={handleAnalyze}
                  className="mt-4 px-8 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-brand-blue-light transition-colors shadow-lg disabled:bg-gray-400"
                  disabled={!videoFile}
                >
                  Analyze Video and Generate FIR
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header currentView={currentView} onToggleView={handleToggleView} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'history' ? (
          <HistoryView onBack={() => setCurrentView('main')} />
        ) : (
          renderMainContent()
        )}
      </main>
    </div>
  );
};

export default App;
