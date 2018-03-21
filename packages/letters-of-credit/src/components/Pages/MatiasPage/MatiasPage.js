import React, { Component } from 'react';
import './matiaspage.css';
import axios from 'axios';
import Table from '../../Table/Table.js';


class MatiasPage extends Component {
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
    console.log(this.props);
    let cURL = 'http://localhost:3000/api/BankEmployee/' + this.props.user;
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

  generateRow(i) {
    let submitter = "Alice Hamilton";
    let company = "QuickFix IT";
    if(this.state.letters[i].applicant === 'resource:org.acme.loc.Customer#bob') {
      submitter = "Bob Bobbins";
      company = "Conga Computers"
    }
    return (
			<tr className="row" onClick={() => this.props.callback(this.state.letters[i], false)}>
				<td className="blueText">{this.state.letters[i].letterId}</td>
				<td>{submitter}</td>
				<td>{company}</td>
				<td>{this.state.letters[i].status}</td>
			</tr>
		);
  }

  render() {
    if(this.state.userDetails.name) {
      let username = this.state.userDetails.name + ", Employee at " + this.state.userDetails.bankName;

      let rowsJSX = [];
      if(this.state.letters.length) {
        for(let i = 0; i < this.state.letters.length; i++) {
          rowsJSX.push(this.generateRow(i))
        }
      }

      return (
        <div id="matiasPageContainer" className="matiasPageContainer">
          <div id="matiasHeaderDiv" className="flexDiv matiasHeaderDiv">
            <span className="matiasUsername" onClick={() => {this.state.switchUser('alice')}}> {username} </span>
            <div id="matiasMenu" className="matiasMenuItems">
              <span> Change account details </span>
              <span> View Transaction History </span>
              <span> Make Transaction </span>
              <span> Viewing all Business Acccounts </span>
            </div>
          </div>
          <div id="matiasWelcomeDiv" className="matiasWelcomeDiv">
            <h1> Welcome back {this.state.userDetails.name} </h1>
          </div>
          <div id="tableDiv">
            <Table rows={rowsJSX}/>
          </div>
        </div>
      );
    } else {
      return(
        <div id="matiasLoadingContainer" className="matiasPageContainer">
				  <span className="matiasLoadingSpan">Loading...</span>
        </div>
      );
    }
  }
}

export default MatiasPage;
