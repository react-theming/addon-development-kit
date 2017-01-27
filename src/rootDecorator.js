import React from 'react';
import DecorElement from './decorator/container';

export default function decorator(initData) {
    return (story) => {
//        const storyItem = story();
        return (
          <div>
              <header style={{backgroundColor: 'grey', color: 'white' }}>

                  {'It\'s Decorator header'}
                  <DecorElement />
              </header>
              <div>
                  {story()}
              </div>
          </div>
        );
    };
}

