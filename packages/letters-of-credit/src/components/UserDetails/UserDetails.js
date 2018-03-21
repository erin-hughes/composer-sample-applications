import React, { Component } from 'react';
import './userdetails.css';

class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      companyName: this.props.companyName,
      sortCode: this.props.sortCode,
      accountNumber: this.props.accountNumber
    }
  }

  render() {
    let nameText = 'Name: ' + this.state.name;
    let companyNameText = 'Company Name: '+ this.state.companyName;
    let sortCodeText = 'Sort Code: ' + this.state.sortCode;
    let accountNumberText = 'Account Number: ' + this.state.accountNumber;
    return (
      <div className="UserDetails">
        <h1>Business Account</h1>
        <p>{nameText}</p>
        <p>{companyNameText}</p>
        <p>{sortCodeText}</p>
        <p>{accountNumberText}</p>
      </div>
    );
  }
}

export default UserDetails;
