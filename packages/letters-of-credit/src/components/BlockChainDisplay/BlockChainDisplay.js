import React from 'react';
import '../../stylesheets/css/main.css';
import Block from '../../components/Block/Block.js';
import axios from 'axios';

class BlockChainDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: []
    }
  }

  addLeadingZero(number) {
    return (number < 10) ? "0" + number : number;
  }

  render() {
    let transactions = this.props.transactions;
    let blocks = [];
    if(transactions.length) {
      for (let i = transactions.length; i > 0; i--) {
        let name = transactions[i-1].transactionType.split(".")[3];
        let blockNumber = this.addLeadingZero(i);
        let dateTime = transactions[i-1].transactionTimestamp;
        let date = dateTime.getFullYear() + '-' + this.addLeadingZero(dateTime.getMonth()+1) + '-' + this.addLeadingZero(dateTime.getDate());
        let time = dateTime.toTimeString().split(' ')[0];
        blocks.push(<Block transactionDetails={name} date={date} time={time} number={blockNumber}/>);

      }
    }

    return (
        <div className="BlockChainDisplay">
          <div className="greyBlock">
            <div className="greyBlockNumber">x</div>
            <div className="greyBlockLine"/>
          </div>
          {blocks}
        </div>
    );
  }
}

export default BlockChainDisplay;