import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { LearningProvider } from './context/LearningProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <LearningProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </LearningProvider>
    </React.StrictMode>
);