import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import LoadingScreen from './components/LoadingScreen';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#f0e4ff',
      100: '#cbb2ff',
      200: '#a480ff',
      300: '#7b4dff',
      400: '#531bff',
      500: '#3a01e6',
      600: '#2d00b4',
      700: '#200082',
      800: '#130051',
      900: '#070021',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white'
      }
    }
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

function Root() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <AppProvider>
            <App />
          </AppProvider>
        </BrowserRouter>
      </ChakraProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
