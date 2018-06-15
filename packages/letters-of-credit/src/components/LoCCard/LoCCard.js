import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import Config from '../../utils/config';
import '../../stylesheets/css/main.css';
import axios from 'axios';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import Modal from '../Modal/Modal.js';
import viewArrow from '../../resources/images/right-arrow.svg'

class LoCCard extends Component {
  constructor(props) {
		super(props);
		this.state = {
      redirect: false,
      showModal: false,
      toggleChecked: false,
      toggleDisabled: false
		}

    this.handleOnClick = this.handleOnClick.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.config = new Config();
	}

  handleOnClick() {
    this.props.callback(this.props.letter, false);
    this.setState({redirect: true});
  }

  showModal() {
    this.setState({
      showModal: true
    });
  }

  hideModal() {
    this.setState({
      showModal: false
    });
  }

  shipProduct(letterId, evidenceHash) {
    let letter = "resource:org.example.loc.LetterOfCredit#" + letterId;
    axios.post(this.config.restServer.httpURL+'/ShipProduct', {
      "$class": "org.example.loc.ShipProduct",
      "loc": letter,
      "evidence": evidenceHash,
      "transactionId": "",
      "timestamp": "2018-03-13T11:25:08.043Z" // the transactions seem to need this field filled in; when submitted the correct time will replace this value
    })
    .catch(error => {
      console.log(error);
    });
    this.setState({
      toggleDisabled: true
    });
  }

  receiveProduct(letterId) {
    let letter = "resource:org.example.loc.LetterOfCredit#" + letterId;
    axios.post(this.config.restServer.httpURL+'/ReceiveProduct', {
      "$class": "org.example.loc.ReceiveProduct",
      "loc": letter,
      "transactionId": "",
      "timestamp": "2018-03-13T11:25:08.043Z" // the transactions seem to need this field filled in; when submitted the correct time will replace this value
    })
    .catch(error => {
      console.log(error);
    });
    this.setState({
      toggleDisabled: true
    });
  }

  generateStatus(letter) {
    let status = '';
    if (letter.status === 'AWAITING_APPROVAL') {
      status = 'Awaiting Approval';
    } else if (letter.status === 'READY_FOR_PAYMENT'){
      status = 'Payment Made';
    }
    else {
      status = letter.status.toUpperCase();
    }
    return status.toUpperCase();
  }

  generateBobCardContents(letter) {
    let contents = <div/>;
    let status = (letter.approval.includes('resource:org.example.loc.Customer#bob')) ? this.generateStatus(letter) : 'NEW';
    
    if (letter.status === 'AWAITING_APPROVAL') {
      contents = (
        <div className = "LoCCardBob">
          <div>
            <h2>{status}</h2>
            <h2>{'Ref: ' + letter.letterId}</h2>
            <p>Product Type: <b>{letter.productDetails.productType}</b></p>
            <div className = "toggleContainer hide">
              <Toggle className='customToggle' defaultChecked={false} disabled/>
              <span className="shipText">Ship Product</span>
            </div>
          </div>
          <img class="viewButtonBob" src={viewArrow} alt="View Letter of Credit" onClick={() => this.handleOnClick()}/>
        </div>
      );
    } else {
      let checked = letter.status !== 'APPROVED';
      let idStyle = checked ? "LoCCardBobAccepted" : ""
      let hash = new Date().getTime().toString(24);
      contents = (
        <div className="LoCCardBob" id={idStyle}>
          <Modal show={this.state.showModal} modalType={'SHIP'} cancelCallback={this.hideModal} yesCallback={() => this.shipProduct(letter.letterId, hash)}/>
          <div>
            <h2>{status}</h2>
            <h2>{'Ref: ' + letter.letterId}</h2>
            <p>Product Type: <b>{letter.productDetails.productType}</b></p>
            <div className="toggleContainer">
            <Toggle className='customToggle' checked={checked} defaultChecked={false} disabled={checked} onChange={this.showModal}  />
              <span className="shipText">Ship Product</span>
            </div>
          </div>
          <img className="viewButtonBob" src={viewArrow} alt="View Letter of Credit" onClick={() => this.handleOnClick()}/>
        </div>
      );
    } 
    return contents;
  }

  generateAliceCardContents(letter) {
    let contents = <div/>;
    if (letter.status === 'AWAITING_APPROVAL' || letter.status === 'APPROVED') {
      contents = (
        <div className = "LoCCard">
          <div>
            <h2>{this.generateStatus(letter)}</h2>
            <h2>{'Ref: ' + letter.letterId}</h2>
            <p>Product Type: <b>{letter.productDetails.productType}</b></p>
            <div className = "toggleContainer hide">
                <Toggle className='customToggle customToggleAlice' defaultChecked={false} icons={false} disabled/>
                <span className="shipText">Receive Product</span>
            </div>
            <button className="viewButton" onClick={() => this.handleOnClick()}>
              <p className="buttonText"><span>View Letter Of Credit</span></p>
            </button>
          </div>
        </div>
      );
    } else {
      if (letter.status !== 'AWAITING_APPROVAL' && letter.status !== 'APPROVED' && letter.status !== 'REJECTED') {
        let shippingText = letter.status !== 'SHIPPED' ? "Receive Product" : "Product Received";
        let checked = letter.status !== 'SHIPPED' ? true : false;
        contents = (
          <div className = "LoCCard">
            <div>
              <h2>{this.generateStatus(letter)}</h2>
              <h2>{'Ref: ' + letter.letterId}</h2>
              <p>Product Type: <b>{letter.productDetails.productType}</b></p>
              <div className = "toggleContainer">
                <Toggle className='customToggle customToggleAlice' defaultChecked={checked} disabled={checked} icons={false} onChange={() => {this.receiveProduct(letter.letterId)}}/>
                <span className="shipText">{shippingText}</span>
              </div>
              <button className="viewButton" onClick={() => this.handleOnClick()}>
                <p className="buttonText"><span>View Letter Of Credit</span></p>
              </button>
            </div>
          </div>
        );
      }
    } 
    return contents;
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={"/" + this.props.user + "/loc/" + this.props.letter.letterId} />;
    }
    return (this.props.user === 'alice') ? this.generateAliceCardContents(this.props.letter) : this.generateBobCardContents(this.props.letter);
  }
}

export default LoCCard;
