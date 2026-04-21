import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ThemeProvider} from './context/theme.context';
import {InvoiceProvider} from "./context/invoice.context.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThemeProvider>
          <InvoiceProvider>
              <App/>
          </InvoiceProvider>
      </ThemeProvider>
  </StrictMode>,
)