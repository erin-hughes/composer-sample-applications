import React, { Component } from 'react';
import '../../../stylesheets/css/main.css';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import UserDetails from '../../UserDetails/UserDetails.js';
import LoCCard from '../../LoCCard/LoCCard.js';
import LoCApplyCard from '../../LoCCard/LoCApplyCard.js';
import Config from '../../../utils/config';

class BobPage extends Component {
  constructor(props) {
		super(props);
		this.state = {
			userDetails: {},
			letters: [],
			gettingLetters: false,
			switchUser: this.props.switchUser,
			callback: this.props.callback,
      redirect: false,
      redirectTo: ''
		}
		this.handleOnClick = this.handleOnClick.bind(this);
		this.config = new Config();
	}

  handleOnClick(user) {
    this.state.switchUser(user);
    this.setState({redirect: true, redirectTo: user});
  }

	componentDidMount() {
		// open a websocket
		this.connection = new WebSocket(this.config.webSocketURL);
		this.connection.onmessage = ((evt) => {
				this.getLetters();
		});

		// make rest calls
		this.getUserInfo();
		this.getLetters();
	}

	componentWillUnmount() {
		this.connection.close();
	}

	getUserInfo() {
		let userDetails = {};
		let cURL = this.config.httpURL+'/Customer/bob';
		axios.get(cURL)
		.then(response => {
			userDetails = response.data;
		})
		.then(() => {
			let bankURL = this.config.httpURL+'/Bank/'+userDetails.bank.split('#')[1];
			return axios.get(bankURL)
		})
		.then(response => {
			userDetails.bank = response.data.name;
			this.setState ({
				userDetails: userDetails
			});
		})
	}

	getLetters() {
		this.setState({gettingLetters: true});
		axios.get(this.config.httpURL+'/LetterOfCredit')
    .then(response => {
			// sort the LOCs by descending ID
			response.data.sort((a,b) => b.letterId.localeCompare(a.letterId));
			// only want to display the first 5 LOCs
			let activeLetters = response.data.slice(0,5);
			this.setState ({
				letters: activeLetters,
				gettingLetters: false
			});
		})
		.catch(error => {
			console.log(error);
		});
	}

	generateCard(i) {
		// should only show LOCs that are ready for Bob to approve
		if (this.state.letters[i].approval.includes('resource:org.acme.loc.BankEmployee#ella')){
      if(i < this.state.letters.length){
        return (
        	  <LoCCard letter={this.state.letters[i]} callback={this.state.callback} pageType={"view"} user="bob"/>
        );
      }
		} else {
			return <div />;
		}
	}

	getBalance() {
		let balance = 12399;
		this.state.letters.map(i => {
			balance += i.status === 'CLOSED' ? i.productDetails.quantity * i.productDetails.pricePerUnit * 0.8 : 0;
		});
		return balance.toLocaleString();
	}

  render() {
    if (this.state.redirect) {
      return <Redirect push to={"/" + this.state.redirectTo} />;
    }

		if(this.state.userDetails.name && !this.state.gettingLetters) {
			let username = this.state.userDetails.name + ", Customer of " + this.state.userDetails.bank;

    	let cardsJSX = [];
    	if(this.state.letters.length) {
				for(let i = 0; i < this.state.letters.length; i++) {
					cardsJSX.push(this.generateCard(i));
				}
			}

			return (
    		<div id="bobPageContainer" className="bobPageContainer">
    		  <div id="bobHeaderDiv" className="flexDiv bobHeaderDiv">
    		    <span className="bobUsername"> {username} </span>
    		  </div>
          <div class="bobWelcomeDiv">
            <p id="welcomeMessage">Welcome back {this.state.userDetails.name}</p>
            <h1 id ="accountBalance">€{this.getBalance()}</h1>
          </div>
    		  <div id="infoDivBob" className="flexDiv infoDivBob">
    		    <div id="bobDetailsDiv" className="bobDetailsDiv">
    		      <UserDetails name={this.state.userDetails.name} companyName={this.state.userDetails.companyName} IBAN={'BE05 1234 5678 0101'} swiftCode={'BOHUBE05'}/>
						</div>

					</div>
    		  <div className="locDivBob">
    		    <LoCApplyCard user="bob" callback={this.state.callback} />
						{cardsJSX}
    		  </div>
				</div>
			);
  	} else {
			return (
			<div id="bobLoadingContainer" className="bobPageContainer">
				<span className="loadingSpan">Loading...</span>
			</div>
			);
		}
	}
}

export default BobPage;
