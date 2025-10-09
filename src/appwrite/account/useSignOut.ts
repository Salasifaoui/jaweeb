'use client'

import { MutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { Models } from 'react-native-appwrite'
import { useAppwrite } from '@/src/appwrite/AppwriteProvider'

type TRequest = {
  sessionId?: string,
}

/**
 * Delete current or the specified session.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/account?sdk=web-default#accountDeleteSession)
 */
function useSignOut(props: MutationOptions<Models.Session | void, unknown, TRequest | undefined | void, unknown>) {
  const { account: accountService } = useAppwrite()
  const queryClient = useQueryClient()
  const mutation = useMutation<Models.Session | void, unknown, TRequest | undefined | void, unknown>({
    ...props,
    mutationFn: async request => {
      if (!request?.sessionId) {
        return void await accountService.deleteSession('current')
      }

      const session = await accountService.getSession(request.sessionId)

      accountService.deleteSession(session.$id)

      return session
    },

    onSuccess: async (...args) => {
      queryClient.setQueryData(['appwrite', 'account'], null)
      props.onSuccess?.(...args)
    },
  })

  return mutation
}

export { useSignOut }
