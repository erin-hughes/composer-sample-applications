import React, { Component } from 'react';
import '../../stylesheets/css/main.css';
import { Redirect } from 'react-router-dom';
import DetailsCard from '../DetailsCard/DetailsCard.js';
import BlockChainDisplay from '../BlockChainDisplay/BlockChainDisplay.js';
import axios from 'axios';
import { connect } from "react-redux";
import Config from '../../utils/config';
import backButtonIcon from '../../resources/images/left-arrow.svg'
import Stepper from 'react-stepper-horizontal';
import Modal from '../../components/Modal/Modal.js'

class LetterOfCredit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.match.params.name,
      transactions: [],
      disableButtons: false,
      redirect: false,
      redirectTo: '',
      showModal: false
    }
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.config = new Config();
	}

  handleOnClick(user) {
    this.props.callback(user);
    this.setState({redirect: true, redirectTo: user});
  }

  componentWillMount() {
    axios.get(this.config.httpURL+'/system/historian')
    .then((response) => {
      let relevantTransactions = [];
      let transactionTypes = ["InitialApplication", "Approve", "Reject", "ShipProduct", "ReceiveProduct", "ReadyForPayment", "Close"];
      response.data.forEach((i) => {
        let transactionLetter = ((i.eventsEmitted.length) ? decodeURIComponent(i.eventsEmitted[0].loc.split("#")[1]) : undefined);
        let longName = i.transactionType.split(".")
        let name = longName[longName.length - 1];

        if(transactionTypes.includes(name) && this.props.letter.letterId === transactionLetter) {
          relevantTransactions.push(i);
        }
      });
      relevantTransactions.sort((a,b) => {
        // creating a new date object to account for daylight savings
        a.transactionTimestamp = new Date(a.transactionTimestamp);
        b.transactionTimestamp = new Date(b.transactionTimestamp);
        return a.transactionTimestamp - b.transactionTimestamp;
      });

      this.setState ({
        transactions: relevantTransactions
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  showModal(tx) {
    // work out what transaction will be made if the yes button is clicked
    const txTypes = {
      CREATE: "CREATE",
      APPROVE: "APPROVE",
      REJECT: "REJECT",
      PAY: "PAY",
      CLOSE: "CLOSE"
    }

    let callback;
    if (tx === 'CREATE') {
      callback = () => {
        this.hideModal();
        this.createLOC(this.props.productDetails.type, this.props.productDetails.quantity, this.props.productDetails.pricePerUnit, this.props.rules)
      };
    } else if (tx === txTypes.APPROVE) {
      callback = () => {
        this.hideModal();
        this.approveLOC(this.props.letter.letterId, this.state.user)
      };
    } else if (tx === txTypes.REJECT) {
      callback = () => {
        this.hideModal();
        this.rejectLOC(this.props.letter.letterId)
      }
    } else if (tx === txTypes.PAY) {
      callback = () => {
        this.hideModal();
        this.payLOC(this.props.letter.letterId)
      }
    } else {
      callback = () => {
        this.hideModal();
        this.closeLOC(this.props.letter.letterId)
      }
    }

    this.setState({
      showModal: true,
      modalType: tx,
      modalFunction: callback
    });
  }

  hideModal() {
    this.setState({
      showModal: false
    });
  }

  createRules() {
    let rules = [];
    let ruleIndex = 1;
    this.props.rules.map((i) => {
      if (i.ruleText !== "") {
        rules.push({
          "$class": "org.acme.loc.Rule",
          "ruleId": "rule"+ruleIndex,
          "ruleText": i.ruleText
        });
      ruleIndex++;
      }
    });
    return rules;
  }

  createLOC(type, quantity, price, rules) {
    this.setState({
      disableButtons: true
    });
    let currentTime = new Date().toLocaleTimeString().split(":").join('');
    axios.post(this.config.httpURL+'/InitialApplication', {
      "$class": "org.acme.loc.InitialApplication",
      "letterId": ("L" + currentTime),
      "applicant": "resource:org.acme.loc.Customer#alice",
      "beneficiary": "resource:org.acme.loc.Customer#bob",
      "rules": this.createRules(),
      "productDetails": {
        "$class": "org.acme.loc.ProductDetails",
        "productType": type,
        "quantity": quantity,
        "pricePerUnit": price.toFixed(2),
        "id": "string"
      },
      "transactionId": "",
      "timestamp": "2018-03-13T11:35:00.218Z" // the transactions seem to need this field filled in; when submitted the correct time will replace this value
    })
    .then(() => {
      let letter = "resource:org.acme.loc.LetterOfCredit#" + ("L" + currentTime);
      return axios.post(this.config.httpURL+'/Approve', {
        "$class": "org.acme.loc.Approve",
        "loc": letter,
        "approvingParty": this.state.user,
        "transactionId": "",
        "timestamp": "2018-03-13T11:25:08.043Z" // the transactions seem to need this field filled in; when submitted the correct time will replace this value
      });
    })
    .then(() => {
      this.setState({
        disableButtons: false
      })
      this.handleOnClick(this.state.user);
    })
    .catch(error => {
      console.log(error);
    });
  }

  approveLOC(letterId, approvingParty) {
    if(!this.props.letter.approval.includes(this.state.user)) {
      this.setState({
        disableButtons: true
      });
      let letter = "resource:org.acme.loc.LetterOfCredit#" + letterId;
      axios.post(this.config.httpURL+'/Approve', {
        "$class": "org.acme.loc.Approve",
        "loc": letter,
        "approvingParty": approvingParty,
        "transactionId": "",
        "timestamp": "2018-03-13T11:25:08.043Z" // the transactions seem to need this field filled in; when submitted the correct time will replace this value
      })
      .then(() => {
        this.setState({
          disableButtons: false
        });
        this.handleOnClick(this.state.user);
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
    let letter = "resource:org.acme.loc.LetterOfCredit#" + letterId;
    axios.post(this.config.httpURL+'/Reject', {
      "$class": "org.acme.loc.Reject",
      "loc": letter,
      "closeReason": "Letter has been rejected",
      "transactionId": "",
      "timestamp": "2018-03-13T11:35:00.281Z" // the transactions seem to need this field filled in; when submitted the correct time will replace this value
    })
    .then(() => {
      this.setState({
        disableButtons: false
      });
      this.handleOnClick(this.state.user);
    })
    .catch(error => {
      console.log(error);
    });
  }

  payLOC(letterId) {
    this.setState({
      disableButtons: true
    });
    let letter = "resource:org.acme.loc.LetterOfCredit#" + letterId;
    axios.post(this.config.httpURL+'/ReadyForPayment', {
      "$class" : "org.acme.loc.ReadyForPayment",
      "loc": letter,
      'beneficiary': "resource:org.acme.loc.Customer#bob",
      "transactionId": "",
      "timestamp": "2018-03-13T11:35:00.281Z" // the transactions seem to need this field filled in; when submitted the correct time will replace this value
    })
    .then(() => {
      this.setState({
        disableButtons: false
      });
      this.handleOnClick(this.state.user);
    })
    .catch(error => {
      console.log(error);
    });
  }

  closeLOC(letterId) {
    this.setState({
      disableButtons: true
    });
    let letter = "resource:org.acme.loc.LetterOfCredit#" + letterId;
    axios.post(this.config.httpURL+'/Close', {
      "$class": "org.acme.loc.Close",
      "loc": letter,
      "closeReason": "Letter has been completed.",
      "transactionId": "",
      "timestamp": "2018-03-13T11:35:00.139Z" // the transactions seem to need this field filled in; when submitted the correct time will replace this value
    })
    .then(() => {
      this.setState({
        disableButtons: false
      });
      this.handleOnClick(this.state.user);
    })
    .catch(error => {
      console.log(error);
    })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={"/" + this.state.redirectTo} />;
    }

    let activeStep = 0;

    if (this.props.letter.status === 'AWAITING_APPROVAL') {
      if (!this.props.letter.approval.includes('matias')) {
        activeStep = 1;
      }
      else if (!this.props.letter.approval.includes('ella')) {
        activeStep = 2;
      }
      else if (!this.props.letter.approval.includes('bob')) {
        activeStep = 3;
      }
    }
    else if (this.props.letter.status === 'APPROVED' ||
             this.props.letter.status === 'SHIPPED' ||
             this.props.letter.status === 'RECEIVED' ||
             this.props.letter.status === 'CLOSED') {
      activeStep = 4;
    }

    let productDetails = this.props.productDetails;
    let rules = this.props.rules;
    let buttonJSX = (<div/>);
    if (!this.props.isApply) {
      productDetails = {
        type: this.props.letter.productDetails.productType,
        quantity: this.props.letter.productDetails.quantity,
        pricePerUnit: this.props.letter.productDetails.pricePerUnit
      };
      rules = this.props.letter.rules;
      if (this.props.letter.status === 'AWAITING_APPROVAL' && !this.props.letter.approval.includes(this.state.user)) {
        buttonJSX = (
          <div class="actions">
            <button disabled={this.state.disableButtons} onClick={() => {this.showModal('REJECT')}}>I reject the application</button>
            <button disabled={this.state.disableButtons} onClick={() => {this.showModal('APPROVE')}}>I accept the application</button>
          </div>
        );
      } else if (this.props.letter.status === 'RECEIVED' && this.state.user === 'matias') {
        buttonJSX = (
          <div class="actions">
            <button disabled={this.state.disableButtons} onClick={() => {this.showModal('PAY')}}>Ready for Payment</button>
          </div>
        );
      } else if (this.props.letter.status === 'READY_FOR_PAYMENT' && this.state.user === 'ella') {
        buttonJSX = (
          <div class="actions">
            <button disabled={this.state.disableButtons} onClick={() => {this.showModal('CLOSE')}}>Close this Letter of Credit</button>
          </div>
        );
      } else {
        buttonJSX = (<div/>);
      }
    } else {
      buttonJSX = (
        <div class="actions">
          <button disabled={this.state.disableButtons} onClick={() => {this.showModal('CREATE')}}>Start approval process</button>
        </div>
      );
    }

    return (
      <div class="LCcontainer">
        <Modal show={this.state.showModal} modalType={this.state.modalType} cancelCallback={()=>{this.hideModal()}} yesCallback={this.state.modalFunction}/>
        <div class="LCHeader">
          <div>
            <img class="backButton" src={backButtonIcon} alt="go back" onClick={() => {if(!this.state.disableButtons){this.handleOnClick(this.state.user)}}}/>
          </div>
          <p class="loc-text">Letter of Credit</p>
          <p class="username-txt">{(this.state.user.charAt(3) === 'i') ? 'Matías' : this.state.user.charAt(0).toUpperCase() + this.state.user.slice(1)}</p>
        </div>
        <div class="header">
          <div class="stepper">
            <Stepper steps={ [{title: 'Letter Application'}, {title: 'PB\'s Approval'}, {title: 'BoH\'s Approval'}, {title: 'Bob\'s Approval'}, {title: 'Letter Closed'}] } activeStep={activeStep} circleFontSize={12} titleFontSize={12} completeColor={"#4880ff"} activeColor={"#4880ff"} completeBarColor={"#4880ff"} size={24}/>
          </div>
        </div>
        <div class="letterContent">
          <DetailsCard disabled={true} type="Person" data={["Application Request"].concat(Object.values(this.props.applicant))}/>
          <DetailsCard disabled={true} type="Person" data={["Supplier Request"].concat(Object.values(this.props.beneficiary))}/>
          <DetailsCard type="Product" data={["Product Details"].concat(Object.values(productDetails))} canEdit={this.props.isApply} user={this.state.user}/>
        </div>
        <br/>
        <div class="rules">
          <DetailsCard type="Rules" data={rules} canEdit={this.props.isApply}/>
        </div>
        <BlockChainDisplay transactions={this.state.transactions}/>
        {buttonJSX}
        { this.state.disableButtons && <div class="statusMessage"> Please wait... </div> }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    applicant: state.getLetterInputReducer.applicant,
    beneficiary: state.getLetterInputReducer.beneficiary,
    productDetails: state.getLetterInputReducer.productDetails,
    rules: state.getLetterInputReducer.rules
  };
};

export default connect(mapStateToProps)(LetterOfCredit);