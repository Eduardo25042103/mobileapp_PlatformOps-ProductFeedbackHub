import { registerRootComponent } from 'expo';
import App from './App';

// Asegura que en entornos web el fondo del documento coincida con el modo oscuro
if (typeof document !== 'undefined' && document.body) {
  document.body.style.backgroundColor = '#0F172A';
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';
}

registerRootComponent(App);
