import React, { Component } from 'react';
import './letterofcredit.css';
import DetailsCard from '../DetailsCard/DetailsCard.js';
import BlockChainDisplay from '../BlockChainDisplay/BlockChainDisplay.js';
import axios from 'axios';
import { connect } from "react-redux";

import backButtonIcon from '../../resources/images/left-arrow.svg'

class LetterOfCredit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableButtons: false
    }
  }

  createLOC(type, quantity, price, rules) {
    this.setState({
      disableButtons: true
    });
    let letterId = this.generateLetterId();
    axios.post('http://localhost:3000/api/InitialApplication', {
      "$class": "org.acme.loc.InitialApplication",
      "letterId": letterId,
      "applicant": "resource:org.acme.loc.Customer#alice",
      "beneficiary": "resource:org.acme.loc.Customer#bob",
      "rules": rules,
      "productDetails": {
        "$class": "org.acme.loc.ProductDetails",
        "productType": type,
        "quantity": quantity,
        "pricePerUnit": price,
        "id": "string"
      },
      "transactionId": "",
      "timestamp": "2018-03-13T11:35:00.218Z"
    })
    .then(() => {
      let letter = "resource:org.acme.loc.LetterOfCredit#" + letterId;
      return axios.post('http://localhost:3000/api/ApproveApplication', {
        "$class": "org.acme.loc.ApproveApplication",
        "loc": letter,
        "approvingParty": this.props.user,
        "transactionId": "",
        "timestamp": "2018-03-13T11:25:08.043Z"
      });
    })
    .then(() => {
      this.setState({
        disableButtons: false
      })
      this.props.callback(this.props.user);
    })
    .catch(error => {
      console.log(error);
    });
  }

  approveLOC(letterId, approvingParty) {
    if(!this.props.letter.approval.includes(this.props.user)) {
      this.setState({
        disableButtons: true
      });
      let letter = "resource:org.acme.loc.LetterOfCredit#" + letterId
      axios.post('http://localhost:3000/api/ApproveApplication', {
        "$class": "org.acme.loc.ApproveApplication",
        "loc": letter,
        "approvingParty": approvingParty,
        "transactionId": "",
        "timestamp": "2018-03-13T11:25:08.043Z"
      })
      .then(() => {
        this.setState({
          disableButtons: false
        });
        this.props.callback(this.props.user);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  rejectLOC(letterId) {
    this.setState({
      disableButtons: true
    });
    let letter = "resource:org.acme.loc.LetterOfCredit#" + letterId
    axios.post('http://localhost:3000/api/RejectApplication', {
      "$class": "org.acme.loc.RejectApplication",
      "loc": letter,
      "closeReason": "Letter has been rejected",
      "transactionId": "",
      "timestamp": "2018-03-13T11:35:00.281Z"
    })
    .then(() => {
      this.setState({
        disableButtons: false
      });
      this.props.callback(this.props.user);
    })
    .catch(error => {
      console.log(error);
    });
  }

  closeLOC(letterId) {
    this.setState({
      disableButtons: true
    });
    let letter = "resource:org.acme.loc.LetterOfCredit#" + letterId
    axios.post('http://localhost:3000/api/Close', {
      "$class": "org.acme.loc.Close",
      "loc": letter,
      "closeReason": "Letter has been completed.",
      "transactionId": "",
      "timestamp": "2018-03-13T11:35:00.139Z"
    })
    .then(() => {
      this.setState({
        disableButtons: false
      });
      this.props.callback(this.props.user);
    })
    .catch(error => {
      console.log(error);
    })
  }

  generateLetterId() {
    let id = "L" + Math.floor((Math.random() * 8999) + 1000);
    console.log(id);
    return id;
  }

  render() {
    let productDetails = this.props.productDetails;
    let buttonsJSX = (<div/>);
    if(!this.props.isApply) {
      productDetails = {
        type: this.props.letter.productDetails.productType,
        quantity: this.props.letter.productDetails.quantity,
        pricePerUnit: this.props.letter.productDetails.pricePerUnit
      }
      if(this.props.letter.status === 'APPROVED') {
        buttonsJSX = (
          <div class="actions">
            <button disabled={this.state.disableButtons} onClick={() => this.closeLOC(this.props.letter.letterId)}>Close this Letter of Credit</button>
          </div>
        )
      } else {
        buttonsJSX = (
          <div class="actions">
            <button disabled={this.state.disableButtons} onClick={() => {this.approveLOC(this.props.letter.letterId, this.props.user)}}>I accept the application</button>
            <button disabled={this.state.disableButtons} onClick={() => {this.rejectLOC(this.props.letter.letterId)}}>I reject the application</button>
          </div>
        );
      }
    } else {
      buttonsJSX = (
        <div class="actions">
          <button disabled={this.state.disableButtons} onClick={() => this.createLOC(this.props.productDetails.type, this.props.productDetails.quantity, this.props.productDetails.pricePerUnit, this.props.rules)}>Start approval process</button>
        </div>
      );
    }

    return (
      <div class="LCcontainer">
        <img class="backButton" src={backButtonIcon} alt="image not found" onClick={() => {if(!this.state.disableButtons){this.props.callback(this.props.user)}}}/>
        <div class="header">
          <div class="letterDetails">
            <h2>{this.props.letter.letterId}</h2>
            <h2>User logged in: {this.props.user}</h2>
            <p>{this.props.date}</p>
          </div>
        </div>
        <div class="letterContent">
          <DetailsCard type="Person" data={["Application Request"].concat(Object.values(this.props.applicant))}/>
          <DetailsCard type="Person" data={["Supplier Request"].concat(Object.values(this.props.beneficiary))}/>
          <DetailsCard type="Product" data={["Product Details"].concat(Object.values(productDetails))}/>
        </div>
        <br/>
        <div class="rules">
            <DetailsCard type="Rules" data={["The product has been received and is as expected"]}/>
        </div>
        {buttonsJSX}
        { this.state.disableButtons && <div class="statusMessage"> Please wait... </div> }
        <div class="blockChainContainer">
          <BlockChainDisplay/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { productDetails: state.getLetterInputReducer.productDetails, rules: state.getLetterInputReducer.rules };
};

export default connect(mapStateToProps)(LetterOfCredit);
