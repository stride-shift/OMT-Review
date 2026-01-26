import { useNavigate } from 'react-router-dom';
import POVUploader from '../components/POVUploader';
import Header from '../components/Header';

// Test user ID for development (auth disabled) - must be valid UUID
const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function HomePage() {
  const navigate = useNavigate();

  const handleBattlepackCreated = (battlepackId: string) => {
    navigate(`/battlepacks/${battlepackId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Create a Battle Pack
          </h1>
          <p className="text-slate-600">
            Upload a POV report to generate a professional sales enablement deck
          </p>
        </div>

        <POVUploader
          userId={TEST_USER_ID}
          onBattlepackCreated={handleBattlepackCreated}
        />
      </main>
    </div>
  );
}
