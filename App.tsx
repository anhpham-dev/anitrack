
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function AppContent() {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Login />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
