'use client'

import { useAppwrite } from '@/src/appwrite/AppwriteProvider'
import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import type { DatabaseDocument } from './types'

/**
 * Fetches a document from a database.
 * @param databaseId The database the document belongs to.
 * @param collectionId The collection the document belongs to.
 * @param documentId The document to fetch.
 * @param options Options to pass to `react-query`.
 */
export function useDocument<TDocument>(
  {
    databaseId = 'jaweeb',
    collectionId,
    documentId,
    options
  }: {
    databaseId?: string
    collectionId: string
    documentId: string
    options?: UseQueryOptions<DatabaseDocument<TDocument>, unknown, DatabaseDocument<TDocument>, string[]>
  }
) {
  const { databases } = useAppwrite()
  const queryClient = useQueryClient()

  const queryKey = useMemo(() => ['appwrite', 'databases', databaseId, collectionId, 'documents', documentId], [databaseId, collectionId, documentId])

  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      return await databases.getDocument<DatabaseDocument<TDocument>>(databaseId, collectionId, documentId)
    },

    ...options,
  })

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const setupSubscription = () => {
      try {
        unsubscribe = databases.client.subscribe(`databases.${databaseId}.collections.${collectionId}.documents.${documentId}`, response => {
          queryClient.setQueryData(queryKey, response.payload)
        })
      } catch (error) {
        console.error('Failed to setup Appwrite document subscription:', error);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Failed to cleanup Appwrite document subscription:', error);
        }
      }
    }
  }, [databaseId, collectionId, documentId, queryKey, queryClient])

  return queryResult
}