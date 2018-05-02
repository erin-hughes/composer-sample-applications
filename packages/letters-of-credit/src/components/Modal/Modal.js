import React, { Component } from 'react';
import '../../stylesheets/css/main.css';

class Modal extends Component {

  getMessage() {
    let message = "";
    if (this.props.modalType === 'CREATE' || this.props.modalType === 'APPROVE') {
      message = "By clicking 'Yes' you are agreeing to the Terms and Conditions of this Letter of Credit. The letter will now be sent to the next participant for approval."  
    } else if (this.props.modalType === 'REJECT') {
      message = "By clicking 'Yes' you are rejecting this application and the Letter of Credit will be closed. Once rejected, you will be unable to reopen this Letter of Credit."
    } else if (this.props.modalType === 'PAY') {
      message = "By clicking 'Yes' you are agreeing that the applicant has received the goods in good condition, and you are willing to transfer the payment to the exporting bank.";
    } else {
      message = "By clicking 'Yes' you are agreeing that the Terms and Conditions of this Letter of Credit have been met, and that the payment has been made to the beneficiary.";
    }

    return message;
  }

  render() {
    if(this.props.show) {
      let message = this.getMessage();
      return (
      	<div id="modalBackground" className="background">
          <div id="modalContainer" className="container">
            <h4 id="titleText" className="textMargins title">Are you sure you want to {this.props.modalType.toLowerCase()} this letter?</h4>
            <p id="messageBody" className="textMargins message">{message}</p>
            <div id="buttonRow" className="textMargins">
              <button className="cancelButton" onClick={this.props.cancelCallback}>Cancel</button>
              <button className="yesButton" onClick={this.props.yesCallback}>Yes</button>
            </div>
          </div>
        </div>
      );
    }
    else {
      return (<div />);
  	}
  }
}

export default Modal;
