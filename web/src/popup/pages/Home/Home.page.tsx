import LandingPage from '@pages/Landing'
import { Box, LoadingOverlay } from '@mantine/core'
import ProfilePage from '../Profile/Profile.page'
import { useAuthQuery } from '@base/popup/api/auth'

export default function HomePage() {
  const { status, isLoading } = useAuthQuery()

  return (
    <>
      <Box>
        <LoadingOverlay visible={isLoading} />
      </Box>
      {status === 'success' ? <ProfilePage /> : <LandingPage />}
    </>
  )
}
