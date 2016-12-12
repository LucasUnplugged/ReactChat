import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Header from '../Header/Header';
import UserPanel from '../UserPanel/UserPanel';
import ChatLog from '../ChatLog/ChatLog';
import './App.scss';

class App extends Component {
    render() {
        let activeUsers = (this.props.users && this.props.users instanceof Array) ? this.props.users.filter(user => user.online === true) : [];
        return (
            <section className="App">
                <Header users={activeUsers} />
                <UserPanel />
                <ChatLog />
            </section>
        );
    }
}

App.propTypes = {
    users: PropTypes.array
};

const mapStateToProps = function(store) {
    return {
        users: store.users
    };
}

export default connect(mapStateToProps)(App);
