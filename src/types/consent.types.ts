/**
 * Tipos para sistema de consentimento (TCLE + Política de Privacidade)
 * Sincronizado com backend Django (ConsentDocument + Consent models)
 */

export interface ConsentDocumentInfo {
  id: number
  consent_type: 'tcle' | 'privacy_policy' | 'tale_6_9' | 'tale_10_12'
  version: string
  language: 'pt-BR' | 'en'
  content_hash: string
  effective_date: string
  created_at?: string
  file_size?: number
  content_type?: string
}

export interface ConsentState {
  accepted: boolean
  accepted_at: string | null
  ip_address: string | null
  document_version: string | null
  document_language: string | null
  document_hash: string | null
  effective_date: string | null
}

export interface UserConsentState {
  tcle: ConsentState
  privacy_policy: ConsentState
}

export interface ConsentDocumentReference {
  id?: number
  hash?: string
}

export interface PresignedUrlResponse {
  presigned_url: string
  document_id: number
  document_type: 'tcle' | 'privacy_policy' | 'tale_6_9' | 'tale_10_12'
  version: string
  language: string
  content_type: string
  expires_in_seconds: number
}

export interface ConsentDocumentsListResponse {
  documents: ConsentDocumentInfo[]
  total: number
}
