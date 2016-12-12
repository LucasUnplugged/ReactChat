import {createStore} from 'redux';
import chatApp from './reducers'

const store = createStore(chatApp);

export default store;
