import React from 'react';
import PropTypes from 'prop-types';
import './statusbar.css';
import StatusNode from '../StatusNode/StatusNode.js';

import StatusBarStep from '../../resources/images/StatusBarStep.svg';
import StatusBarFutureStep from '../../resources/images/StatusBarFutureStep.svg';
import StatusBarThisStep from '../../resources/images/StatusBarThisStep.svg';

class StatusBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.state = {
      stepList: this.props.stepList,
      currentStep: this.props.currentStep,
      isHovering: false
    }
  }

  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering,
    };
  }

  render() {
    let stepList = this.state.stepList;
    let currentStep = this.state.currentStep;
    let generatedJSX = [];
    this.state.stepList.forEach((stepLabel) => {
      if(stepLabel == currentStep){
        //draw current step
        generatedJSX.push((
          <div className="Node">
            <div className="popUp">test</div>
            <div><img src={StatusBarThisStep} alt="image not found"/></div>
          </div>
        ));
      } else if (stepLabel < currentStep) {
        if(this.state.isHovering){
          generatedJSX.push((
            <div className="Node">
              <div className="popUp">test</div>
              <div onMouseEnter={this.handleMouseHover} onMouseLeave={this.handleMouseHover}><img src={StatusBarStep} alt="image not found"/></div>
            </div>
        ));
        } else {
          generatedJSX.push((<div onMouseEnter={this.handleMouseHover} onMouseLeave={this.handleMouseHover} className="Node"><img src={StatusBarStep} alt="image not found"/></div>));
        }
      } else if (stepLabel > currentStep) {
        generatedJSX.push((<div className="Node"><img src={StatusBarFutureStep} alt="image not found"/></div>));
      }
      if (stepLabel < stepList.length) {
        //draw line to next step
        generatedJSX.push((<div className="Line"/>));
      }
    });
    return (
      <div className="Container">
      {generatedJSX.map((jsx) => {
        return (jsx);
      })}
      </div>
    );
  }
}

export default StatusBar;
