
import React, { useState, useRef, useCallback } from 'react';
import { CameraIcon } from '../constants';

interface LiveCaptureProps {
  onRecordingComplete: (file: File) => void;
}

export const LiveCapture: React.FC<LiveCaptureProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const recorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'video/webm' });
        onRecordingComplete(file);
        // Stop all tracks to turn off the camera light
        mediaStream.getTracks().forEach(track => track.stop());
        setStream(null);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      let message = "Could not access camera. Please ensure you have given permission in your browser settings.";
      if (err instanceof DOMException) {
          if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
              message = "Camera access was denied. To use this feature, please allow camera and microphone permissions in your browser's site settings and try again.";
          } else if (err.name === "NotFoundError") {
              message = "No camera or microphone found. Please ensure your devices are connected and enabled.";
          }
      }
      setCameraError(message);
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-full">
      {!stream && <CameraIcon />}
      <h3 className="text-lg font-semibold mt-4 text-gray-800">Live Video Capture</h3>
      <p className="text-sm text-gray-500 mt-1">Record an incident as it happens</p>
      
      {cameraError && (
        <div className="mt-4 w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Access Error: </strong>
          <span className="block sm:inline">{cameraError}</span>
        </div>
      )}

      {stream && (
        <div className="w-full aspect-video bg-black rounded-md my-4 overflow-hidden">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover"></video>
        </div>
      )}
      
      {!isRecording ? (
        <button onClick={startRecording} className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
          Start Recording
        </button>
      ) : (
        <button onClick={stopRecording} className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors animate-pulse">
          Stop Recording
        </button>
      )}
    </div>
  );
};
