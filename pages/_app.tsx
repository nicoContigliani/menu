// pages/_app.tsx
import './globals.css'; // Importa los estilos globales
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Provider } from 'react-redux'; // Importa el Provider de Redux
import { store } from '../redux/store/store';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}> {/* Envuelve la aplicación con el Provider */}
      <Component {...pageProps} /> {/* Renderiza la página correspondiente */}
    </Provider>
  );
}

export default MyApp;