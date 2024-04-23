import { hydrateRoot } from 'react-dom/client'
import App from './App.tsx'

const domNode = document.getElementById('root');
if(domNode) {
  hydrateRoot(domNode, 
    <App />
  );
}
