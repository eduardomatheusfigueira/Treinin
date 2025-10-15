import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { SkatingDataProvider } from './context/SkatingDataContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import SkillsDashboard from './pages/SkillsDashboard';
import TrainingPlanner from './pages/TrainingPlanner';
import SkillShop from './pages/SkillShop';
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
                <SkatingDataProvider>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<SkillsDashboard />} />
                      <Route path="/training" element={<TrainingPlanner />} />
                      <Route path="/skill-shop" element={<SkillShop />} />
                    </Routes>
                  </MainLayout>
                </SkatingDataProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;