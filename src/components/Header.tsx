import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FolderOpen, Home } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-white border-b border-border/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">BP</span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Battle Pack Generator</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Sales Enablement</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Button
              variant={location.pathname === '/' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
            <Button
              variant={location.pathname === '/battlepacks' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => navigate('/battlepacks')}
              className="gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">My Packs</span>
            </Button>
          </nav>

          {/* Dev Mode Badge */}
          <div className="flex items-center">
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
              Dev Mode
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
