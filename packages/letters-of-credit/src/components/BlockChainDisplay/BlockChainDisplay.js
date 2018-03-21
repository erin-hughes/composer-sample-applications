import React from 'react';
import './blockchaindisplay.css';
import Block from '../../components/Block/Block.js';
import axios from 'axios';

class BlockChainDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: []
    }
  }

  componentWillMount() {
		axios.get('http://localhost:3000/api/system/historian')
		.then(response => {
      this.setState ({
        transactions: response.data
      });
		})
		.catch(error => {
			console.log(error);
		});
	}

  render() {
    let relevantTransactions = ["InitialApplication", "RejectApplication", "SuggestChanges", "ApproveApplication"];
    let blocks = [];
    let transactionCount = 1;
    for (var i = this.state.transactions.length-1; i >= 0; i--){
      let transaction = this.state.transactions[i];
      if(transaction!== undefined){
        let transactionDescription = transaction.transactionType.split(".");
        let transactionName = transactionDescription[transactionDescription.length-1];
        if (relevantTransactions.includes(transactionName)){
          let blockNumber = ("0" + transactionCount).slice(-2);
          let dateTime = transaction.transactionTimestamp.split("T");
          let time = dateTime[0];
          let date = dateTime[1].split(".")[0];
          blocks.push(<Block transactionDetails = {transactionName} date = {date} time = {time} number = {blockNumber}/>);
          transactionCount++;
        }
      }
    }
    return (
        <div className="BlockChainDisplay">
          {blocks}
          <div className="greyBlock">
            <div className="greyBlockNumber">9</div>
            <div className="greyBlockLine"/>
          </div>
        </div>
    )
  }
}

export default BlockChainDisplay;
