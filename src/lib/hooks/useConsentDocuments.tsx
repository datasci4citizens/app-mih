/**
 * Hook para gerenciar carregamento e cache de documentos de consentimento
 * Utiliza SWR para caching automático
 */

import useSWR from 'swr'
import { useCallback } from 'react'
import apiClient from '@/lib/axios'
import type {
  ConsentDocumentInfo,
  ConsentDocumentsListResponse,
  PresignedUrlResponse,
} from '@/types/consent.types'

interface UseConsentDocumentsOptions {
  type?: 'tcle' | 'privacy_policy'
  language?: 'pt-BR' | 'en'
}

interface UseConsentDocumentsReturn {
  documents: ConsentDocumentInfo[]
  loading: boolean
  error: string | null
  getPresignedUrl: (
    documentType: 'tcle' | 'privacy_policy',
    language?: string,
  ) => Promise<PresignedUrlResponse | null>
}

/**
 * Hook para listar e gerenciar documentos de consentimento ativos
 *
 * @param options - Filtros opcionais (type e language)
 * @returns Object com documentos, estado de carregamento, erro e função para gerar URLs presignadas
 *
 * @example
 * const { documents, loading, error, getPresignedUrl } = useConsentDocuments({ type: 'tcle' })
 *
 * if (loading) return <div>Carregando...</div>
 * if (error) return <div>Erro: {error}</div>
 *
 * const url = await getPresignedUrl('tcle', 'pt-BR')
 */
export const useConsentDocuments = (options?: UseConsentDocumentsOptions): UseConsentDocumentsReturn => {
  const { type, language = 'pt-BR' } = options || {}

  // Build query string
  const queryParams = new URLSearchParams()
  if (type) queryParams.append('type', type)
  if (language) queryParams.append('language', language)

  const queryString = queryParams.toString()
  const url = queryString ? `/auth/consent-documents/?${queryString}` : '/auth/consent-documents/'

  // Fetch documents
  const { data, error, isLoading } = useSWR<ConsentDocumentsListResponse>(
    url,
    async (url) => {
      try {
        const response = await apiClient.get(url)
        return response.data
      } catch (err) {
        throw err
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache por 1 minuto
    },
  )

  // Function to get presigned URL - memoizada para evitar recriações desnecessárias
  const getPresignedUrl = useCallback(async (
    documentType: 'tcle' | 'privacy_policy',
    lang: string = 'pt-BR',
  ): Promise<PresignedUrlResponse | null> => {
    try {
      const response = await apiClient.get('/auth/consent-documents/presigned-url/', {
        params: {
          type: documentType,
          language: lang,
        },
      })

      return response.data as PresignedUrlResponse
    } catch (err) {
      console.error('Erro ao gerar presigned URL:', err)
      return null
    }
  }, [])

  return {
    documents: data?.documents || [],
    loading: isLoading,
    error: error?.message || null,
    getPresignedUrl,
  }
}

/**
 * Hook alternativo para buscar um documento específico por tipo e linguagem
 */
export const useConsentDocument = (
  type: 'tcle' | 'privacy_policy',
  language: 'pt-BR' | 'en' = 'pt-BR',
) => {
  const { documents, loading, error } = useConsentDocuments({ type, language })

  const document = documents.length > 0 ? documents[0] : null

  return {
    document,
    loading,
    error,
  }
}
