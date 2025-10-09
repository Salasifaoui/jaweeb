'use client'

import { useAppwrite } from '@/src/appwrite/AppwriteProvider'
import { MutationOptions, useMutation } from '@tanstack/react-query'
import { Models } from 'react-native-appwrite'

type TRequest = {
  email: string
  url: string
}

/**
 * Create password recovery.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/account?sdk=web-default#accountCreateRecovery)
 */
function useCreateRecovery(props?: MutationOptions<Models.Token, unknown, TRequest, unknown>) {
  const { account } = useAppwrite()
  
  const mutation = useMutation<Models.Token, unknown, TRequest, unknown>({
    ...props,
    mutationFn: async request => {
      return await account.createRecovery(request.email, request.url)
    },
  })

  return mutation
}

export { useCreateRecovery }
