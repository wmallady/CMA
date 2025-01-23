import React, { useState } from 'react';
import { ActionWindowProps } from '../interfaces/Interfaces';

function ActionWindow({ file, onUpdateFile }: ActionWindowProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [internalContact, setInternalContact] = useState(file.internalContact || '');
  const [internalContactEmail, setInternalContactEmail] = useState(file.internalContactEmail || '');
  const [externalContact, setExternalContact] = useState(file.externalContact || '');
  const [externalContactEmail, setExternalContactEmail] = useState(file.externalContactEmail || '');
  const [renewalDate, setRenewalDate] = useState(file.renewalDate || '');

  const sendReminderEmail = () => {
    console.log(`Sending reminder email to ${file.externalContactEmail}`);
    setEmailSent(true);
  };

  const handleChangeMetadata = () => {
    const updatedFile = {
      ...file,
      internalContact,
      internalContactEmail,
      externalContact,
      externalContactEmail,
      renewalDate,
    };
    updatedFile.internalContact = internalContact;
    updatedFile.internalContactEmail = internalContactEmail;
    updatedFile.externalContact = externalContact;
    updatedFile.externalContactEmail = externalContactEmail;
    updatedFile.renewalDate = renewalDate;
    onUpdateFile(updatedFile);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Action Window</h2>
      <p className="mb-2">File Name: {file.name}</p>
      <p className="mb-4">Last Modified: {file.modified ? file.modified.toDateString() : 'Unknown'}</p>
      <div className="mb-4">
        <label className="block mb-2">Internal Contact</label>
        <input
          type="text"
          value={internalContact}
          onChange={(e) => setInternalContact(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Internal Contact Email</label>
        <input
          type="email"
          value={internalContactEmail}
          onChange={(e) => setInternalContactEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">External Contact</label>
        <input
          type="text"
          value={externalContact}
          onChange={(e) => setExternalContact(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">External Contact Email</label>
        <input
          type="email"
          value={externalContactEmail}
          onChange={(e) => setExternalContactEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Renewal Date</label>
        <input
          type="date"
          value={renewalDate instanceof Date ? renewalDate.toISOString().split('T')[0] : renewalDate}
          onChange={(e) => setRenewalDate(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
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
        onClick={handleChangeMetadata}
        className="mt-4 px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-300"
      >
        Change Metadata
      </button>
    </div>
  );
}

export default ActionWindow;
