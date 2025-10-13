
import { Provider as JotaiProvider } from 'jotai'
import { ProviderProps } from 'react'
import { AuthProvider } from './appwrite/auth-context'


export function Provider({ children}: Omit<ProviderProps<any>, 'config'>) {

  return (
    <JotaiProvider>
      <AuthProvider>
        {children}
        </AuthProvider>
    </JotaiProvider>
  )
}
