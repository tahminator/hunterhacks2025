import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Box, MantineProvider } from '@mantine/core'
import LandingPage from '@pages/Landing'
import { AppTheme } from '@base/theme/theme'
import '@mantine/core/styles.css'
import { appHeight, appWidth } from '@base/theme/theme'
import Prompt, { PromptPage } from '@pages/Prompt/Prompt.page'
import { AllergyItem } from './components/AllergyStack/Allergy.item'
import { Severity } from '@base/types'

function App() {
  return (
    <MantineProvider theme={AppTheme}>
      <Box w={appWidth} h={appHeight} bd={'solid 1px black'} pos={'absolute'}>
        <AllergyItem name="Gluten" severity={Severity.low} />
        <MemoryRouter>
          <Routes>
            {/* <Route path="/" element={<LandingPage />} /> */}
            <Route path="/" element={<PromptPage />} />
            <Route path="/profile" element={<span>Profile</span>} />
          </Routes>
        </MemoryRouter>
      </Box>
    </MantineProvider>
  )
}

export default App
