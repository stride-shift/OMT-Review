export interface SlideDescription {
  number: number;
  title: string;
  layout: string;
  nano_banana_prompt: string;
  generated?: boolean;
  imageUrl?: string;
}

export interface Battlepack {
  id: string;
  user_id: string;
  customer_name: string;
  display_name: string | null;
  pov_text: string;
  slide_count: number;
  pdf_storage_path: string | null;
  slide_descriptions: SlideDescription[];
  regeneration_count: number;
  regenerated_slide_numbers: number[];
  created_at: string;
  updated_at: string;
}

export interface BattlepackInsert {
  user_id: string;
  customer_name: string;
  display_name?: string | null;
  pov_text: string;
  slide_count: number;
  pdf_storage_path?: string | null;
  slide_descriptions: SlideDescription[];
  regeneration_count: number;
  regenerated_slide_numbers: number[];
}

export interface UserLimits {
  user_id: string;
  monthly_deck_limit: number | null;
  decks_generated_this_month: number;
  monthly_regeneration_limit: number | null;
  regenerations_this_month: number;
}

export type BattlepackType = 'external' | 'internal';
export type Language = 'en' | 'de' | 'nl' | 'es' | 'fr';

export const LANGUAGES: Record<Language, string> = {
  en: 'English',
  de: 'German',
  nl: 'Dutch',
  es: 'Spanish',
  fr: 'French',
};

// Simplified Database type for Supabase client
export interface Database {
  public: {
    Tables: {
      battle_pack_battlepacks: {
        Row: Battlepack;
        Insert: BattlepackInsert;
        Update: Partial<BattlepackInsert>;
      };
      battle_pack_user_limits: {
        Row: UserLimits;
        Insert: UserLimits;
        Update: Partial<UserLimits>;
      };
    };
  };
}
