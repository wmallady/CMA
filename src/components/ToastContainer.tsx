import React from 'react';

interface ToastContainerProps {
    filePath: string;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ filePath }) => {
    return (
        <div style={styles.toastContainer}>
            <p>File Saved to: {filePath}</p>
        </div>
    );
};

const styles = {
    toastContainer: {
        position: 'fixed' as 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
};

export default ToastContainer;