import React, { Component } from 'react';
import '../../stylesheets/css/main.css';

class Table extends Component {
	render() {
  	return(
  		<div id="tableContainer">
  			<div id="headerBar" className="headerBar">
  				<span className="locOrdersText"> LETTERS OF CREDIT ORDERS </span>
  				<span className="viewAllText"> View all </span>
  			</div>
  			<table>
  				<tbody>
  					<tr className="tableHeaders">
  						<th>Ref number</th>
  						<th>Submitter Account</th>
  						<th>Business Name</th>
  						<th>Status</th>
  					</tr>
  					{this.props.rows}
  				</tbody>
  			</table>
  		</div>
		);
	}
}

export default Table;
