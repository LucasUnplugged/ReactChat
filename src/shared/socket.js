import io from 'socket.io-client';
import appConfig from './appConfig';
import store from './store';

const socket = io('http://localhost:3000');

var isFirstLoad = true;

socket.on('stateChange', message => {
    // Only apply if the source wasn't this instance
    if (message && message.state && message.id && message.id !== appConfig) {
        store.dispatch({
            type: 'REFRESH_STATE',
            state: message.state
        });
    }
});

socket.on('stateLoad', message => {
    if (isFirstLoad && message && message.state) {
        store.dispatch({
            type: 'REFRESH_STATE',
            state: message.state
        });
        isFirstLoad = false;
    }
});


export default socket;
