import React, { Component } from 'react';
import '../../../stylesheets/css/main.css';
import { Redirect } from 'react-router-dom';
import Config from '../../../utils/config';

class TutorialPage extends Component {

    constructor() {
        super();
        this.config = new Config();
    }

    render() {
        return (
            <div id="tutorialPageContainer" className="tutorialPageContainer" >
                <h1 id="scenario">Scenario</h1>

                <p>In this sample you will take on the role of four participants to see how blockchain can be used to track letters of credit. These participants are:</p>
                
                <p><strong>Alice Hamilton</strong> - Owner of QuickFix IT, a company specialising in the sale of computers.</p>
                
                <p><strong>Bob Appleton</strong> - Owner of Conga Computers, a manufacturer of computers.</p>
                
                <p><strong>Matías</strong> - Employee of Penguin Bank, the bank which Alice has an account with.</p>
                
                <p><strong>Ella</strong> - Employee of the Bank of Hursley, the bank which Bob has an account with.</p>
                
                <p>The above participants have varying roles in the scenario with Alice playing the <em>applicant</em>, Bob the <em>beneficiary</em>, Matías the <em>issuing bank</em> and Ella the <em>exporter bank</em>.</p>
                
                <p>In the scenario that this sample covers Alice and Bob have agreed that Alice will purchase computers from Bob's next shipment and have agreed a price for these. Alice unfortunately does not have enough money in her account to cover the entire cost of the purchase and therefore she is requesting a letter of credit to cover this cost from her Bank, Penguin Bank. This sample will cover how this letter of credit is tracked using blockchain.</p>
                
                <h1 id="tutorial">Tutorial</h1>
                
                <h2 id="settingupthedemo">Setting up the demo</h2>
                
                <p>Open each participant's application in a seperate tab. <a target="_blank" href="/alice">Alice's banking app</a>, <a target="_blank" href="/matias">Matías' bank employee view</a>, <a target="_blank" href="/ella">Ella's bank employee view</a> and <a target="_blank" href="/bob">Bob's banking app</a>.</p>
                
                <h2 id="applyingforaletterofcredit">Applying for a letter of credit</h2>
                
                <p>On Alice's screen apply for a new letter of credit. </p>
                
                <p>Enter the product details the letter of credit will cover by clicking 'Edit', entering computers for the type, 100 for the quantity and 1200 for price per unit. Save your changes.</p>
                
                <p>Review the terms and conditions then confirm the request for a letter of credit by clicking 'Start approval process' and pressing 'Yes' to the modal warning.</p>
                
                <p>Note: For the purpose of this sample the details of Bob are prefilled in for the letter of credit. </p>
                
                <h2 id="issuingbankapproval">Issuing bank approval</h2>
                
                <p>Navigate to Matías' screen and you will see that there is a new request for a letter of credit from Alice Hamilton. Click on the request to view it in full. </p>
                
                <p>Review the product details and terms and conditions and then accept the application by clicking 'I accept the application' and pressing 'Yes' to the modal warning. </p>
                
                <h2 id="exportingbankapproval">Exporting bank approval</h2>
                
                <p>Once the issuing bank has approved the letter of credit it is now visible to Ella. </p>
                
                <p>Navigate to Ella's screen and you will see that there is a new request for a letter of credit from Alice Hamilton awaiting approval. Click on the request to view it in full. </p>
                
                <p>Review the product details and terms and conditions are acceptable and then accept the application by clicking 'I accept the application' and pressing 'Yes' to the modal warning.</p>
                
                <h2 id="exporterapproval">Exporter approval</h2>
                
                <p>Now that the letter of credit has been approved by both the issuing bank and the exporter it is now visible to Bob. Navigate to Bob's screen and click 'View Letter of Credit'.</p>
                
                <p>Review the product details and terms and conditions are acceptable and then accept the application by clicking 'I accept the application' and pressing 'Yes' to the modal warning.</p>
                
                <h2 id="declaringthegoodsasshipped">Declaring the goods as shipped</h2>
                
                <p>When Bob has shipped the goods he can use his banking application to update the letter of credit with information regarding this.</p>
                
                <p>Within Bob's screen click 'Ship Order' to mark that the goods have been shipped.</p>
                
                <p>This writes to the letter of credit a hash of his shipping documents for use as proof. </p>
                
                <h2 id="declaringthegoodasreceived">Declaring the good as received</h2>
                
                <p>Once Bob has shipped the goods Alice can then mark when she receives the goods that she accepts the order. By clicking accept order Alice agrees that what she has received matches the terms set out for the goods in the letter of credit. </p>
                
                <p>In Alice's screen click 'Accept Order'.</p>
                
                <h2 id="issuingpayment">Issuing payment</h2>
                
                <p>Once Alice has marked the goods as received Matías is alerted to this through his employee banking application. The issuing bank will then performs their own check on the goods and pay the letter of credit if they agree that they match the terms laid out in the letter of credit.</p>
                
                <p>On Matías' screen click the letter of credit and press 'Ready for payment' and press 'Yes' to the modal warning.</p>
                
                <h2 id="closingtheletterofcredit">Closing the Letter of Credit</h2>
                
                <p>Now that the issuing bank has confirmed that they are happy with the goods and have made the payment the exporter bank can close the letter of credit and deposit the funds to the beneficiary. </p>
                
                <p>In Ella's screen click the letter of credit and press 'Close this letter of credit'.</p>
                
                <h2 id="confirmingcompletion">Confirming completion</h2>
                
                <p>Now that the letter of credit is closed Bob will have had the value of it deposited in his account. </p>
                
                <p>On Bob's screen review his bank balance and note that the payment has been made.</p>
                
                <h1 id="nextsteps">Next steps</h1>
                
                <p>This sample was built using <a target="_blank" href={this.config.playground.docURL}>{this.config.playground.name}</a>. Check out the model and business logic behind this sample <a target="_blank" href={this.config.playground.deployedURL}>here</a>, or browse the generated REST APIs <a target="_blank" href={this.config.restServer.explorer}>here</a>.</p>
            </div>
        );
    }
}

export default TutorialPage;