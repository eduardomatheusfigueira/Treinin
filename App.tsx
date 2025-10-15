import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { SkatingDataProvider } from './context/SkatingDataContext';
import Layout from './components/Layout';
import SkillsDashboard from './pages/SkillsDashboard';
import TrainingPlanner from './pages/TrainingPlanner';
import SkillShop from './pages/SkillShop';

const App: React.FC = () => {
  return (
    <SkatingDataProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<SkillsDashboard />} />
            <Route path="/training" element={<TrainingPlanner />} />
            <Route path="/skill-shop" element={<SkillShop />} />
          </Routes>
        </Layout>
      </HashRouter>
    </SkatingDataProvider>
  );
};

export default App;