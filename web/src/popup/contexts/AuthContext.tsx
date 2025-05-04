import { createContext } from 'react'

export const AuthContext = createContext({
  isLoggedIn: false,
  isLoadingLogin: false,
  refetchLogin: () => {
    return
  },

  logoutClient: () => {
    return
  },
})
