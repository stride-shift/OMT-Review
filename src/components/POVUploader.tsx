import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Globe, Palette, Loader2, Sparkles, Download, RefreshCw, Eye, Edit2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { extractTextFromFile } from '@/lib/file-parser';
import SlideCarousel from './SlideCarousel';
import type { BattlepackType, Language } from '@/types/database';

interface POVUploaderProps {
  userId: string;
  onBattlepackCreated: (battlepackId: string) => void;
}

interface SlideDescription {
  number: number;
  title: string;
  nano_banana_prompt: string;
  include_logo?: boolean;
}

interface SlideDescriptions {
  customer_name: string;
  slides: SlideDescription[];
}

const LANGUAGE_OPTIONS: Record<Language, string> = {
  en: 'English',
  de: 'German',
  nl: 'Dutch',
  es: 'Spanish',
  fr: 'French',
};

// Test data for quick testing (Ctrl+T / Cmd+T)
const TEST_POV_TEXT = `PROOF OF VALUE REPORT: NEXTERA LOGISTICS

Customer: NextEra Logistics Inc.
Industry: Supply Chain & Logistics
Location: Chicago, IL
Evaluation Period: October 2024 - December 2024

EXECUTIVE SUMMARY

NextEra Logistics, a mid-market freight forwarding company with 450 employees and $180M annual revenue, faced critical challenges in their shipment tracking and customer communication workflows. After a 90-day proof of value engagement, they achieved a 67% reduction in customer service inquiries and 4.2x ROI.

CHALLENGE

NextEra was struggling with:
- Manual shipment status updates consuming 120+ hours weekly across their customer service team
- 48-hour average delay in notifying customers about shipment exceptions
- Customer satisfaction scores declining from 4.2 to 3.1 over 18 months
- High customer churn rate of 23% annually, primarily due to poor communication

SOLUTION IMPLEMENTED

We deployed our real-time visibility platform with the following components:
1. API Integration Layer - Connected to 47 carrier feeds for live tracking data
2. Automated Exception Management - ML-based delay prediction with 94% accuracy
3. Customer Self-Service Portal - Real-time shipment visibility dashboard

RESULTS

Quantitative Outcomes:
- 67% reduction in inbound customer service calls
- 89% of exceptions communicated proactively (vs. 12% previously)
- Customer satisfaction score improved from 3.1 to 4.6
- $847,000 annual savings in customer service labor costs
- Customer churn reduced to 8% (from 23%)

ROI CALCULATION

Investment: $156,000 (annual platform cost + implementation)
Returns: $847,000 (labor savings) + $312,000 (reduced churn value)
Total First-Year ROI: 4.2x`;

const TEST_CI_GUIDELINES = `BRAND COLORS:
- Primary Blue: #0066FF
- Deep Navy: #1A1A2E
- Success Green: #00C853
- Alert Orange: #FF6D00

TYPOGRAPHY:
- Headlines: Inter Bold, 32-48pt
- Body: Inter Regular, 14-16pt
- Use sentence case for headings

STYLE:
- Professional but approachable
- Lead with outcomes, not features
- Use active voice
- Be specific with numbers and metrics`;

const TEST_COMPANY_URL = 'https://stripe.com';

