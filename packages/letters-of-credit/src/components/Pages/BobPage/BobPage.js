import React, { Component } from 'react';
import './bobpage.css';
import axios from 'axios';
import UserDetails from '../../UserDetails/UserDetails.js';
import Alert from '../../Alert/Alert.js';
import LoCCard from '../../LoCCard/LoCCard.js';
import LoCApplyCard from '../../LoCCard/LoCApplyCard.js';

class BobPage extends Component {
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
    		<div id="bobPageContainer" className="bobPageContainer">
    		  <div id="bobHeaderDiv" className="flexDiv bobHeaderDiv">
    		    <span className="bobUsername" onClick={() => {this.state.switchUser('ella')}}> {username} </span>
						<span className="aliceUsername" onClick={() => {this.state.switchUser('alice')}}> Go to Alice </span>
    		  </div>
          <div class="bobWelcomeDiv">
            <p id="welcomeMessage">Welcome back {this.state.userDetails.name}</p>
            <h1 id ="accountBalance">£15,670</h1>
          </div>
    		  <div id="infoDiv" className="flexDiv infoDiv">
    		    <div id="bobDetailsDiv" className="bobDetailsDiv">
    		      <UserDetails name={this.state.userDetails.name} companyName={this.state.userDetails.companyName} sortCode={'12-34-57'} accountNumber={'54564351'}/>
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
			<div id="bobLoadingContainer" className="bobPageContainer">
				<span className="loadingSpan">Loading...</span>
			</div>
			);
		}
	}
}

export default BobPage;
