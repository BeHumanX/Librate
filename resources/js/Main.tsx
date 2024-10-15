import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Pages/App'; 
import Admin from './Pages/Admin';
import Staff from './Pages/Staff'; 
export const backGroundColor = 'text-[#E8E9EC]';

if (document.getElementById('main')) {
    const rootElement = document.getElementById('main');
    if (rootElement) {
        ReactDOM.createRoot(rootElement).render(
            <React.StrictMode>
                <div className={backGroundColor}>
                    <App />
                </div>
            </React.StrictMode>
        );
    }
} else if (document.getElementById('admin-main')) {
    const adminRootElement = document.getElementById('admin-main');
    if (adminRootElement) {
        ReactDOM.createRoot(adminRootElement).render(
            <React.StrictMode>
                <div className={backGroundColor}>
                    <Admin />
                </div>
            </React.StrictMode>
        );
    }
} else if (document.getElementById('staff-main')) {
    const staffRootElement = document.getElementById('staff-main');
    if (staffRootElement) {
        ReactDOM.createRoot(staffRootElement).render(
            <React.StrictMode>
                <div className={backGroundColor}>
                    <Staff />
                </div>
            </React.StrictMode>
        );
    }
}
