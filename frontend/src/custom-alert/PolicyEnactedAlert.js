import React, { Component } from "react";
import PropTypes from "prop-types";
import ButtonPrompt from "./ButtonPrompt";

import LiberalPolicy from "../assets/policy-liberal.png";
import FascistPolicy from "../assets/policy-fascist.png";
import CommunistPolicy from "../assets/policy-communist.png";
import SocioDemocraticPolicy from "../assets/policy-socio-democratic.png";
import AntiFascistPolicy from "../assets/policy-anti-fascist.png";
import AntiCommunistPolicy from "../assets/policy-anti-communist.png";
import FolderCoverFront from "../assets/policy-folder-cover-front.png";
import FolderCoverBack from "../assets/policy-folder-cover-back.png";
import FolderBack from "../assets/policy-folder-back.png";

import "./PolicyEnactedAlert.css";
import { ANTICOMMUNIST, ANTIFASCIST, COMMUNIST, FASCIST, LIBERAL, SOCIODEMOCRATIC } from "../constants";

class PolicyEnactedAlert extends Component {
  shiftAnimationTimeout;
  flipAnimationTimeout;

  constructor(props) {
    super(props);
    this.state = {
      className: "",
    };
  }

  componentDidMount() {
    // Set up animations
    this.shiftAnimationTimeout = setTimeout(() => {
      this.setState({ className: "show-policy-shift" });
    }, 500);
    this.flipAnimationTimeout = setTimeout(() => {
      this.setState({ className: "show-policy-flip show-policy-shift" });
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.shiftAnimationTimeout);
    clearTimeout(this.flipAnimationTimeout);
  }

  render() {
    let policySrc = LiberalPolicy;
    let policyType = this.props.policyType;
    if(policyType === FASCIST){
      policySrc = FascistPolicy;
    } else if(policyType === COMMUNIST){
      policySrc = CommunistPolicy;
    } else if(policyType === ANTIFASCIST){
      policySrc = AntiFascistPolicy;
    } else if(policyType === ANTICOMMUNIST){
      policySrc = AntiCommunistPolicy;
    } else if(policyType === SOCIODEMOCRATIC){
      policySrc = SocioDemocraticPolicy;
    }
    return (
      <ButtonPrompt
        renderLabel={() => {
          return <h2 className={"left-align"}>POLICY ENACTED</h2>; // aligns text with center
        }}
        buttonText={"OKAY"}
        buttonOnClick={this.props.hideAlert}
      >
        <div id={"policy-enacted-container"}>
          <img
            id={"policy-enacted-back"}
            className={this.state.className}
            src={FolderBack}
            alt={""}
          />
          <img
            id={"policy-enacted-policy"}
            className={this.state.className}
            src={policySrc}
            alt={
              "A " +
                policyType.toLowerCase() +
                " policy that was enacted! " +
                (policyType === LIBERAL || policyType === SOCIODEMOCRATIC) 
                ? "It's printed in blue with a dove insignia on it."
                : ((policyType === COMMUNIST || policyType === ANTICOMMUNIST)
                ? "It's printed in burgundy with a sickle and the crescent moon on it." 
                : "It's printed in red with a skull insignia on it.")
            }
          />
          <img
            id={"policy-enacted-cover-back"}
            src={FolderCoverBack}
            className={this.state.className}
            alt={"A manila folder labeled 'New Policy.'"}
          />
          <img
            id={"policy-enacted-cover-front"}
            src={FolderCoverFront}
            className={this.state.className}
            alt={"A manila folder labeled 'New Policy.'"}
          />
        </div>
      </ButtonPrompt>
    );
  }
}

PolicyEnactedAlert.propTypes = {
  hideAlert: PropTypes.func.isRequired,
  policyType: PropTypes.string.isRequired,
};

export default PolicyEnactedAlert;
