import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { TitleProvider } from './context/TitleContext.jsx';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <TitleProvider>
        <App />
      </TitleProvider>
    </BrowserRouter>
);
