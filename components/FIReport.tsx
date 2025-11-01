import React, { useState } from 'react';
import { type FIRData, type IPCSection, type StoredFIRData } from '../types';
import { TrashIcon } from '../constants';

interface FIReportProps {
  firData: FIRData;
  setFirData: React.Dispatch<React.SetStateAction<FIRData | null>>;
  onReset: () => void;
}

const IPCManager: React.FC<{ sections: IPCSection[]; onChange: (sections: IPCSection[]) => void }> = ({ sections, onChange }) => {
  const [newSection, setNewSection] = useState<IPCSection>({
    section: '',
    title: '',
    description: '',
    reasoning: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleRemove = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    onChange(newSections);
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSection(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (newSection.section && newSection.title && newSection.description) {
      const sectionToAdd = { ...newSection };
      if (!sectionToAdd.reasoning) {
        sectionToAdd.reasoning = 'Manually added by user.';
      }
      onChange([...sections, sectionToAdd]);
      setNewSection({ section: '', title: '', description: '', reasoning: '' });
      setIsAdding(false);
    } else {
      alert("Please fill at least Section, Title, and Description.");
    }
  };
  
  return (
    <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Applicable Indian Penal Code (IPC) Sections</h3>
        <div className="space-y-3">
            {sections.map((ipc, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg border relative">
                    <p className="font-bold text-brand-blue">Section {ipc.section}: {ipc.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{ipc.description}</p>
                    <p className="text-xs text-gray-500 mt-2 italic">Reasoning: {ipc.reasoning}</p>
                    <button onClick={() => handleRemove(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors" aria-label={`Remove section ${ipc.section}`}>
                        <TrashIcon />
                    </button>
                </div>
            ))}
        </div>
        <div className="mt-4">
            {isAdding ? (
                <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                    <h4 className="font-semibold text-gray-700">Add New IPC Section</h4>
                    <input type="text" name="section" placeholder="Section (e.g., 302)" value={newSection.section} onChange={handleAddChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                    <input type="text" name="title" placeholder="Title (e.g., Punishment for murder)" value={newSection.title} onChange={handleAddChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                    <textarea name="description" placeholder="Description" rows={2} value={newSection.description} onChange={handleAddChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm"></textarea>
                    <textarea name="reasoning" placeholder="Reasoning (Optional)" rows={2} value={newSection.reasoning} onChange={handleAddChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm"></textarea>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                        <button type="button" onClick={handleAdd} className="px-4 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-light">Add Section</button>
                    </div>
                </div>
            ) : (
                <button type="button" onClick={() => setIsAdding(true)} className="px-4 py-2 border border-dashed border-gray-400 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 w-full">
                    + Add IPC Section
                </button>
            )}
        </div>
    </div>
  );
};


export const FIReport: React.FC<FIReportProps> = ({ firData, setFirData, onReset }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFirData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleIpcChange = (updatedSections: IPCSection[]) => {
      setFirData(prev => prev ? { ...prev, ipcSections: updatedSections } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firData) return;

    const storedFir: StoredFIRData = {
      ...firData,
      id: new Date().toISOString() + Math.random().toString(36).substr(2, 9),
      submissionDate: new Date().toISOString(),
    };

    const history: StoredFIRData[] = JSON.parse(localStorage.getItem('firHistory') || '[]');
    
    history.push(storedFir);
    localStorage.setItem('firHistory', JSON.stringify(history));

    console.log("Submitting and storing FIR:", storedFir);
    alert("FIR Submitted and Saved to History!");
    onReset();
  };

  if (!firData) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-brand-blue border-b pb-2 mb-6">Draft First Information Report (F.I.R)</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="complainantName" className="block text-sm font-medium text-gray-700">Complainant Name</label>
          <input type="text" name="complainantName" id="complainantName" value={firData.complainantName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" required/>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input type="text" name="address" id="address" value={firData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" required/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">Date & Time of Incident</label>
                <input type="datetime-local" name="dateTime" id="dateTime" value={firData.dateTime} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" required/>
            </div>
            <div>
                <label htmlFor="placeOfOccurrence" className="block text-sm font-medium text-gray-700">Place of Occurrence</label>
                <input type="text" name="placeOfOccurrence" id="placeOfOccurrence" value={firData.placeOfOccurrence} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" required/>
            </div>
        </div>
        <div>
          <label htmlFor="incidentDetails" className="block text-sm font-medium text-gray-700">Details of Incident (AI Generated)</label>
          <textarea name="incidentDetails" id="incidentDetails" rows={8} value={firData.incidentDetails} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" required></textarea>
        </div>
        
        <IPCManager sections={firData.ipcSections} onChange={handleIpcChange} />
        
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button type="button" onClick={onReset} className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light">
            Start Over
          </button>
          <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Submit FIR
          </button>
        </div>
      </form>
    </div>
  );
};