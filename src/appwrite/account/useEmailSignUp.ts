'use client'

import { useAppwrite } from '@/src/appwrite/AppwriteProvider'
import { MutationOptions, useMutation } from '@tanstack/react-query'
import { ID, Models } from 'react-native-appwrite'

type TRequest = {
  userId?: string,
  name?: string,
  email: string,
  password: string,
}

/**
 * Create new account using email.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/account?sdk=web-default#accountCreateEmailSession)
 */
function useEmailSignUp<Preferences extends Models.Preferences>(props: MutationOptions<Models.User<Preferences>, unknown, TRequest, unknown>) {
  const { account } = useAppwrite()
  const mutation = useMutation<Models.User<Preferences>, unknown, TRequest, unknown>({
    ...props,
    mutationFn: async request => {
      return await account.create(request.userId ?? ID.unique(), request.email, request.password, request.name)
    },
  })

  return mutation
}

export { useEmailSignUp }
