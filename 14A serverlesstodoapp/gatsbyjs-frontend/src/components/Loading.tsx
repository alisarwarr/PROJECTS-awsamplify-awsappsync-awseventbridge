import React from 'react';
import style from './Loading.module.scss';
import classnames from 'classnames';

interface LoadingProp {
    sentence: String;
}

function Loading({ sentence }: LoadingProp) {
    return (
        <div className={style.loading}>
            <div className={classnames(style.jumbotron, "jumbotron", "jumbotron-fluid")}>
                <div className="container">
                    <h1>
                        <span> {sentence} </span>
                        <div className="spinner-grow text-warning" style={{ width: "1rem", height: "1rem" }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <div className="spinner-grow text-danger" style={{ width: "1rem", height: "1rem" }} role="status">
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

export default Loading;