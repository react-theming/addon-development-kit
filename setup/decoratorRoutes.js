import React from 'react';
import addonDecor from './containers/addonDecorator';
import voting from './containers/voting';

export default function routes(currentStoreCompose) {
    const AddonDecor = addonDecor(currentStoreCompose);
    const Voting = voting(currentStoreCompose);

    return function attach(story, ...props) {
        return (
            <div>
               <AddonDecor
                   voting={() => <Voting />}
                   story={ story }

                />

            </div>
        );
    }
}
