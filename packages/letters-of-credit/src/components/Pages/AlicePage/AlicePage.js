import React, { Component } from 'react';
import './alicepage.css';
import axios from 'axios';
import UserDetails from '../../UserDetails/UserDetails.js';
import Alert from '../../Alert/Alert.js';
import LoCCard from '../../LoCCard/LoCCard.js';
import LoCApplyCard from '../../LoCCard/LoCApplyCard.js';

class AlicePage extends Component {
  constructor(props) {
		super(props)
		this.state = {
			userDetails: {},
			letters: [],
			switchUser: this.props.switchUser,
			callback: this.props.callback
		}
	}

	componentDidMount() {
		let cURL = 'http://localhost:3000/api/Customer/' + this.props.user;
		axios.get(cURL)
		.then(response => {
			this.setState ({
				userDetails: response.data
      });
		})
		.catch(error => {
			console.log(error);
		});
    axios.get('http://localhost:3000/api/LetterOfCredit')
    .then(response => {
      this.setState ({
        letters: response.data
      });
		})
		.catch(error => {
			console.log(error);
		});
	}

	generateCard(i) {
		return (
      <LoCCard letter={this.state.letters[i]} callback={this.state.callback} pageType={"view"}/>
    );
  }

  render() {
		if(this.state.userDetails.name) {
			let username = this.state.userDetails.name + ", Customer of " + this.state.userDetails.bankName;

    	let cardsJSX = [];
    	if(this.state.letters.length) {
				for(let i = 0; i < this.state.letters.length; i++) {
					cardsJSX.push(this.generateCard(i));
				}
			}

			return (
    		<div id="alicePageContainer" className="alicePageContainer">
    		  <div id="aliceHeaderDiv" className="flexDiv aliceHeaderDiv">
    		    <span className="aliceUsername" onClick={() => {this.state.switchUser('matias')}}> {username} </span>
						<span className="aliceUsername" onClick={() => {this.state.switchUser('bob')}}> Go to Bob </span>
    		    <div id="aliceMenu" className="aliceMenuItems">
    		      <span> Change account details </span>
    		      <span> View Transaction History </span>
    		      <span> Make Transaction </span>
    		      <span> Current Balance: £15,670 </span>
    		    </div>
    		  </div>
    		  <div id="infoDiv" className="flexDiv infoDiv">
    		    <div id="aliceWelcomeDiv" className="aliceWelcomeDiv">
    		      <h1> Welcome back {this.state.userDetails.name} </h1>
    		      <UserDetails name={this.state.userDetails.name} companyName={this.state.userDetails.companyName} sortCode={'12-34-57'} accountNumber={'54564351'}/>
						</div>
						<div id="alertsDiv" className="alertsDiv">
							<Alert alertType={"Alert when:"} alertMessage={"my account balance falls below £15000"}/>
							<Alert alertType={"Weekly Alert:"} alertMessage={"with most recent transactions"}/>
						</div>
					</div>
    		  <div className="locDiv">
    		    <LoCApplyCard callback={this.state.callback} />
						{cardsJSX}
    		  </div>
				</div>
			);
  	} else {
			return (
			<div id="aliceLoadingContainer" className="alicePageContainer">
				<span className="loadingSpan">Loading...</span>
			</div>
			);
		}
	}
}

export default AlicePage;
