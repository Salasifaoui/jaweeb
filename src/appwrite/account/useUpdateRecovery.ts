'use client'

import { useAppwrite } from '@/src/appwrite/AppwriteProvider'
import { MutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { Models } from 'react-native-appwrite'

type TRequest = {
  userId: string
  secret: string
  password: string
}

/**
 * Complete password recovery.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/account?sdk=web-default#accountUpdateRecovery)
 */
function useUpdateRecovery(props?: MutationOptions<Models.Token, unknown, TRequest, unknown>) {
  const { account } = useAppwrite()
  const queryClient = useQueryClient()
  
  const mutation = useMutation<Models.Token, unknown, TRequest, unknown>({
    ...props,
    mutationFn: async request => {
      return await account.updateRecovery(request.userId, request.secret, request.password)
    },

    onSuccess: async (data: Models.Token, request: TRequest, context: unknown) => {
      // Clear account cache since password has been updated
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
      props?.onSuccess?.(data, request, context)
    },
  })

  return mutation
}

export { useUpdateRecovery }
