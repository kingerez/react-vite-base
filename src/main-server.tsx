import ReactDOMServer from 'react-dom/server'
import App from './App.tsx'

export const render = () => {
  return ReactDOMServer.renderToString(
    <App />
  );
};
