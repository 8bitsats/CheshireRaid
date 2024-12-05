import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ActiveRaids from './pages/ActiveRaids';
import CreateRaid from './pages/CreateRaid';
import MyRaids from './pages/MyRaids';

function App() {
  return (
    <Box minH="100vh" bg="gray.900">
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/active-raids" element={<ActiveRaids />} />
          <Route path="/create-raid" element={<CreateRaid />} />
          <Route path="/my-raids" element={<MyRaids />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
