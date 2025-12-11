import { PrimeReactProvider } from 'primereact/api';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  return (
    <PrimeReactProvider>
      <div>
        <h1>Hello, World!</h1>
        <h2 className="bg-gray-600 w-2xl">Tailwind installed</h2>
        <Button label="PrimeReact Button"/>
      </div>
    </PrimeReactProvider>
  )
}

export default App
