import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
import { Box, MantineProvider } from '@mantine/core'
import LandingPage from '@pages/Landing'
import { AppTheme } from '@base/theme/theme'
import '@base/theme/theme.module.css'
import '@mantine/core/styles.css'
import { appHeight, appWidth } from '@base/theme/theme'

function App() {
  return (
    <MantineProvider theme={AppTheme}>
      <Box w={appWidth} h={appHeight} bd={'solid 1px black'} pos={'absolute'}>
        <MemoryRouter>
          {/* <Link to="/">To Home!</Link>
        <Link to="/profile">To Profile!</Link> */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile" element={<span>Profile</span>} />
          </Routes>
        </MemoryRouter>
      </Box>
    </MantineProvider>
  )
}

export default App
