import React, { Component } from 'react';
import './App.css';
import Page from './components/Pages/Page.js';
import LetterOfCredit from './components/LetterOfCredit/LetterOfCredit.js';
import AlicePage from './components/Pages/AlicePage/AlicePage.js';
import BobPage from './components/Pages/BobPage/BobPage.js';
import MatiasPage from './components/Pages/MatiasPage/MatiasPage.js';
import EllaPage from './components/Pages/EllaPage/EllaPage.js';

const sampleLetter = {
  letterId: '123456',
  date: '08/03/2018',
  applicant: {
    name: 'Alice',
    companyName: 'QuickFix IT',
    sortCode: '12-34-57',
    accNo: '54564351',
    bankName: 'Bank of Argentina'
  },
  beneficiary: {
    name: 'Bob',
    companyName: 'Conga Computers',
    sortCode: '98-76-21',
    accNo: '24689753',
    bankName: 'Central Bank of Belgium'
  },
  productDetails: {
    type: 'Computers',
    quantity: 100,
    unitPrice: '£100',
    totalPrice: '£10000'
  },
  rules: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Praesent blandit libero in condimentum facilisis.', 'Aliquam vitae nibh et nisl mollis euismod eget vel justo.', 'Nullam vel turpis tincidunt, cursus metus id, aliquet enim.', 'Nunc ac mauris at dolor vehicula fermentum.', 'Duis pharetra arcu eu metus vehicula pellentesque.']
};

const pageContents = {
  ALICE: "ALICE",
  BOB: "BOB",
  MATIAS: "MATIAS",
  ELLA: "ELLA",
  LOC: "LOC"
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: pageContents.ALICE,
      currentLetter: {},
      currentUser: "alice"
    };
    this.changeUser = this.changeUser.bind(this);
    this.goToLetterScreen = this.goToLetterScreen.bind(this);
    this.backFromLetterScreen = this.backFromLetterScreen.bind(this);
  }

  goToLetterScreen(letter, isApply) {
    this.setState({
      currentPage: pageContents.LOC,
      currentLetter: letter,
      isApply: isApply
    });
  }

  backFromLetterScreen(user) {
    if(user === "alice") {
      this.goToCustomerScreen();
    } else {
      this.goToEmployeeScreen();
    }
  }

  changeUser(user) {
    if(user === 'alice') {
      this.setState({
        currentPage: pageContents.ALICE,
        currentUser: "alice"
      });
    } else if (user === 'bob') {
      this.setState({
        currentPage: pageContents.BOB,
        currentUser: "bob"
      });
    } else if (user === 'matias') {
      this.setState({
        currentPage: pageContents.MATIAS,
        currentUser: "matias"
      });
    } else {
      this.setState({
        currentPage: pageContents.ELLA,
        currentUser: "ella"
      });
    }
  }

  render() {
    let locPageContents = (
      <LetterOfCredit letter={this.state.currentLetter} date={sampleLetter.date} applicant={sampleLetter.applicant} beneficiary={sampleLetter.beneficiary} rules={sampleLetter.rules} callback={this.changeUser} isApply={this.state.isApply} user={this.state.currentUser}/>
    );

    let pageToShow;

    if(this.state.currentPage === pageContents.ALICE) {
      pageToShow = (
        <AlicePage user={this.state.currentUser} switchUser={this.changeUser} callback={this.goToLetterScreen}/>
      );
    } else if (this.state.currentPage === pageContents.BOB) {
      pageToShow = (
        <BobPage user={this.state.currentUser} switchUser={this.changeUser} callback={this.goToLetterScreen}/>
      );
    } else if(this.state.currentPage === pageContents.MATIAS) {
      pageToShow = (
        <MatiasPage user={this.state.currentUser} switchUser={this.changeUser} callback={this.goToLetterScreen}/>
      );
    } else if(this.state.currentPage === pageContents.ELLA) {
      pageToShow = (
        <EllaPage user={this.state.currentUser} switchUser={this.changeUser} callback={this.goToLetterScreen}/>
      );
    } else {
      pageToShow = (
        <Page contents={locPageContents} />
      );
    }
    return pageToShow;
  }
}

export default App;
