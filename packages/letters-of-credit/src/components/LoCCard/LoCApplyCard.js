import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './loccard.css';

class LoCApplyCard extends Component {
    render() {
      return (
        <div className="LoCCard noBorder">
          <h3>Letter of Credit Application</h3>
          <p>A letter of credit is issued by a bank to another bank (especially one in a different country) to serve as a guarantee for payments made to a specified person under specified conditions.</p>
          <button className="viewButton applyButton" onClick={() => this.props.callback({}, true)}>Apply for a Letter of Credit</button>
        </div>
      );
    }
  }
  
  LoCApplyCard.propTypes = {
    callback: PropTypes.func
  }

  export default LoCApplyCard;