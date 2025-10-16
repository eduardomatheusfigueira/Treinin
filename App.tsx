import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import SkillsDashboard from './pages/SkillsDashboard';
import TrainingPlanner from './pages/TrainingPlanner';
import SkillShop from './pages/SkillShop';
import Profile from './pages/Profile';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppProvider>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<SkillsDashboard />} />
                      <Route path="/training" element={<TrainingPlanner />} />
                      <Route path="/skill-shop" element={<SkillShop />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </MainLayout>
                </AppProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;