import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import BattlepacksPage from './pages/BattlepacksPage';
import BattlepackDetailPage from './pages/BattlepackDetailPage';

// Layout component
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/battlepacks" element={<BattlepacksPage />} />
          <Route path="/battlepacks/:id" element={<BattlepackDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
