// import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import { Button, MantineProvider } from '@mantine/core';
import { AppTheme } from '@base/theme/theme';
import "@base/theme/theme.module.css"
import '@mantine/core/styles.css';

function App() {

  return (
    <MantineProvider theme={AppTheme}>
      <Button>Test!</Button>
      {/* <MemoryRouter>
        <Routes>
          <Route path="/" element={<span>Home</span>} />
          <Route path="/profile" element={<span>Profile</span>} />
        </Routes>
      </MemoryRouter> */}
    </MantineProvider>
  )
}

export default App
