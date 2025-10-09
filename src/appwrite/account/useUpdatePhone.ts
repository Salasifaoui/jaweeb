'use client'

import { useAppwrite } from '@/src/appwrite/AppwriteProvider'
import { MutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { Models } from 'react-native-appwrite'

type TRequest = {
  phone: string
  password: string
}

/**
 * Update current user's phone number.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/account?sdk=web-default#accountUpdatePhone)
 */
function useUpdatePhone(props?: MutationOptions<Models.User<any>, unknown, TRequest, unknown>) {
  const { account } = useAppwrite()
  const queryClient = useQueryClient()
  
  const mutation = useMutation<Models.User<any>, unknown, TRequest, unknown>({
    ...props,
    mutationFn: async request => {
      return await account.updatePhone(request.phone, request.password)
    },

    onSuccess: async (data: Models.User<any>, request: TRequest, context: unknown) => {
      // Update the account cache
      queryClient.setQueryData(['appwrite', 'account'], data)
      props?.onSuccess?.(data, request, context)
    },
  })

  return mutation
}

export { useUpdatePhone }
