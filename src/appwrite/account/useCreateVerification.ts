'use client'

import { useAppwrite } from '@/src/appwrite/AppwriteProvider'
import { MutationOptions, useMutation } from '@tanstack/react-query'
import { Models } from 'react-native-appwrite'

type TRequest = {
  url: string
}

/**
 * Send email verification to current user.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/account?sdk=web-default#accountCreateVerification)
 */
function useCreateVerification(props?: MutationOptions<Models.Token, unknown, TRequest, unknown>) {
  const { account } = useAppwrite()
  
  const mutation = useMutation<Models.Token, unknown, TRequest, unknown>({
    ...props,
    mutationFn: async request => {
      return await account.createVerification(request.url)
    },
  })

  return mutation
}

export { useCreateVerification }
