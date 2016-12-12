import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import './ChatLog.scss';
import moment from 'moment';

class ChatLog extends Component {
    getTime(timestamp) {
        if (!timestamp) {
            return '';
        }

        let time = moment(timestamp, 'x');
        let today = moment().startOf('day');
        let timeText = '';

        if (time.isSame(today, 'd')) {
            timeText = time.format('h:mm A');
        } else {
            timeText = '> 1 day ago'
        }
        return timeText;
    }
    componentDidUpdate() {
        this.refs.chatLog.scrollTop = this.refs.chatLog.scrollHeight;
    }
    render() {
        let messages = (this.props.messages && this.props.messages.length > 0) ? this.props.messages : false;
        let users = (this.props.users && this.props.users.length > 0) ? this.props.users : false;
        let typingUsers = (users && users instanceof Array) ? users.filter(user => user.typing === true) : [];
        let typingUsersText = (typingUsers.length > 0) ? typingUsers.map(user => user.name).join(', ') : false;

        if (typingUsers.length === 1) {
            typingUsersText += ' is typing...';
        } else if (typingUsers.length > 1) {
            typingUsersText = typingUsersText.replace(/, ([^, ]*)$/,' and $1');
            typingUsersText += ' are typing...';
        }

        return (
            <section className="ChatLog" ref="chatLog">
                <ul className="log">
                    {messages && messages.map(
                        message => (<li key={message.id}>
                            <span className="meta">
                                <span className="user">{message.user.name}</span>
                                <span className="time">{this.getTime(message.timestamp)}</span>
                            </span>
                            {message.text}
                        </li>)
                    )}
                </ul>
                {typingUsersText && <p className="typing-indicator">{typingUsersText}</p>}
            </section>
        );
    }
}

ChatLog.propTypes = {
    messages: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired
};

const mapStateToProps = function(store) {
    return {
        messages: store.messages,
        users: store.users
    };
}

export default connect(mapStateToProps)(ChatLog);
