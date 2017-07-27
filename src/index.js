import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import Store from './store';

const StoreInstance = Store();

ReactDOM.render( <Provider store={StoreInstance}>
   <App />
 </Provider>, document.getElementById('root'));
registerServiceWorker();
