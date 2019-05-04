import React from 'react';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withChannel(WrappedComponent) {
  class WithChannel extends React.Component {
    state = {
      data: 123,
    };

    render() {
      return <WrappedComponent />;
    }
  }
  WithChannel.displayName = `WithSubscription(${getDisplayName(
    WrappedComponent
  )})`;
  return WithChannel;
}

export default withChannel;
