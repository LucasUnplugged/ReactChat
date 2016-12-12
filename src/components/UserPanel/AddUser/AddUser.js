import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import store from '../../../shared/store';
import './AddUser.scss';

class AddUser extends Component {
    componentDidMount() {
        if (document.activeElement.tagName === 'BODY') {
            this.refs.nameInput.focus();
        }
    }
    setUsername(event) {
        store.dispatch({
            type: 'SET_NEW_USER',
            username: event.target.value
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        // Add the user
        store.dispatch({
            type: 'ADD_USER',
            user: { name: this.props.username }
        });
        // Reset new user
        store.dispatch({
            type: 'SET_NEW_USER',
            username: ''
        });
        // Refocus
        this.refs.nameInput.focus();
    }
    render() {
        return (
            <form className="AddUser" onSubmit={scope => this.handleSubmit(scope)}>
                <fieldset className="button-input">
                    <input
                        type="text"
                        placeholder="User name"
                        value={this.props.username}
                        onChange={scope => this.setUsername(scope)}
                        ref="nameInput"  />
                    <button type="submit">Add</button>
                </fieldset>
            </form>
        );
    }
}

AddUser.propTypes = {
    username: PropTypes.string.isRequired
};

const mapStateToProps = function(store) {
    return {
        username: store.newUser.name
    };
}

export default connect(mapStateToProps)(AddUser);
