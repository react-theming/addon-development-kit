import React from 'react';
import voting from './containers/voting';

export default function routes(currentStoreCompose) {
    const Voting = voting(currentStoreCompose);

    return function attach(story, ...props) {
        return (
          <div>
            <Voting />

          </div>
        );
    };
}
