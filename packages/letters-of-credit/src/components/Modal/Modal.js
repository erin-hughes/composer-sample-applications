import React, { Component } from 'react';
import './modal.css';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    }
	}

  handleClick() {
    this.setState({
      show: false
    })
	}

  render() {
    if(this.state.show === false) {
      return (<div />);
    }
    else {
      return (
      	<div id="modalBackground" className="background">
          <div id="modalContainer" className="container">
            <span id="titleText" className="title textMargins"> Are you sure you want to approve this Letter of Credit? </span>
            <p id="messageBody" className="message textMargins"> By approving this letter of credit you are sending it over to Bob's bank: The Central Bank of Belgium. Do you still want to send it?</p>
            <div id="buttonRow" className="buttonRow textMargins">
              <button className="button" onClick={() => this.handleClick()}> Yes, send it over </button>
              <button className="button" onClick={() => this.handleClick()}> No, I'd like to continue reviewing </button>
            </div>
          </div>
        </div>
      );
  	}
  }
}

export default Modal;
