import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import store from '../../../shared/store';
import './UserForm.scss';

class UserForm extends Component {
    componentDidMount() {
        this.refs.chatInput.focus();
    }
    setUserChatInput(event) {
        let text = event.target.value;
        let typing = (text && text.length > 0) ? true : false;
        store.dispatch({
            type: 'USER_CHAT_INPUT',
            user: { id: this.props.user.id, text: text, typing: typing }
        });
    }
    removeUser(){
        store.dispatch({
            type: 'REMOVE_USER',
            user: this.props.user
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        // Add the message
        store.dispatch({
            type: 'ADD_MESSAGE',
            message: { user: this.props.user, text: this.props.user.text }
        });
        // Reset user's chat input
        store.dispatch({
            type: 'USER_CHAT_INPUT',
            user: { id: this.props.user.id, text: '', typing: false }
        });
        // Refocus
        this.refs.chatInput.focus();
    }
    render() {
        let user = this.props.user;
        return (
            <form className="UserForm" onSubmit={scope => this.handleSubmit(scope)}>
                <header>
                    <h1>{user.name}</h1>
                    <a className="control" onClick={scope => this.removeUser(scope)}><span className="rc-icon-cancel"></span></a>
                </header>
                <fieldset className="button-input">
                    <input
                        type="text"
                        placeholder="Enter chat message"
                        value={this.props.user.text}
                        onChange={scope => this.setUserChatInput(scope)}
                        ref="chatInput"  />
                    <button type="submit">Send</button>
                </fieldset>
            </form>
        );
    }
}

UserForm.propTypes = {
    id: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = function(store, props) {
    return {
        user: store.users.find(user => user.id === props.id)
    };
}

export default connect(mapStateToProps)(UserForm);
