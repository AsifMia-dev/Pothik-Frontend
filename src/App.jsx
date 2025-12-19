import RouteComponents from './routes/RouteComponents';
import AuthProvider from './context/AuthContext';

import { PrimeReactProvider } from 'primereact/api';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import Homepage from './pages/Homepage';

function App() {
  return (
    <PrimeReactProvider>
      <AuthProvider>
        <RouteComponents />
      </AuthProvider>
    </PrimeReactProvider>
  )
}

export default App
