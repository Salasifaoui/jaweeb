'use client'

import { useAppwrite } from '@/src/appwrite/AppwriteProvider'
import { MutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { Models } from 'react-native-appwrite'

type TRequest = {
  email: string,
  password: string,
}
/**
 * Create email session.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/account?sdk=web-default#accountCreateEmailSession) 
 */
function useEmailSignIn(props: MutationOptions<Models.Session, unknown, TRequest, unknown>) {
  const { account } = useAppwrite()
  const queryClient = useQueryClient()
  const mutation = useMutation<Models.Session, unknown, TRequest, unknown>({
    ...props,
    mutationFn: async request => {
      return await account.createEmailPasswordSession(request.email, request.password)
    },

    onSuccess: async (data: Models.Session, request: TRequest, context: unknown) => {
      queryClient.setQueryData(['appwrite', 'account'], await account.get())
      props.onSuccess?.(data, request, context)
    },
  })

  return mutation
}

export { useEmailSignIn }
