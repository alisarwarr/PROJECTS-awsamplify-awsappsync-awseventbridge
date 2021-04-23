import React from 'react';
import { Amplify } from 'aws-amplify';
import awsmobile from '../aws-exports.js';

export const wrapRootElement = ({ element }) => {
    Amplify.configure(awsmobile);

    return <div>{element}</div>
}