import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import { Box, Button, MantineProvider, Title } from '@mantine/core';
import LandingPage from '@pages/Landing';
import { AppTheme } from '@base/theme/theme';
import "@base/theme/theme.module.css"
import '@mantine/core/styles.css';

function App() {
  const appHeight = "550px";
  const appWidth = "350px";

  return (
    <MantineProvider theme={AppTheme}>
      <Box w={appWidth} h={appHeight} bd={"solid 1px black"}>
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
