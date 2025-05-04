import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Box, MantineProvider } from '@mantine/core'
// import LandingPage from '@pages/Landing'
import { AppTheme } from '@base/theme/theme'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import { appHeight, appWidth } from '@base/theme/theme'
// import PromptWrapper, { PromptPage } from '@pages/Prompt/Prompt.page'
import { PromptPage } from '@pages/Prompt/Prompt.page'
import { ImageProvider } from './contexts/ImageProvider'
import { useContext, useMemo } from 'react'
import { ImageContext } from './contexts/ImageContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from '@pages/Home/Home.page'
import { AuthProvider } from './contexts/AuthProvider'

const queryClient = new QueryClient()

function RenderedPopup() {
  const { snapshotData } = useContext(ImageContext)
  const rendered = useMemo(() => {
    return snapshotData ? <PromptPage /> : <HomePage />
  }, [snapshotData])

  return rendered
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ImageProvider>
        <AuthProvider>
          <MantineProvider theme={AppTheme}>
            <Box
              w={appWidth}
              h={appHeight}
              bd={'solid 1px black'}
              pos={'absolute'}
              style={{ overflow: 'hidden' }}
            >
              <MemoryRouter>
                {/* <PromptWrapper /> */}
                <Routes>
                  {/* <Route path="/" element={<LandingPage />} /> */}
                  <Route path="/" element={<RenderedPopup />} />
                  {/* <Route path="/prompt" element={<PromptPage />} /> */}
                </Routes>
              </MemoryRouter>
            </Box>
          </MantineProvider>
        </AuthProvider>
      </ImageProvider>
    </QueryClientProvider>
  )
}

export default App
