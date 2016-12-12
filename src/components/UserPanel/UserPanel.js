import React, {Component} from 'react';
import {connect} from 'react-redux';
import AddUser from './AddUser/AddUser';
import UserForm from './UserForm/UserForm';
import './UserPanel.scss';

class UserPanel extends Component {
    render() {
        let users = (this.props.users && this.props.users.length > 0) ? this.props.users : false;
        return (
            <aside className="UserPanel">
                <AddUser />
                {users && users.map(
                    user => (<UserForm key={user.id} id={user.id} />)
                )}
            </aside>
        );
    }
}

const mapStateToProps = function(store) {
    return {
        users: store.users
    };
}

export default connect(mapStateToProps)(UserPanel);
