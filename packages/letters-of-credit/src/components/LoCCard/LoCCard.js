import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import Config from '../../utils/config';
import '../../stylesheets/css/main.css';
import axios from 'axios';
import viewButtonIconAlice from '../../resources/images/viewLocIcon.png';
import viewButtonIconBob from '../../resources/images/viewLocIconBob.png';

class LoCCard extends Component {
  constructor(props) {
		super(props);
		this.state = {
      redirect: false
		}
    this.handleOnClick = this.handleOnClick.bind(this);
    this.config = new Config();
	}

  handleOnClick() {
    this.props.callback(this.props.letter, false);
    this.setState({redirect: true});
  }

  shipProduct(letterId, evidenceHash) {
    let letter = "resource:org.acme.loc.LetterOfCredit#" + letterId;
    axios.post(this.config.httpURL+'/ShipProduct', {
      "$class": "org.acme.loc.ShipProduct",
      "loc": letter,
      "evidence": evidenceHash,
      "transactionId": "",
      "timestamp": "2018-03-13T11:25:08.043Z" // the transactions seem to need this field filled in; when submitted the correct time will replace this value
    })
    .catch(error => {
      console.log(error);
    });
  }

  receiveProduct(letterId) {
    let letter = "resource:org.acme.loc.LetterOfCredit#" + letterId;
    axios.post(this.config.httpURL+'/ReceiveProduct', {
      "$class": "org.acme.loc.ReceiveProduct",
      "loc": letter,
      "transactionId": "",
      "timestamp": "2018-03-13T11:25:08.043Z" // the transactions seem to need this field filled in; when submitted the correct time will replace this value
    })
    .catch(error => {
      console.log(error);
    });
  }

  generateCardContents(letter, user) {
    let contents;
    let newMessage = "";
    if(!this.props.letter.approval.includes("bob")){
      newMessage = "NEW";
    }
    //generate new LoC cards
    if (user === 'bob') {
      contents = (
        <div className = "LoCCardBob">
          <div>
            <h3>{newMessage}</h3>
            <h3>{'Ref: ' + letter.letterId}</h3>
            Participants: <b>{'Alice, ' + letter.issuingBank + ', Bob, ' + letter.exportingBank}</b><br/><br/>
            Product Type: <b>{letter.productDetails.productType}</b>
            <div>
              <img class="viewButtonBob" src={viewButtonIconBob} alt="View Letter of Credit" onClick={() => this.handleOnClick()}/>
            </div>
          </div>
        </div>
      );
    }
    else { // if the current user is not bob then it must be alice
      contents = (
        <div className = "LoCCard">
          <div>
            <h3>{'Ref: ' + letter.letterId}</h3>
            Participants: <b>{'Alice, ' + letter.issuingBank + ', Bob, ' + letter.exportingBank}</b><br/><br/>
            Product Type: <b>{letter.productDetails.productType}</b><p></p>
            <button className="viewButton" onClick={() => this.handleOnClick()}>
              <div className = "viewButtonImage">
                <img src = {viewButtonIconAlice} alt = ""/>
              </div>
              <p>View Letter Of Credit</p>
            </button>
          </div>
        </div>
      );
    }

    //generate accepted LoC cards
    if (user === 'bob') {
      if (letter.status === 'APPROVED' || letter.status === 'SHIPPED' || letter.status === 'RECEIVED') {
        // generating a hash from the timestamp
        let idStyle;
        if (letter.status === 'SHIPPED'){
          idStyle = "LoCCardBobAccepted";
        }
        let hash = new Date().getTime().toString(24);
        contents = (
          <div className = "LoCCardBob" id= {idStyle}>
            <div>
              <h3>{'Ref: ' + letter.letterId}</h3>
              <p>{'Ship this product'}</p>
              <p>{'Product Type: ' + letter.productDetails.productType}</p>
              <div className="shipButtonDiv">
                <button className="shipButton" onClick={() => {this.shipProduct(letter.letterId, hash)}} disabled={(letter.status === 'APPROVED') ? false : true}>✓</button>
                <span className="shipText">{'Ship Order'}</span>
              </div>
              <div>
                <img class="viewButtonBob" src={viewButtonIconBob} alt="View Letter of Credit" onClick={() => this.handleOnClick()}/>
              </div>
            </div>
          </div>
        );
      }
    } else {
      if (letter.status !== 'AWAITING_APPROVAL') {
        // generating a hash from the timestamp
        let hash = new Date().getTime().toString(24);
        contents = (
          <div className = "LoCCard">
            <div>
              <h3>{'Ref: ' + letter.letterId}</h3>
              <p>{'This product is ready to be accepted'}</p>
              <p>{'Product Type: ' + letter.productDetails.productType}</p>
              <div className="shipButtonDiv">
                <button className="acceptButton" onClick={() => {this.receiveProduct(letter.letterId)}} disabled={(letter.status === 'SHIPPED') ? false : true}>✓</button>
                <span className="shipText">{'Accept Order'}</span>
              </div>
              <button className="viewButton" onClick={() => this.handleOnClick()}>
                <div className = "viewButtonImage">
                  <img src = {viewButtonIconAlice} alt = ""/>
                </div>
                <p>View Letter Of Credit</p>
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
      return <Redirect push to={this.props.user + "/loc"} />;
    }
    let LoCCardStyle = (this.props.user == 'bob') ? "LoCCardBob" : "LoCCard";
    return (
        this.generateCardContents(this.props.letter, this.props.user)
    );
  }
}

export default LoCCard;