export default function POVUploader({ userId, onBattlepackCreated }: POVUploaderProps) {
  // Form state
  const [companyUrl, setCompanyUrl] = useState('');
  const [povFile, setPovFile] = useState<File | null>(null);
  const [povText, setPovText] = useState('');
  const [ciGuidelines, setCiGuidelines] = useState('');
  const [ciFile, setCiFile] = useState<File | null>(null);
  const [battlepackType, setBattlepackType] = useState<BattlepackType>('external');
  const [language, setLanguage] = useState<Language>('en');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Slide state
  const [slideDescriptions, setSlideDescriptions] = useState<SlideDescriptions | null>(null);
  const [generatedSlides, setGeneratedSlides] = useState<string[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [regeneratingSlideIndex, setRegeneratingSlideIndex] = useState<number | null>(null);
  const [savedBattlepackId, setSavedBattlepackId] = useState<string | null>(null);

  // Fill test data function
  const fillTestData = useCallback(() => {
    setCompanyUrl(TEST_COMPANY_URL);
    setPovText(TEST_POV_TEXT);
    setCiGuidelines(TEST_CI_GUIDELINES);
    setBattlepackType('external');
    setLanguage('en');
    console.log('🧪 Test data populated - ready to generate');
  }, []);

  // Keyboard shortcut handler (Ctrl+T / Cmd+T)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        fillTestData();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fillTestData]);

  // Handle POV file selection
  const handlePovFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPovFile(file);
    setError(null);

    try {
      const text = await extractTextFromFile(file);
      setPovText(text);
    } catch (err: any) {
      setError(`Failed to extract text from file: ${err.message}`);
    }
  }, []);

  // Handle CI file selection
  const handleCiFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCiFile(file);

    try {
      const text = await extractTextFromFile(file);
      setCiGuidelines(text);
    } catch (err: any) {
      setError(`Failed to extract CI guidelines: ${err.message}`);
    }
  }, []);

  // Process POV and generate slide descriptions
  const processPOV = async () => {
    if (!povText.trim()) {
      setError('Please upload a POV report or paste the text');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStatus('Analyzing POV and generating slide descriptions...');

    try {
      const { data: processData, error: processError } = await supabase.functions.invoke('battle-pack-process-pov', {
        body: {
          povText,
          companyUrl,
          ciGuidelines,
          battlepackType,
          language,
        },
      });

      if (processError) throw processError;

      setSlideDescriptions(processData);
      setStatus('Slide descriptions ready. Review and edit if needed, then generate images.');
    } catch (err: any) {
      console.error('POV processing error:', err);
      setError(err.message || 'Failed to process POV report');
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate slide images in parallel for speed (4 concurrent requests)
  const generateSlides = async () => {
    if (!slideDescriptions?.slides) return;

    setIsGeneratingSlides(true);
    setError(null);

    const totalSlides = slideDescriptions.slides.length;
    const CONCURRENCY = 4; // Number of parallel requests

    // Initialize array with nulls to track completion
    const images: (string | null)[] = new Array(totalSlides).fill(null);
    const errors: string[] = [];
    let completedCount = 0;

    // Create battlepack record first so we can save slides as they complete
    let battlepackId = savedBattlepackId;
    if (!battlepackId) {
      try {
        const { data: battlepack, error: createError } = await supabase
          .from('battle_pack_battlepacks')
          .insert({
            user_id: userId,
            customer_name: slideDescriptions.customer_name || 'Untitled',
            pov_text: povText,
            slide_count: totalSlides,
            slide_descriptions: slideDescriptions.slides.map(slide => ({
              ...slide,
              imageUrl: null,
              generated: false,
            })),
            regeneration_count: 0,
            regenerated_slide_numbers: [],
          })
          .select()
          .single();

        if (createError) throw createError;
        battlepackId = (battlepack as any).id;
        setSavedBattlepackId(battlepackId);
      } catch (err: any) {
        console.error('Failed to create battlepack record:', err);
        // Continue anyway - we can save at the end
      }
    }

    // Function to generate a single slide and save immediately
    const generateSingleSlide = async (index: number): Promise<void> => {
      const slide = slideDescriptions.slides[index];

      try {
        const { data: slidesData, error: slidesError } = await supabase.functions.invoke('battle-pack-generate-slides', {
          body: {
            slides: [slide],
            companyUrl,
            ciGuidelines,
          },
        });

        if (slidesError) throw slidesError;

        if (slidesData.images[0]) {
          images[index] = slidesData.images[0];
          completedCount++;

          // Update UI immediately with this slide
          setGeneratedSlides([...images.filter((img): img is string => img !== null)]);
          setStatus(`Generated ${completedCount} of ${totalSlides} slides (${Math.round(completedCount/totalSlides*100)}%)`);

          // Save this slide to storage immediately
          if (battlepackId) {
            try {
              // Convert base64 to blob for storage
              const base64Data = slidesData.images[0].replace(/^data:image\/\w+;base64,/, '');
              const blob = await fetch(`data:image/png;base64,${base64Data}`).then(r => r.blob());

              const storagePath = `${userId}/${battlepackId}/slides/slide-${index + 1}.png`;
              await supabase.storage
                .from('battle_pack_files')
                .upload(storagePath, blob, { upsert: true });

              // Update the slide description with the storage path
              const { data: { publicUrl } } = supabase.storage
                .from('battle_pack_files')
                .getPublicUrl(storagePath);

              // Update just this slide in the database
              const currentDescriptions = [...slideDescriptions.slides];
              currentDescriptions[index] = {
                ...currentDescriptions[index],
                imageUrl: publicUrl,
                generated: true,
              } as any;

              await supabase
                .from('battle_pack_battlepacks')
                .update({
                  slide_descriptions: currentDescriptions,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', battlepackId);
            } catch (saveErr: any) {
              console.warn(`Failed to save slide ${index + 1} to storage:`, saveErr);
              // Continue - slide is still in memory
            }
          }
        } else {
          errors.push(`Slide ${slide.number}: No image returned`);
        }
      } catch (err: any) {
        console.error(`Slide ${slide.number} error:`, err);
        errors.push(`Slide ${slide.number}: ${err.message}`);
      }
    };

    // Process slides in parallel with concurrency limit
    const processInParallel = async () => {
      const queue = slideDescriptions.slides.map((_, index) => index);
      const executing: Promise<void>[] = [];

      setStatus(`Starting parallel generation (${CONCURRENCY} at a time)...`);

      for (const index of queue) {
        const promise = generateSingleSlide(index).then(() => {
          executing.splice(executing.indexOf(promise), 1);
        });
        executing.push(promise);

        // When we hit concurrency limit, wait for one to finish
        if (executing.length >= CONCURRENCY) {
          await Promise.race(executing);
        }
      }

      // Wait for remaining promises
      await Promise.all(executing);
    };

    try {
      await processInParallel();

      // Final update with all valid images in correct order
      const validImages = images.filter((img): img is string => img !== null);
      setGeneratedSlides(validImages);

      if (errors.length > 0) {
        setError(`Generated ${validImages.length}/${totalSlides} slides. Failed: ${errors.join(', ')}`);
      } else {
        setStatus(`All ${totalSlides} slides generated successfully!`);
      }
    } catch (err: any) {
      console.error('Slide generation error:', err);
      setError(err.message || 'Failed to generate slides');
    } finally {
      setIsGeneratingSlides(false);
    }
  };

  // Regenerate a single slide
  const regenerateSingleSlide = async (slideIndex: number) => {
    if (!slideDescriptions?.slides[slideIndex]) return;

    setRegeneratingSlideIndex(slideIndex);
    setError(null);

    try {
      const slide = slideDescriptions.slides[slideIndex];

      const { data: slidesData, error: slidesError } = await supabase.functions.invoke('battle-pack-generate-slides', {
        body: {
          slides: [slide],
          companyUrl,
          ciGuidelines,
        },
      });

      if (slidesError) throw slidesError;

      if (slidesData.images[0]) {
        const updatedSlides = [...generatedSlides];
        updatedSlides[slideIndex] = slidesData.images[0];
        setGeneratedSlides(updatedSlides);

        // Update in database
        if (savedBattlepackId) {
          await saveBattlepack(updatedSlides);
        }
      }
    } catch (err: any) {
      console.error('Slide regeneration error:', err);
      setError(`Failed to regenerate slide: ${err.message}`);
    } finally {
      setRegeneratingSlideIndex(null);
    }
  };

  // Save battlepack to database
  const saveBattlepack = async (slides: string[]) => {
    try {
      const battlepackData = {
        user_id: userId,
        customer_name: slideDescriptions?.customer_name || 'Untitled',
        pov_text: povText,
        slide_count: slides.length,
        slide_descriptions: slideDescriptions?.slides.map((slide, index) => ({
          ...slide,
          imageUrl: slides[index] || null,
          generated: !!slides[index],
        })) || [],
        regeneration_count: 0,
        regenerated_slide_numbers: [],
      };

      if (savedBattlepackId) {
        // Update existing
        const { error: updateError } = await supabase
          .from('battle_pack_battlepacks')
          .update(battlepackData)
          .eq('id', savedBattlepackId);

        if (updateError) throw updateError;
      } else {
        // Create new
        const { data: battlepack, error: saveError } = await supabase
          .from('battle_pack_battlepacks')
          .insert(battlepackData)
          .select()
          .single();

        if (saveError) throw saveError;
        setSavedBattlepackId((battlepack as any).id);
      }
    } catch (err: any) {
      console.error('Save error:', err);
      setError(`Failed to save battlepack: ${err.message}`);
    }
  };

  // Handle slide description edit
  const handleSlideEdit = (index: number, field: string, value: string) => {
    if (!slideDescriptions) return;

    const updatedSlides = [...slideDescriptions.slides];
    updatedSlides[index] = {
      ...updatedSlides[index],
      [field]: value,
    };

    setSlideDescriptions({
      ...slideDescriptions,
      slides: updatedSlides,
    });
  };

  // Download as PDF
  const downloadPDF = async () => {
    if (generatedSlides.length === 0) return;

    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1920, 1080],
      });

      for (let i = 0; i < generatedSlides.length; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(generatedSlides[i], 'PNG', 0, 0, 1920, 1080);
      }

      const fileName = slideDescriptions?.customer_name
        ? `${slideDescriptions.customer_name}_battlepack.pdf`
        : 'battlepack_slides.pdf';

      pdf.save(fileName);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setError(`Failed to generate PDF: ${err.message}`);
    }
  };

  const isValid = povText.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Company Information</CardTitle>
              <CardDescription>Enter the target company's website for branding context</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyUrl">Company URL</Label>
              <Input
                id="companyUrl"
                type="url"
                placeholder="https://example.com"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used to fetch company branding and context
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* POV Report Upload */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">POV Report</CardTitle>
              <CardDescription>Upload your Point-of-View report to transform into a battlepack</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="povFile">Upload File</Label>
              <div className="mt-1.5 flex items-center gap-3">
                <Input
                  id="povFile"
                  type="file"
                  accept=".docx,.pdf,.txt,.md"
                  onChange={handlePovFileChange}
                  className="flex-1"
                />
                {povFile && (
                  <span className="text-sm text-muted-foreground">{povFile.name}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Accepts .docx, .pdf, .txt, or .md files
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or paste text</span>
              </div>
            </div>

            <div>
              <Label htmlFor="povText">POV Text</Label>
              <Textarea
                id="povText"
                placeholder="Paste your POV report text here..."
                value={povText}
                onChange={(e) => setPovText(e.target.value)}
                className="mt-1.5 min-h-[200px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CI Guidelines */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Palette className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">CI Guidelines</CardTitle>
              <CardDescription>Optional: Provide corporate identity guidelines for slide styling</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ciFile">Upload CI Document</Label>
              <div className="mt-1.5 flex items-center gap-3">
                <Input
                  id="ciFile"
                  type="file"
                  accept=".docx,.pdf,.txt,.md"
                  onChange={handleCiFileChange}
                  className="flex-1"
                />
                {ciFile && (
                  <span className="text-sm text-muted-foreground">{ciFile.name}</span>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or describe</span>
              </div>
            </div>

            <div>
              <Label htmlFor="ciGuidelines">CI Guidelines Text</Label>
              <Textarea
                id="ciGuidelines"
                placeholder="Describe brand colors, fonts, and styling preferences..."
                value={ciGuidelines}
                onChange={(e) => setCiGuidelines(e.target.value)}
                className="mt-1.5 min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                E.g., "Primary color: #002742, Secondary: #34B8A5, Use clean modern style"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generation Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="battlepackType">Battlepack Type</Label>
              <Select value={battlepackType} onValueChange={(v) => setBattlepackType(v as BattlepackType)}>
                <SelectTrigger id="battlepackType" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="external">External (Customer-Facing)</SelectItem>
                  <SelectItem value="internal">Internal (Pre-Discovery)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Output Language</Label>
              <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                <SelectTrigger id="language" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LANGUAGE_OPTIONS).map(([code, name]) => (
                    <SelectItem key={code} value={code}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Status Display */}
      {(isProcessing || isGeneratingSlides) && status && (
        <div className="p-4 bg-primary/10 text-primary rounded-lg text-sm flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin" />
          {status}
        </div>
      )}

      {/* Process POV Button */}
      {!slideDescriptions && (
        <Button
          onClick={processPOV}
          disabled={!isValid || isProcessing}
          className="w-full py-6 text-lg font-semibold gap-2"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze POV & Create Slide Plan
            </>
          )}
        </Button>
      )}

      {/* Slide Descriptions Panel */}
      {slideDescriptions && generatedSlides.length === 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-green-900">
                  Slide Plan: {slideDescriptions.customer_name}
                </CardTitle>
                <CardDescription className="text-green-700">
                  {slideDescriptions.slides.length} slides planned. Edit prompts if needed, then generate images.
                </CardDescription>
              </div>
              <Button
                onClick={generateSlides}
                disabled={isGeneratingSlides}
                className="gap-2"
              >
                {isGeneratingSlides ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Slides
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {slideDescriptions.slides.map((slide, index) => (
                <div key={slide.number} className="border border-green-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Slide {slide.number}
                      </span>
                      {slide.include_logo && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                          Logo
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSlideIndex(editingSlideIndex === index ? null : index)}
                    >
                      {editingSlideIndex === index ? (
                        <><Check className="w-4 h-4 mr-1" /> Done</>
                      ) : (
                        <><Edit2 className="w-4 h-4 mr-1" /> Edit</>
                      )}
                    </Button>
                  </div>

                  {editingSlideIndex === index ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Title</Label>
                        <Input
                          value={slide.title}
                          onChange={(e) => handleSlideEdit(index, 'title', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Generation Prompt</Label>
                        <Textarea
                          value={slide.nano_banana_prompt}
                          onChange={(e) => handleSlideEdit(index, 'nano_banana_prompt', e.target.value)}
                          rows={6}
                          className="mt-1 font-mono text-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{slide.title}</h4>
                      <details className="text-xs text-muted-foreground">
                        <summary className="cursor-pointer hover:text-foreground">View prompt</summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded whitespace-pre-wrap">
                          {slide.nano_banana_prompt}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Slides Carousel */}
      {generatedSlides.length > 0 && (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-green-900">
                  Battlepack Ready: {slideDescriptions?.customer_name}
                </CardTitle>
                <CardDescription className="text-green-700">
                  {generatedSlides.length} slides generated
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedSlides([]);
                    generateSlides();
                  }}
                  disabled={isGeneratingSlides}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate All
                </Button>
                {savedBattlepackId && (
                  <Button
                    variant="outline"
                    onClick={() => onBattlepackCreated(savedBattlepackId)}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                )}
                <Button onClick={downloadPDF} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SlideCarousel
              slides={generatedSlides}
              currentIndex={currentSlideIndex}
              onIndexChange={setCurrentSlideIndex}
              onRegenerateSlide={regenerateSingleSlide}
              isRegenerating={regeneratingSlideIndex !== null}
              regeneratingIndex={regeneratingSlideIndex}
            />
          </CardContent>
        </Card>
      )}

      {/* Dev hint */}
      <p className="text-center text-xs text-muted-foreground">
        Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl+T</kbd> to load test data
      </p>
    </div>
  );
}
