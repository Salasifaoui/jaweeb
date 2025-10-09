import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useAppwrite } from '@/src/appwrite/AppwriteProvider';
import { ExecutionMethod } from 'react-native-appwrite';
import { useRef } from 'react';
import * as WebBrowser from 'expo-web-browser';

/**
 * Helper function to handle auto-redirect when location header is present
 */
const handleRedirectIfNeeded = async (responseHeaders: any[]) => {
  if (!responseHeaders || !Array.isArray(responseHeaders)) return;

  const locationHeader = responseHeaders.find(
    (header) => header.name && header.name.toLowerCase() === 'location'
  );

  if (locationHeader && locationHeader.value) {
    if (__DEV__) {
      console.log('Auto-redirecting to:', locationHeader.value);
    }

    try {
      await WebBrowser.openBrowserAsync(locationHeader.value, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        controlsColor: '#007AFF',
        dismissButtonStyle: 'close',
      });
    } catch (error) {
      console.error('Failed to open redirect URL:', error);
    }
  }
};

/**
 *
 * @param id The ID of the function.
 * @returns The function's response, automatically JSON deserialized.
 */
export function useFunction<TRequest, TResponse>(
  functionId: string,
  options = {},
  props = {}
): UseMutationResult<TResponse, unknown, TRequest, unknown> {
  const params = {
    async: true,
    xpath: undefined,
    method: ExecutionMethod.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };
  const { functions, client } = useAppwrite();
  const { async, xpath, method, headers } = params;
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const mutation = useMutation<TResponse, unknown, TRequest, unknown>({
    ...props,
    mutationFn: async (request: TRequest) => {
      const body = `${JSON.stringify(request)}`;
      const execution = await functions.createExecution(
        functionId,
        body,
        async,
        xpath,
        method,
        headers
      );
      if (__DEV__) {
        console.log('Appwrite execution started:', execution.$id);
        console.log('Appwrite execution response:', JSON.stringify(execution, null, 2));
      }

      if (execution.status === 'completed') {
        // handle responseHeaders if contains location
        await handleRedirectIfNeeded(execution.responseHeaders);

        try {
          return JSON.parse(execution.responseBody || '{}');
        } catch (error) {
          console.error('Failed to parse execution response:', error);
          throw new Error('Invalid response format');
        }
      } else if (execution.status === 'failed') {
        throw new Error(execution.responseBody || 'Function execution failed');
      }

      const response = await new Promise<TResponse>((resolve, reject) => {
        // Set a timeout to prevent indefinite waiting
        const timeout = setTimeout(
          () => {
            if (unsubscribeRef.current) {
              try {
                unsubscribeRef.current();
              } catch (error) {
                console.error('Failed to cleanup subscription on timeout:', error);
              }
            }
            reject(new Error('Function execution timeout'));
          },
          1000 * 60 * 5
        ); // 5 minute timeout

        try {
          unsubscribeRef.current = functions.client.subscribe(
            `executions.${execution.$id}`,
            (event: any) => {
              try {
                const payload = event.payload as any;

                if (__DEV__) {
                  console.log('Execution event received:', payload.status);
                }

                switch (payload.status) {
                  case 'completed':
                    clearTimeout(timeout);
                    // Handle redirect if location header is present (non-blocking)
                    handleRedirectIfNeeded(payload.responseHeaders).catch((error) => {
                      console.error('Failed to handle redirect:', error);
                    });

                    try {
                      resolve(JSON.parse(payload.response));
                    } catch (error) {
                      reject(new Error('Invalid response format'));
                    }
                    break;
                  case 'failed':
                    clearTimeout(timeout);
                    reject(new Error(payload.response || 'Function execution failed'));
                    break;
                }
              } catch (error) {
                clearTimeout(timeout);
                reject(error);
              }
            }
          );
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });

      // Cleanup subscription
      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        } catch (error) {
          console.error('Failed to cleanup function execution subscription:', error);
        }
      }

      return response;
    },
  });

  return mutation;
}
