import React, {Component} from 'react';
import './loccard.css';

class LoCCard extends Component {
  render() {
    let referenceNumberText = 'Ref: ' + this.props.letter.letterId;
    let participantsText = 'Participants: Alice, ' + this.props.letter.issuingBank + ', Bob, ' + this.props.letter.confirmingBank;
    let productsText = 'Product Type: ' + this.props.letter.productDetails.productType;
    return (
      <div className="LoCCard">
        <h3>{referenceNumberText}</h3>
        <p>{participantsText}</p>
        <p>{productsText}</p>
        <button className="viewButton" onClick={() => this.props.callback(this.props.letter, false)}>View Letter Of Credit</button>
      </div>
    );
  }
}

export default LoCCard;
