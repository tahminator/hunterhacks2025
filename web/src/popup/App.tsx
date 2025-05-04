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
import { useContext } from 'react'
import { ImageContext } from './contexts/ImageContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from '@pages/Home/Home.page'

const queryClient = new QueryClient()

function RenderedPopup() {
  const { snapshotData } = useContext(ImageContext)
  return snapshotData ? <PromptPage /> : <HomePage />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ImageProvider>
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
                {/* <Route path="/" element={<RenderedPopup />} /> */}
                <Route path="/" element={<PromptPage />} />
              </Routes>
            </MemoryRouter>
          </Box>
        </MantineProvider>
      </ImageProvider>
    </QueryClientProvider>
  )
}

export default App
