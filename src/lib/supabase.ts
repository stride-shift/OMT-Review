import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create untyped client - we'll use type assertions where needed
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage helpers
export async function uploadPDF(
  userId: string,
  battlepackId: string,
  pdfBlob: Blob
): Promise<string> {
  const path = `${userId}/${battlepackId}/battlepack.pdf`;

  const { error } = await supabase.storage
    .from('battle_pack_files')
    .upload(path, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) throw error;
  return path;
}

export async function uploadSlideImage(
  userId: string,
  battlepackId: string,
  slideNumber: number,
  imageBlob: Blob
): Promise<string> {
  const path = `${userId}/${battlepackId}/slides/slide-${slideNumber}.png`;

  const { error } = await supabase.storage
    .from('battle_pack_files')
    .upload(path, imageBlob, {
      contentType: 'image/png',
      upsert: true,
    });

  if (error) throw error;
  return path;
}

export async function getSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('battle_pack_files')
    .createSignedUrl(path, 60 * 60 * 24); // 24 hours

  if (error) throw error;
  return data.signedUrl;
}

export async function deleteStorageFiles(userId: string, battlepackId: string): Promise<void> {
  const folderPath = `${userId}/${battlepackId}`;

  // List all files in the folder
  const { data: files, error: listError } = await supabase.storage
    .from('battle_pack_files')
    .list(folderPath, { limit: 100 });

  if (listError) throw listError;

  if (files && files.length > 0) {
    const filePaths = files.map(f => `${folderPath}/${f.name}`);
    await supabase.storage.from('battle_pack_files').remove(filePaths);
  }

  // Also try to remove slides subfolder
  const { data: slideFiles } = await supabase.storage
    .from('battle_pack_files')
    .list(`${folderPath}/slides`, { limit: 100 });

  if (slideFiles && slideFiles.length > 0) {
    const slidePaths = slideFiles.map(f => `${folderPath}/slides/${f.name}`);
    await supabase.storage.from('battle_pack_files').remove(slidePaths);
  }
}
