import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { ToastProvider, ToastContainer } from './components/Toast/Toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <CompareProvider>
            <AppRoutes />
          </CompareProvider>
          <ToastContainer />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
