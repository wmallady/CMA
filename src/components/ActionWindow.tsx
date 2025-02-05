import React, { useState } from 'react';
import { ActionWindowProps } from '../interfaces/Interfaces';
import ToastContainer from './ToastContainer'; // Import your custom ToastContainer

function ActionWindow({ file, onUpdateFile }: ActionWindowProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [internalContact, setInternalContact] = useState(file.internalContact || '');
  const [internalContactEmail, setInternalContactEmail] = useState(file.internalContactEmail || '');
  const [externalContact, setExternalContact] = useState(file.externalContact || '');
  const [externalContactEmail, setExternalContactEmail] = useState(file.externalContactEmail || '');
  const [renewalDate, setRenewalDate] = useState(file.renewalDate || '');
  const [toastMessage, setToastMessage] = useState('');

  const sendReminderEmail = () => {
    console.log(`Sending reminder email to ${file.externalContactEmail}`);
    setEmailSent(true);
  };

  const handleSaveFile = async () => {
    const updatedFile = {
      ...file,
      internalContact,
      internalContactEmail,
      externalContact,
      externalContactEmail,
      renewalDate
    };
    onUpdateFile(updatedFile);
    try {
      await window.Main.saveFile(updatedFile.path, JSON.stringify(updatedFile, null, 2));
      setToastMessage('File saved successfully!');
    } catch (error) {
      console.error('Failed to save file:', error);
      setToastMessage('Failed to save file.');
    }
  };

  return (
    <div className="p-4 color-black bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Action Window</h2>
      <p className="mb-2">File Name: {file.name}</p>
      <p className="mb-4">Last Modified: {file.modified ? file.modified.toDateString() : 'Unknown'}</p>
      <div className="mb-4">
      <label className="block mb-2">Internal Contact</label>
      <input
        type="text"
        value={internalContact}
        onChange={(e) => setInternalContact(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-black"
      />
      </div>
      <div className="mb-4">
      <label className="block mb-2">Internal Contact Email</label>
      <input
        type="email"
        value={internalContactEmail}
        onChange={(e) => setInternalContactEmail(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-black"
      />
      </div>
      <div className="mb-4">
      <label className="block mb-2">External Contact</label>
      <input
        type="text"
        value={externalContact}
        onChange={(e) => setExternalContact(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-black"
      />
      </div>
      <div className="mb-4">
      <label className="block mb-2">External Contact Email</label>
      <input
        type="email"
        value={externalContactEmail}
        onChange={(e) => setExternalContactEmail(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-black"
      />
      </div>
      <div className="mb-4">
      <label className="block mb-2">Renewal Date</label>
      <input
        type="date"
        value={renewalDate instanceof Date ? renewalDate.toISOString().split('T')[0] : renewalDate}
        onChange={(e) => setRenewalDate(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg  text-black"
      />
      </div>
      <button
      onClick={sendReminderEmail}
      disabled={emailSent}
      className={`px-6 py-3 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300 ${
        emailSent ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
      } ${emailSent ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
      {emailSent ? 'Reminder Sent' : 'Send Reminder Email'}
      </button>
      <button
      onClick={handleSaveFile}
      className="mt-4 px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-300"
      >
      Save File
      </button>
      {toastMessage && <ToastContainer filePath={toastMessage} />}
    </div>
  );
}

export default ActionWindow;
