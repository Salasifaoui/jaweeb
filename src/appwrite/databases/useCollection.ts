'use client'

import { useAppwrite } from '@/src/appwrite/AppwriteProvider'
import { useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { Models } from 'react-native-appwrite'
import type { DatabaseDocument, DatabaseDocumentOperation } from './types'

/**
 * Fetches a collection from a database.
 * @param databaseId The database the collection belongs to.
 * @param collectionId The collection to fetch.
 * @param queries Queries to filter the collection by.
 * @param options Options to pass to `react-query`.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/databases?sdk=web-default#databasesListDocuments)
 */
export function useCollection<TDocument>({
  databaseId = 'jaweeb',
  collectionId,
  queries = [],
  options
}: {
  databaseId?: string
  collectionId: string
  queries?: string[]
  options?: UseQueryOptions<Models.DocumentList<DatabaseDocument<TDocument>>, unknown, Models.DocumentList<DatabaseDocument<TDocument>>, (string | {
    queries: string[]
  })[]>
}) {
  const { databases } = useAppwrite()
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ['appwrite', 'databases', databaseId, collectionId, { queries }], [databaseId, collectionId, queries])
  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      return await databases.listDocuments<DatabaseDocument<TDocument>>(databaseId, collectionId, queries)
    },

    ...options,
  })

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const setupSubscription = () => {
      try {
        unsubscribe = databases.client.subscribe(`databases.${databaseId}.collections.${collectionId}.documents`, response => {
          if (!response.events?.[0]) return;
          
          const match = response.events[0].match(/\.(\w+)$/);
          if (!match) return;
          
          const [, operation] = match;
          const document = response.payload as DatabaseDocument<TDocument>;

          switch (operation as DatabaseDocumentOperation) {
            case 'create':
              queryClient.setQueryData(['appwrite', 'databases', databaseId, collectionId, 'documents', document.$id], document)
              queryClient.setQueryData(['appwrite', 'databases', databaseId, collectionId, { queries }], (old: Models.DocumentList<DatabaseDocument<TDocument>> | undefined) => {
                if (!old) return old;
                return {
                  ...old,
                  documents: [...old.documents, document]
                }
              })
              break
            case 'update':
              queryClient.setQueryData(['appwrite', 'databases', databaseId, collectionId, 'documents', document.$id], document)
              queryClient.setQueryData(['appwrite', 'databases', databaseId, collectionId, { queries }], (old: Models.DocumentList<DatabaseDocument<TDocument>> | undefined) => {
                if (!old) return old;
                return {
                  ...old,
                  documents: old.documents.map(row => row.$id === document.$id ? document : row)
                }
              })
              break
            case 'delete':
              queryClient.setQueryData(['appwrite', 'databases', databaseId, collectionId, 'documents', document.$id], undefined)
              queryClient.setQueryData(['appwrite', 'databases', databaseId, collectionId, { queries }], (old: Models.DocumentList<DatabaseDocument<TDocument>> | undefined) => {
                if (!old) return old;
                return {
                  ...old,
                  documents: old.documents.filter(row => row.$id !== document.$id)
                }
              })
              break
          }
        })
      } catch (error) {
        console.error('Failed to setup Appwrite subscription:', error);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Failed to cleanup Appwrite subscription:', error);
        }
      }
    }
  }, [databaseId, collectionId, queries, queryClient])

  return queryResult
}