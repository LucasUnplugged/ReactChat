import {combineReducers} from 'redux';
import appConfig from '../shared/appConfig';
import uuid from 'node-uuid';
import update from 'immutability-helper';
import moment from 'moment';

// REDUCERS ///////////////////////////////////////////////
// REDUCER: Users
const userReducer = function(state = [], action) {
    let newState = [];

    // PROCESS ACTIONS //
    // Add user
    if (action.type === 'ADD_USER' && action.user && action.user.name) {
        // Prepare new user
        let newUser = action.user;
        newUser.id = uuid.v4();
        newUser.online = true;
        newUser.window = appConfig.id;
        newUser.typing = false;
        newUser.text = '';

        // Add user to state
        newState = update(state, {$push: [newUser]});
        return newState;
    }

    // Remove user
    if (action.type === 'REMOVE_USER' && action.user && action.user.id) {
        // Get user
        const savedUser = state.find(user => user.id === action.user.id);
        let index = state.indexOf(savedUser);

        // Remove user from state
        newState = update(state, {$splice: [[index, 1]]});
        return newState;
    }

    // User chat input
    else if (action.type === 'USER_CHAT_INPUT' && action.user && action.user.id) {
        // Get user
        const savedUser = state.find(user => user.id === action.user.id);
        let index = state.indexOf(savedUser);

        // Update user
        let typing = (action.user.typing) ? true : false;
        newState = update(state, {
            [index]: {
               text: {$set: action.user.text},
               typing: {$set: typing}
            }
        });
        return newState;
    }

    return state;
};

// REDUCER: New User
const newUserReducer = function(state = {}, action) {
    let newState = {};

    // SET DEFAULTS //
    if (!state.name) { state.name = ''; }

    // PROCESS ACTIONS //
    // Add user
    if (action.type === 'SET_NEW_USER') {
        newState = Object.assign({}, state, { name: action.username });
        return newState;
    }
    return state;
};

// REDUCER: Messages
const messagesReducer = function(state = [], action) {
    let newState = [];

    // PROCESS ACTIONS //
    // Add message
    if (action.type === 'ADD_MESSAGE' && action.message && action.message.text && action.message.user) {
        // Prepare new message
        let now = moment();
        let newMessage = {
            id: uuid.v4(),
            user: action.message.user,
            timestamp: now.format('x'),
            text: action.message.text
        };

        // Add user to state
        newState = update(state, {$push: [newMessage]});
        return newState;
    }

    return state;
};


const chatApp = combineReducers({
    users: userReducer,
    newUser: newUserReducer,
    messages: messagesReducer
})


export default chatApp;
