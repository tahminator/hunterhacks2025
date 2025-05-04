import { getIsAuthenticated, logOut } from '@api/authenication'
import { AuthContext } from './AuthContext'
import { useMutation, useQuery } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

export function AuthProvider(props: PropsWithChildren) {
  const {
    data: loginStatus,
    isLoading: isLoadingLogin,
    refetch: refetchLogin,
  } = useQuery<boolean>({
    queryKey: ['loggedin'],
    queryFn: () => {
      return getIsAuthenticated()
        .then((res) => {
          return res.loggedIn
        })
        .catch(() => {
          return false
        })
    },
  })

  const isLoggedIn = loginStatus || false
  console.log(isLoggedIn)

  const mutateLogout = useMutation({
    mutationFn: () => {
      return logOut()
    },
  })

  const logoutClient = () => {
    mutateLogout
      .mutateAsync()
      .then(() => refetchLogin())
      .catch(() => {
        alert('An error occured. Could not post the announcement.')
      })
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoadingLogin,
        refetchLogin,
        logoutClient,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
