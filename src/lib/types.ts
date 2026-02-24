export interface Application {
  id: number
  application_id: string
  primary_contact: string | null
  email: string | null
  funding_type: string | null
  institution: string | null
  faculty: string | null
  study_choice: string | null
  topic: string | null
  target_institution: string | null
  host_institutions: string | null
  start_date: string | null
  duration: number | null
  motivation: string | null
  research_synopsis: string | null
  programme_description: string | null
  significance: string | null
  significance_relevance: string | null
  overseas_justification: string | null
  academic_awards: string | null
  budget_year_1: number | null
  budget_year_2: number | null
  budget_year_3: number | null
  reference_count: number | null
  ethnicity: string | null
  gender: string | null
  created_at: string
}

export interface CheckResultItem {
  field: string
  message: string
  value: unknown
}

export interface CompletenessResult {
  application_id: string
  is_complete: boolean
  errors: CheckResultItem[]
  warnings: CheckResultItem[]
  error_count: number
  warning_count: number
  cached: boolean
  created_at?: string
}

export interface AlignmentCheck {
  category: string
  status: 'aligned' | 'concern' | 'flag' | 'not_applicable'
  finding: string
  evidence: string[]
  reviewer_question: string | null
}

export interface AlignmentResult {
  application_id: string
  overall_alignment: 'STRONG' | 'MODERATE' | 'CONCERNS'
  checks: AlignmentCheck[]
  summary: string
  model: string
  cached: boolean
  created_at?: string
}

export interface KeyTerm {
  term: string
  definition: string
}

export interface InstitutionContext {
  institution_name: string
  reputation: string
  notable_researchers: string | null
  source_url: string | null
}

export interface Citation {
  title: string
  url: string
}

export interface PrimerResult {
  application_id: string
  field_overview: string
  key_terms: KeyTerm[]
  research_context: string
  evaluation_guidance: string
  institution_context: InstitutionContext
  confidence_note: string
  citations: Citation[]
  model: string
  cached: boolean
  created_at?: string
}
