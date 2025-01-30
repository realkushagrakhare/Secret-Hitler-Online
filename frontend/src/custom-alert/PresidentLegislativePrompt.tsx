import React, { Component } from "react";
import ButtonPrompt from "./ButtonPrompt";
import { SERVER_TIMEOUT } from "../constants";

import "../util/PolicyDisplay.css";
import PolicyDisplay from "../util/PolicyDisplay";
import { PolicyType, SendWSCommand, WSCommandType } from "../types";

type PresidentLegislativePromptProps = {
  policyOptions: PolicyType[];
  isPresidentLegislative: boolean;
  sendWSCommand: SendWSCommand;
};

type PresidentLegislativePromptState = {
  selection: number | undefined;
  waitingForServer: boolean;
};

class PresidentLegislativePrompt extends Component<
  PresidentLegislativePromptProps,
  PresidentLegislativePromptState
> {
  constructor(props: PresidentLegislativePromptProps) {
    super(props);
    this.state = {
      selection: undefined,
      waitingForServer: false,
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick() {
    if (this.state.selection === undefined) {
      return;
    }
    // Lock the button so that it can't be pressed multiple times.
    this.setState({ waitingForServer: true });
    setTimeout(() => {
      this.setState({ waitingForServer: false });
    }, SERVER_TIMEOUT);

    // Contact the server using provided method.
    if(this.props.isPresidentLegislative){
      this.props.sendWSCommand({
        command: WSCommandType.REGISTER_PRESIDENT_CHOICE,
        choice: this.state.selection,
      });
    } else {
      this.props.sendWSCommand({
        command: WSCommandType.REGISTER_POLICY_REMOVAL_CHOICE,
        choice: this.state.selection,
      });
    }
  }

  // noinspection DuplicatedCode
  render() {
    let label = this.props.isPresidentLegislative ? "LEGISLATIVE SESSION" : "POLICY REMOVAL";
    let headerText = this.props.isPresidentLegislative 
    ? "Choose a policy to discard. The remaining policies are given to the chancellor."
    : "If the president and the chancellor pick the same policy, it will removed from the game entirely."
    let buttonText = this.props.isPresidentLegislative ? "DISCARD" : "REMOVE";
    return (
      <ButtonPrompt
        label={label}
        headerText={headerText}
        buttonText={buttonText}
        buttonOnClick={this.onButtonClick}
        buttonDisabled={
          this.state.selection === undefined || this.state.waitingForServer
        }
      >
        <PolicyDisplay
          policies={this.props.policyOptions}
          onClick={(index: number) => this.setState({ selection: index })}
          selection={this.state.selection}
          allowSelection={true}
        />
      </ButtonPrompt>
    );
  }
}

export default PresidentLegislativePrompt;
