import React from 'react';
// import DecorElement from './decorator/container'; todo: revert
import DecorElement from './panel/container';

export default function decorator(initData) {
    console.info('## rooDecorator(initData) ##')
    return (storyFn, context) => {
        console.log('Context:', context);
        return (
          <div>
              <header style={{backgroundColor: 'grey', color: 'white' }}>

                  {'It\'s Decorator header'}
                  <DecorElement decorator={initData}/>
              </header>
              <div>
                  {storyFn()}
              </div>
          </div>
        );
    };
}

