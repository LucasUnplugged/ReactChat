import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/App/App';
import store from './redux/store';
import appConfig from './shared/appConfig';
import './index.scss';

console.log( 'Starting new ReactChat instance (' + appConfig.id + ')' );

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
