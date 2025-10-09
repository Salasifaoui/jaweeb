import {
  QueryClient,
  type MutationObserverOptions,
  type QueryClientConfig,
  type QueryKey,
  type QueryObserverOptions,
} from '@tanstack/react-query'

export const defaultQueryOptions: QueryObserverOptions<unknown, unknown, unknown, unknown, QueryKey> = {
  staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity to allow garbage collection
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  retry: false,
  gcTime: 10 * 60 * 1000, // 10 minutes garbage collection time
}

export const defaultMutationOptions: MutationObserverOptions<unknown, unknown, unknown, unknown> = {
  retry: false,
}

export const queryClientConfiguration: QueryClientConfig = {
  defaultOptions: {
    queries: defaultQueryOptions,
    mutations: defaultMutationOptions,
  },
  // Add memory management
  logger: {
    log: () => {}, // Disable query logging in production
    warn: console.warn,
    error: console.error,
  },
}

export const queryClient = new QueryClient(queryClientConfiguration)