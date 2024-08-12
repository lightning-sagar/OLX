import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {  ColorModeScript, extendTheme } from '@chakra-ui/react';
import {ChakraProvider} from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { mode } from '@chakra-ui/theme-tools'
import { RecoilRoot } from 'recoil'
import './index.css'


const styles = {
  global:(props) =>({
    body:{
      color:mode('gray.800','whiteAlpha.900')(props),
      bg:mode('#ffffff','#101010')(props)
    },
  }),
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};

const theme = extendTheme({ config, styles, colors });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </BrowserRouter>
      </RecoilRoot>
  </StrictMode>
)
