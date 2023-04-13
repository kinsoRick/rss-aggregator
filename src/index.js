import init from './init.js';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import app from './app.js';

const { i18n } = init();

app(i18n);
