import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { TitleProvider } from './hook/TitleContext.jsx';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <TitleProvider>
        <App />
      </TitleProvider>
    </BrowserRouter>
);
