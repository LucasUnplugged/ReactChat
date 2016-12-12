import React, {Component, PropTypes} from 'react';
import './Header.scss';

class Header extends Component {
    openInNewWindow() {
        window.open(window.location.href);
    }
    render() {
        let userCount = (this.props.users && this.props.users.length > 0) ? this.props.users.length : false;
        return (
            <header className="Header">
                <h1 className="logo">React<strong>Chat</strong></h1>
                {userCount && <span className="badge">
                    {userCount}&nbsp;
                    <span className="rc-icon-user"></span>
                </span>}
                <a className="control" onClick={this.openInNewWindow}>Open New Window <span className="rc-icon-popup"></span></a>
            </header>
        );
    }
}

Header.propTypes = {
    users: PropTypes.array
};

export default Header;
