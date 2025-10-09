'use client'

import { useAppwrite } from '@/src/appwrite/AppwriteProvider'
import { MutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { Models } from 'react-native-appwrite'

type TRequest = {
  userId: string
  secret: string
}

/**
 * Complete phone verification process with OTP.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/account?sdk=web-default#accountUpdatePhoneVerification)
 */
function useUpdatePhoneVerification(props?: MutationOptions<Models.Token, unknown, TRequest, unknown>) {
  const { account } = useAppwrite()
  const queryClient = useQueryClient()
  
  const mutation = useMutation<Models.Token, unknown, TRequest, unknown>({
    ...props,
    mutationFn: async request => {
      return await account.updatePhoneVerification(request.userId, request.secret)
    },

    onSuccess: async (data: Models.Token, request: TRequest, context: unknown) => {
      // Refresh the account data to update verification status
      queryClient.invalidateQueries({ queryKey: ['appwrite', 'account'] })
      props?.onSuccess?.(data, request, context)
    },
  })

  return mutation
}

export { useUpdatePhoneVerification }
