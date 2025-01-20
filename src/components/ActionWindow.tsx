import React, { useState } from 'react';
import { ActionWindowProps } from '../interfaces/Interfaces';

function ActionWindow({ file }: ActionWindowProps) {
  const [emailSent, setEmailSent] = useState(false);

  const sendReminderEmail = () => {
    console.log(`Sending reminder email to ${file.externalContactEmail}`);
    setEmailSent(true);
  };

  return (
    <div>
      <h2>Action Window</h2>
      <p>File Name: {file.name}</p>
      <p>Last Modified: {file.modified ? file.modified.toDateString() : 'Unknown'}</p>
      <button onClick={sendReminderEmail} disabled={emailSent}>
        {emailSent ? 'Reminder Sent' : 'Send Reminder Email'}
      </button>
    </div>
  );
}

export default ActionWindow;
