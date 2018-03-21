import React from 'react';
import './alert.css';

class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alertType: this.props.alertType,
      alertMessage: this.props.alertMessage
    };
  }

  render()
  {
    return (
      <div className="Alert">
        <p>{this.state.alertType}</p>
        <p>{this.state.alertMessage}</p>
      </div>
    );
  }
}

export default Alert;
