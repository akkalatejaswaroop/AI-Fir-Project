
import React, { useState, useCallback } from 'react';
import { UploadIcon } from '../constants';

interface FileUploadProps {
  onFileReady: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileReady }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileReady(file);
    }
  }, [onFileReady]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center h-full">
      <UploadIcon />
      <h3 className="text-lg font-semibold mt-4 text-gray-800">Upload Video Evidence</h3>
      <p className="text-sm text-gray-500 mt-1">Drag and drop or click to select a file</p>
      <label className="mt-4 cursor-pointer px-6 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-light transition-colors">
        <span>Select File</span>
        <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
      </label>
      {fileName && <p className="mt-3 text-sm text-green-600 font-medium">Selected: {fileName}</p>}
      <p className="text-xs text-gray-400 mt-2">Accepted formats: MP4, MOV, WEBM, AVI</p>
    </div>
  );
};
