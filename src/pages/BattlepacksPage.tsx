import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, Trash2, Plus, Calendar } from 'lucide-react';
import type { Battlepack } from '@/types/database';

// Test user ID for development (auth disabled) - must be valid UUID
const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function BattlepacksPage() {
  const [battlepacks, setBattlepacks] = useState<Battlepack[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBattlepacks();
  }, []);

  const loadBattlepacks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('battle_pack_battlepacks')
        .select('*')
        .eq('user_id', TEST_USER_ID)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBattlepacks((data as Battlepack[]) || []);
    } catch (err) {
      console.error('Failed to load battlepacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this battlepack?')) return;

    setDeleting(id);
    try {
      const { error } = await supabase
        .from('battle_pack_battlepacks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBattlepacks((prev) => prev.filter((bp) => bp.id !== id));
    } catch (err) {
      console.error('Failed to delete battlepack:', err);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Battle Packs</h1>
            <p className="text-muted-foreground">View and manage your generated battlepacks</p>
          </div>
          <Button onClick={() => navigate('/')} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : battlepacks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No battlepacks yet</h3>
              <p className="text-muted-foreground mb-4">Create your first battlepack to get started</p>
              <Button onClick={() => navigate('/')}>Create Battle Pack</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {battlepacks.map((bp) => (
              <Card
                key={bp.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/battlepacks/${bp.id}`)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-1">
                    {bp.display_name || bp.customer_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(bp.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {bp.slide_count} slides
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(bp.id);
                      }}
                      disabled={deleting === bp.id}
                    >
                      {deleting === bp.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
