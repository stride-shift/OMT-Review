import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, getSignedUrl } from '@/lib/supabase';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, Download, Edit2, Check, X } from 'lucide-react';
import type { Battlepack } from '@/types/database';

export default function BattlepackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [battlepack, setBattlepack] = useState<Battlepack | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (id) {
      loadBattlepack(id);
    }
  }, [id]);

  const loadBattlepack = async (battlepackId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('battle_pack_battlepacks')
        .select('*')
        .eq('id', battlepackId)
        .single();

      if (error) throw error;
      const bp = data as Battlepack;
      setBattlepack(bp);
      setNewName(bp.display_name || bp.customer_name);

      // Get PDF URL if available
      if (bp.pdf_storage_path) {
        const url = await getSignedUrl(bp.pdf_storage_path);
        setPdfUrl(url);
      }
    } catch (err) {
      console.error('Failed to load battlepack:', err);
      navigate('/battlepacks');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!battlepack || !newName.trim()) return;

    try {
      const { error } = await supabase
        .from('battle_pack_battlepacks')
        .update({ display_name: newName.trim() } as any)
        .eq('id', battlepack.id);

      if (error) throw error;
      setBattlepack({ ...battlepack, display_name: newName.trim() });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update name:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!battlepack) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Battlepack not found</p>
          <Button onClick={() => navigate('/battlepacks')} className="mt-4">
            Back to Battlepacks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/battlepacks')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-4 mb-6">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-2xl font-bold h-12"
                autoFocus
              />
              <Button size="sm" onClick={handleSaveName}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground">
                {battlepack.display_name || battlepack.customer_name}
              </h1>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Actions */}
        {pdfUrl && (
          <div className="mb-8">
            <Button asChild>
              <a href={pdfUrl} download>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </a>
            </Button>
          </div>
        )}

        {/* Slides Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {battlepack.slide_descriptions.map((slide, index) => (
            <Card key={index} className="overflow-hidden">
              {slide.imageUrl ? (
                <div className="aspect-video bg-muted">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
              <CardContent className="p-4">
                <p className="font-medium text-sm line-clamp-2">{slide.title}</p>
                <p className="text-xs text-muted-foreground mt-1">Slide {slide.number}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* POV Text */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Original POV Text</h3>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted p-4 rounded-lg max-h-96 overflow-auto">
              {battlepack.pov_text}
            </pre>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
