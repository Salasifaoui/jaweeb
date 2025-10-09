'use client';

import { useAppwrite } from '@/src/appwrite/AppwriteProvider';
import { APP_CONFIG } from '@/src/configs';
import { MutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteAccount(props: MutationOptions<{}, unknown, void, unknown>) {
  const { client } = useAppwrite();
  const queryClient = useQueryClient();
  const mutation = useMutation<{}, unknown, void, unknown>({
    ...props,
    mutationFn: async () => {
      // Use type assertion to access the delete method
      // The delete method exists in Appwrite but may not be in TypeScript definitions
      return client.call('DELETE', new URL(`/v1/account`, APP_CONFIG.APPWRITE_API_URL), {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      });
    },

    onSuccess: async (data: {}, request: void, context: unknown) => {
      // Clear all cached data after account deletion
      queryClient.clear();
      props.onSuccess?.(data, request, context);
    },
  });

  return mutation;
}
