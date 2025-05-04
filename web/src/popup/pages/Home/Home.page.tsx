import { AuthContext } from '@base/popup/contexts/AuthContext'
import { useContext, useMemo } from 'react'
import LandingPage from '@pages/Landing'
import { Box, Button, LoadingOverlay } from '@mantine/core'

export default function HomePage() {
  const { isLoggedIn, logoutClient, isLoadingLogin } = useContext(AuthContext)

  const rendered = useMemo(() => {
    if (!isLoggedIn) {
      return <LandingPage />
    }
    return (
      <Box>
        <Button onClick={() => logoutClient()} />
      </Box>
    )
    // return <ProfilePage />
  }, [isLoggedIn])
  return (
    <>
      <Box>
        <LoadingOverlay visible={isLoadingLogin} />
      </Box>
      {rendered}
    </>
  )
}
