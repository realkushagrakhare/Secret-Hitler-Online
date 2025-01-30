import React, { Component } from "react";
import ButtonPrompt from "./ButtonPrompt";
import { SERVER_TIMEOUT } from "../constants";
import { SendWSCommand, WSCommandType } from "../types";

type GetBuggingIdentityPromtProps = {
  sendWSCommand: SendWSCommand;
  target: string | undefined;
  chancellor: string;
};

type GetBuggingIdentityPromtState = {
  waitingForServer: boolean;
};

class GetBuggingIdentityPromt extends Component<GetBuggingIdentityPromtProps, GetBuggingIdentityPromtState> {
  constructor(props: GetBuggingIdentityPromtProps) {
    super(props);
    this.state = {
      waitingForServer: false,
    };
  }

  onButtonClick() {
    this.setState({ waitingForServer: true });
    setTimeout(
      () => this.setState({ waitingForServer: false }),
      SERVER_TIMEOUT
    );

    this.props.sendWSCommand({
      command: WSCommandType.GET_BUGGING_IDENTITY,
    });
  }

  render() {
    return (
      <ButtonPrompt
        label={"BUGGING VIEW IDENTITY"}
        renderHeader={() => {
          return (
            <>
              <p className={"left-align"}>
                The chancellor, {this.props.chancellor}, has accepted your bugging request and has viewed the party membership of {this.props.target}.
              </p>
              <p className={"left-align"}>
              </p>
              <br />
            </>
          );
        }}
        footerText={"View the identity of the bugged player."}
        renderButton={() => {
          return (
            <>
              <button
                onClick={() => this.onButtonClick()}
                disabled={this.state.waitingForServer}
              >
                OKAY
              </button>
            </>
          );
        }}
      />
    );
  }
}

export default GetBuggingIdentityPromt;
