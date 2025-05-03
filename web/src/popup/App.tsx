import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Box, MantineProvider } from '@mantine/core'
import LandingPage from '@pages/Landing'
import { AppTheme } from '@base/theme/theme'
import '@mantine/core/styles.css'
import { appHeight, appWidth } from '@base/theme/theme'
import { PromptPage } from '@pages/Prompt/Prompt.page'
import { Severity } from '@base/types'
import AllergyCard from './components/AllergyCard'

function App() {
  return (
    <MantineProvider theme={AppTheme}>
      <Box w={appWidth} h={appHeight} bd={'solid 1px black'} pos={'absolute'}>
        <MemoryRouter>
          <AllergyCard
            profileName="awd"
            allergyList={[
              { name: 'Gluten', severity: Severity.low },
              { name: 'Gluten', severity: Severity.med },
              { name: 'Gluten', severity: Severity.low },
              { name: 'Gluten', severity: Severity.high },
              { name: 'Gluten', severity: Severity.low },
              { name: 'Gluten', severity: Severity.low },
              { name: 'Gluten', severity: Severity.low },
            ]}
          />
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
