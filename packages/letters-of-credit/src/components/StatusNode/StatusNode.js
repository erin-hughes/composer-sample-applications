import React from 'react';
import './statusnode.css';

class StatusBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.image
    }
  }

  render() {
    let generatedJSX = [];
    generatedJSX.push((<div><img src={this.state.image} alt="image not found"/></div>));
    return (
      <div className="Container">
      {generatedJSX.map((jsx) => {
        return (jsx);
      })}
      </div>
    );
  }
}

export default StatusBar;
