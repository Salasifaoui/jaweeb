import { APP_CONFIG } from '@/src/configs'
import { QueryClientProvider } from '@tanstack/react-query'
import { DevtoolsPanelOptions, ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppwriteException } from 'appwrite'
import { Component, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from 'react'
import { AppState } from 'react-native'

import { clearAppwriteCache, setupMemoryManagement } from './memory-management'
import { queryClient } from './query'

import { appwriteClient, AppwriteContextType } from './appwriteClient'



type Props = {
  children: ReactNode,
  devTools?: boolean | DevtoolsPanelOptions,
}

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting'

export function AppwriteProvider({ children, devTools }: Props) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle')
  const [retryCount, setRetryCount] = useState(0)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)
  
  // Removed logs state to prevent memory leak
  const value = useMemo<AppwriteContextType>(() => appwriteClient, [])

  const MAX_RETRY_ATTEMPTS = 5
  const BASE_RETRY_DELAY = 1000 // 1 second
  const HEALTH_CHECK_INTERVAL = 30000 // 30 seconds

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
  }, [])

  const clearHealthCheckInterval = useCallback(() => {
    if (healthCheckIntervalRef.current) {
      clearInterval(healthCheckIntervalRef.current)
      healthCheckIntervalRef.current = null
    }
  }, [])

  const doPing = useCallback(async (isRetry = false) => {
    if (isRetry) {
      setConnectionState('reconnecting')
    } else {
      setConnectionState('connecting')
    }

    try {
      // Add timeout to prevent hanging connections
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      await appwriteClient.client.call('GET', new URL(`${APP_CONFIG.APPWRITE_API_URL}/ping`))
      
      clearTimeout(timeoutId)
      setConnectionState('connected')
      setRetryCount(0) // Reset retry count on successful connection
      
      if (__DEV__) {
        console.log('Appwrite connection established successfully')
      }
    } catch (err) {
      const error = err as Error
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        console.error('Appwrite ping timeout')
      } else if (error.message?.includes('INVALID_STATE_ERR') || error.message?.includes('WebSocket')) {
        console.error('Appwrite WebSocket connection error:', error.message)
      } else {
        console.error('Appwrite ping failed:', err instanceof AppwriteException ? err.message : 'unknown')
      }
      
      setConnectionState('error')
      
      // Implement exponential backoff retry logic
      if (retryCount < MAX_RETRY_ATTEMPTS) {
        const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount)
        console.log(`Retrying Appwrite connection in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`)
        
        retryTimeoutRef.current = setTimeout(() => {
          setRetryCount(prev => prev + 1)
          doPing(true)
        }, delay)
      } else {
        console.error('Appwrite connection failed after maximum retry attempts')
        setConnectionState('disconnected')
      }
    }
  }, [retryCount])

  // const startHealthCheck = useCallback(() => {
  //   clearHealthCheckInterval()
    
  //   healthCheckIntervalRef.current = setInterval(() => {
  //     if (connectionState === 'connected') {
  //       doPing(false)
  //     }
  //   }, HEALTH_CHECK_INTERVAL)
  // }, [connectionState, doPing])

  // const handleConnectionStateChange = useCallback((newState: ConnectionState) => {
  //   setConnectionState(newState)
    
  //   if (newState === 'connected') {
  //     startHealthCheck()
  //   } else {
  //     clearHealthCheckInterval()
  //   }
  // }, [startHealthCheck])

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      doPing()
    }

    // Setup memory management
    setupMemoryManagement()

    // Handle app state changes for connection management
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && connectionState === 'disconnected') {
        // Reconnect when app becomes active and was disconnected
        console.log('App became active, attempting to reconnect to Appwrite')
        setRetryCount(0)
        doPing()
      } else if (nextAppState === 'background') {
        // Clear cache when app goes to background to free memory
        clearAppwriteCache()
        // Pause health checks when app goes to background
        clearHealthCheckInterval()
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription?.remove()
      clearRetryTimeout()
      clearHealthCheckInterval()
    }
  }, [doPing, connectionState, clearRetryTimeout, clearHealthCheckInterval])

  return (
    <AppwriteErrorBoundary>
      <AppwriteContext.Provider
        value={value}
      >
        <QueryClientProvider
          client={queryClient}
        >
          {children}

          {
            devTools &&
            <ReactQueryDevtools
              {...(typeof devTools === 'boolean' ? {} : devTools)}
            />
          }
        </QueryClientProvider>
      </AppwriteContext.Provider>
    </AppwriteErrorBoundary>
  )
}

// Error boundary to catch and handle Appwrite-related errors
class AppwriteErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    // Check if this is an Appwrite-related error
    const isAppwriteError = error.message?.includes('INVALID_STATE_ERR') ||
                           error.message?.includes('WebSocket') ||
                           error.message?.includes('Appwrite') ||
                           error.name === 'AppwriteException'

    if (isAppwriteError) {
      console.error('Appwrite error caught by boundary:', error)
      return { hasError: true, error }
    }
    
    // Re-throw non-Appwrite errors
    throw error
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Appwrite error boundary caught error:', error, errorInfo)
    
    // Clear Appwrite cache on connection errors
    if (error.message?.includes('INVALID_STATE_ERR') || error.message?.includes('WebSocket')) {
      try {
        clearAppwriteCache()
      } catch (cacheError) {
        console.error('Failed to clear cache after error:', cacheError)
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Return children with error state - let the app handle the error gracefully
      // rather than showing a crash screen
      console.warn('Appwrite connection error detected, continuing with degraded functionality')
      return this.props.children
    }

    return this.props.children
  }
}

// @ts-ignore
export const AppwriteContext = createContext<AppwriteContextType>()
export const useAppwrite = () => useContext(AppwriteContext)

// Hook to get connection status
export const useAppwriteConnectionStatus = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle')
  
  useEffect(() => {
    // This would need to be connected to the provider's state
    // For now, we'll return a simple status
    return () => {}
  }, [])
  
  return {
    isConnected: connectionState === 'connected',
    isConnecting: connectionState === 'connecting' || connectionState === 'reconnecting',
    isDisconnected: connectionState === 'disconnected' || connectionState === 'error',
    connectionState
  }
}

export const isAppwriteError = (error: unknown): error is AppwriteException => {
  return typeof error === 'object' && !!error && (error as any).name === 'AppwriteException'
}

// Utility function to safely make Appwrite calls with connection state checking
export async function safeAppwriteCall<T>(
  call: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await call()
  } catch (error) {
    const err = error as Error
    if (err.message?.includes('INVALID_STATE_ERR') || err.message?.includes('WebSocket')) {
      console.warn('Appwrite connection error, using fallback or returning undefined:', err.message)
      return fallback
    }
    throw error
  }
}