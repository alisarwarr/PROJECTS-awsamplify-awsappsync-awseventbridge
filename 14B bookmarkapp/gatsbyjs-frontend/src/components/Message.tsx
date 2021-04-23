import React from 'react';
import style from './Message.module.scss';
import classnames from 'classnames';

interface MessageProp {
    sentence: String;
}

function Message({ sentence }: MessageProp) {
    return (
        <div className={style.message}>
            <div className={classnames(style.jumbotron, "jumbotron", "jumbotron-fluid")}>
                <div className="container">
                    <h1>
                        <span> {sentence} </span>
                        <div className="spinner-grow text-warning" style={{ width: "1rem", height: "1rem" }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <div className="spinner-grow text-light" style={{ width: "1rem", height: "1rem" }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <div className="spinner-grow text-success" style={{ width: "1rem", height: "1rem" }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default Message;