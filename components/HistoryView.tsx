import React, { useState, useEffect } from 'react';
import { type StoredFIRData } from '../types';
import { exportFirToPdf } from '../utils/pdfExporter';
import { BackIcon, PdfIcon, TrashIcon } from '../constants';

interface HistoryViewProps {
    onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onBack }) => {
    const [history, setHistory] = useState<StoredFIRData[]>([]);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('firHistory') || '[]');
        // Sort by most recent first
        storedHistory.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
        setHistory(storedHistory);
    }, []);

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this FIR from history?")) {
            const updatedHistory = history.filter(fir => fir.id !== id);
            setHistory(updatedHistory);
            localStorage.setItem('firHistory', JSON.stringify(updatedHistory));
        }
    };
    
    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
                <h2 className="text-3xl font-bold text-brand-blue">Filed FIR History</h2>
                <button onClick={onBack} className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <BackIcon />
                    <span>File New FIR</span>
                </button>
            </div>

            {history.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No FIRs have been submitted yet.</p>
            ) : (
                <div className="space-y-4">
                    {history.map(fir => (
                        <div key={fir.id} className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-md transition-shadow gap-4">
                            <div>
                                <p className="font-semibold text-lg text-gray-800">{fir.complainantName}</p>
                                <p className="text-sm text-gray-500">
                                    Incident on: {new Date(fir.dateTime).toLocaleDateString()} | Submitted on: {new Date(fir.submissionDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <button
                                    onClick={() => exportFirToPdf(fir)}
                                    className="flex items-center px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                                    aria-label="Export to PDF"
                                >
                                    <PdfIcon />
                                    <span>Export</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(fir.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                    aria-label="Delete FIR"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};