import React, { Component } from "react";
import ButtonPrompt from "./ButtonPrompt";
import {
  PARAM_PLAYERS,
  PARAM_PRESIDENT,
  PLAYER_IDENTITY,
  SERVER_TIMEOUT,
  STATE_CHANCELLOR_POWER_BUGGING,
  STATE_CP_RADICALISATION_ACCEPT_DENY,
  STATE_POST_LEGISLATIVE,
} from "../constants";
import "../selectable.css";
import "./VotingPrompt.css";
import YesVote from "../assets/vote-yes.png";
import NoVote from "../assets/vote-no.png";
import Player from "../player/Player";
import { GameState, Role, SendWSCommand, WSCommandType } from "../types";

type AcceptDenyPromptProps = {
  gameState: GameState;
  sendWSCommand: SendWSCommand;
  user: string;
  targetName: string;
};

type AcceptDenyPromptState = {
  selection?: string;
  waitingForServer: boolean;
};

class AcceptDenyPrompt extends Component<AcceptDenyPromptProps, AcceptDenyPromptState> {
  timeoutID: NodeJS.Timeout | undefined;

  constructor(props: AcceptDenyPromptProps) {
    super(props);
    this.state = {
      selection: undefined,
      waitingForServer: false,
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  /**
   * Returns whether the target's role should be shown on the card.
   */
  shouldRoleBeShown() {
    let game = this.props.gameState;
    if (typeof this.props.targetName === "undefined")
      return false;
    let targetName = this.props.targetName;
    console.log(targetName)
    let targetRole = game[PARAM_PLAYERS][targetName][PLAYER_IDENTITY];
    if(game[PARAM_PLAYERS][targetName].isRoleRevealed)
        return true;
    let userRole = game[PARAM_PLAYERS][this.props.user][PLAYER_IDENTITY];
    switch (userRole) {
      case Role.LIBERAL:
        return false;
      case Role.COMMUNIST:
        if (targetRole === Role.COMMUNIST || targetRole === Role.ANARCHIST)
            return true;
        return false;
      case Role.ANARCHIST:
        if(targetRole === Role.COMMUNIST && game.doesAnarchistKnowCommunists)
            return true;
        return false;
      case Role.FASCIST:
        if (targetRole === Role.HITLER || targetRole === Role.FASCIST || targetRole === Role.MONARCHIST)
          return true;
        return false;
      case Role.HITLER:
        if (targetRole === Role.FASCIST && game.playerOrder.length <= 6)
          return true;
        return false;
      default:
    }
    return false;
  }

  /*shouldRoleBeShown(): boolean {
    let game = this.props.gameState;
    let targetName = this.props.targetName;
    if (typeof targetName === "undefined")
        return false;
    if(game[PARAM_PLAYERS][targetName].isRoleRevealed)
        return true;
    return false;
  }*/

  /**
   * Called when the confirm button is clicked.
   * @effects Attempts to send the server a command with the player's vote, and locks access to the button
   *          for {@code SERVER_TIMEOUT} ms.
   */
  onButtonClick() {
    // Lock the button so that it can't be pressed multiple times.
    this.timeoutID = setTimeout(() => {
      this.setState({ waitingForServer: false });
    }, SERVER_TIMEOUT);
    this.setState({ waitingForServer: true });

    // Contact the server using provided method.
    if(this.props.gameState.state === STATE_CHANCELLOR_POWER_BUGGING){
      this.props.sendWSCommand({
        command: WSCommandType.ACCEPT_DENY_BUGGING,
        veto: this.state.selection === "yes",
      });
    } else if(this.props.gameState.state === STATE_CP_RADICALISATION_ACCEPT_DENY){
      this.props.sendWSCommand({
        command: WSCommandType.ACCEPT_DENY_RADICALISATION,
        veto: this.state.selection === "yes",
      });
    } else if (this.props.gameState.state === STATE_POST_LEGISLATIVE){
      this.props.sendWSCommand({
        command: WSCommandType.REGISTER_ANARCHIST_POWER,
        veto: this.state.selection === "yes",
      });
    } 
    else {
      return;
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
  }

  render() {
    let targetName = this.props.targetName;
    let shouldShowRole: boolean = false;
    let label = "", text1 = "", text2 = "", text3 = "";
    let targetRole = this.props.gameState[PARAM_PLAYERS][targetName][PLAYER_IDENTITY];
    if(this.props.gameState.state === STATE_CHANCELLOR_POWER_BUGGING){
      let presidentName = this.props.gameState[PARAM_PRESIDENT];
      shouldShowRole = this.shouldRoleBeShown();
      label = "BUGGING";
      text1 = presidentName +" has selected " + targetName + " for bugging.";
      text2 = "Decide whether you want to bug this person; Both you (the chancellor) and the president will know the players identity if you select yes!";
      text3 = this.props.gameState.vetoRemaining === 0
              ? "Since you have no vetoes remaining, the player selected will be bugged."
              : "You have " + this.props.gameState.vetoRemaining + " vetoes left."
    }
    else if (this.props.gameState.state === STATE_CP_RADICALISATION_ACCEPT_DENY){
      shouldShowRole = this.shouldRoleBeShown();
      label = "RADICALISATION";
      text1 = "Your fellow communist has selected a player for radicalisation.";
      text2 = "Decide whether you want to radicalise this person. Remember, if the selected player is fascist, radicalisation will fail!";
      text3 = this.props.gameState.vetoRemaining === 0
              ? "Since you have no vetoes remaining, the player selected will be radicalised."
              : "You have " + this.props.gameState.vetoRemaining + " vetoes left."
    } else if (this.props.gameState.state === STATE_POST_LEGISLATIVE){
      label = "ANARCHIST POWER";
      text1 = "Once per game, you can use your power to execute a player. Select " +
              "Ja if you would like to exercise your power.";
      text2 = "Select Nein if you would like to use your power at a later point.";
      text3 = "Remember, you will reveal your secret role to everyone if you your power!"
    } else {
        return null;
    }
    
    
    
    return (
      <ButtonPrompt
        label={label}
        renderHeader={() => {
          return (
            <>
              { this.props.gameState.state !== STATE_POST_LEGISLATIVE &&
                <Player
                  id={"voting-player"}
                  name={this.props.gameState.targetUser}
                  showRole={shouldShowRole}
                  role={targetRole}
                  style={{ marginRight: "10px" }}
                  icon={this.props.gameState.icon[targetName === undefined ? "" : targetName]}
                />
              }
              <p className="left-align">{text1}</p>
              <p className="left-align">{text2}</p>
              <p className="highlight left-align">{text3}</p>
            </>
          );
        }}
        buttonDisabled={
          this.state.selection === undefined || this.state.waitingForServer
        }
        buttonOnClick={this.onButtonClick}
      >
        <div id={"voting-card-container"}>
          <img
            id={"voting-card"}
            className={
              "selectable " +
              (this.state.selection === "yes" ? "selected " : "")
            } /*Determines if this should be selected.*/
            src={YesVote}
            alt={"Ja! (Yes)"}
            onClick={() => this.setState({ selection: "yes" })}
          />
          <img
            id={"voting-card"}
            className={
              "selectable " + (this.state.selection === "no" ? "selected " : "")
            }
            src={NoVote}
            alt={"Nein (No)"}
            onClick={() => this.setState({ selection: "no" })}
          />
        </div>
      </ButtonPrompt>
    );
  }
}




export default AcceptDenyPrompt;
