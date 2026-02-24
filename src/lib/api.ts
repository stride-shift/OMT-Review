import { supabaseUrl } from './supabase'
import type { CompletenessResult, AlignmentResult, PrimerResult } from './types'

const FUNCTIONS_BASE = `${supabaseUrl}/functions/v1`

async function callEdgeFunction<T>(fnName: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${FUNCTIONS_BASE}/${fnName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || err.details || `Edge function error: ${res.status}`)
  }
  return res.json()
}

export async function invokeCompletenessCheck(applicationId: string, force = false): Promise<CompletenessResult> {
  return callEdgeFunction<CompletenessResult>('omt-completeness-check', {
    application_id: applicationId,
    force,
  })
}

export async function invokeAlignmentCheck(applicationId: string, force = false): Promise<AlignmentResult> {
  return callEdgeFunction<AlignmentResult>('omt-alignment-check', {
    application_id: applicationId,
    force,
  })
}

export async function invokePrimerGenerate(applicationId: string, force = false): Promise<PrimerResult> {
  return callEdgeFunction<PrimerResult>('omt-primer-generate', {
    application_id: applicationId,
    force,
  })
}
