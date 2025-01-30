import React, { Component } from "react";
import ButtonPrompt from "./ButtonPrompt";
import {
  PARAM_CHANCELLOR,
  PARAM_PLAYERS,
  PARAM_PRESIDENT,
  PLAYER_IDENTITY,
  SERVER_TIMEOUT,
} from "../constants";
import "../selectable.css";
import "./VotingPrompt.css";
import YesVote from "../assets/vote-yes.png";
import NoVote from "../assets/vote-no.png";
import Player from "../player/Player";
import { GameState, LobbyState, Role, SendWSCommand, WSCommandType } from "../types";

type VotingPromptProps = {
  gameState: GameState;
  sendWSCommand: SendWSCommand;
  user: string;
};

type VotingPromptState = {
  selection?: string;
  waitingForServer: boolean;
};

class VotingPrompt extends Component<VotingPromptProps, VotingPromptState> {
  timeoutID: NodeJS.Timeout | undefined;

  constructor(props: VotingPromptProps) {
    super(props);
    this.state = {
      selection: undefined,
      waitingForServer: false,
    };
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  /**
   * Returns whether the chancellor's role should be shown on the card.
   * @return {boolean} Returns true iff the chancellor should be shown. This can happen if:
   *          - The player is fascist and the chancellor is fascist/hitler
   *          - The player is hitler, the chancellor is fascist, and there are 5-6 players.
   */
  shouldChancellorRoleBeShown() {
    let game = this.props.gameState;
    let userRole = game[PARAM_PLAYERS][this.props.user][PLAYER_IDENTITY];
    let chancellor = game[PARAM_CHANCELLOR];
    let chancellorRole = game[PARAM_PLAYERS][chancellor][PLAYER_IDENTITY];
    switch (userRole) {
      case Role.LIBERAL:
        return false;
      case Role.FASCIST:
        if (chancellorRole === Role.HITLER || chancellorRole === Role.FASCIST) {
          return true;
        }
        break;
      case Role.HITLER:
        if (chancellorRole === Role.FASCIST && game.playerOrder.length <= 6) {
          return true;
        }
        break;
      default:
    }
    return false;
  }

  shouldShowRole = (
      gameState: GameState,
      playerName: string
  ): boolean => {
    const myPlayer = gameState.players[this.props.user];
    const otherPlayer = gameState.players[playerName];
    const myRole = myPlayer.id;
    const otherRole = otherPlayer.id;
    

    if (otherRole === undefined) {
      return false;
    } else if(this.props.user === playerName){
      return true;
    } else if (myRole === Role.FASCIST){
      return otherRole === Role.FASCIST || otherRole === Role.HITLER || otherRole === Role.MONARCHIST;
    } else if (myRole === Role.HITLER && this.doesHitlerKnowFascists(gameState)){
      return otherRole === Role.FASCIST;
    } else if (myRole === Role.COMMUNIST && myPlayer.knowsCommunists){
      return otherRole === Role.COMMUNIST || otherRole === Role.ANARCHIST;
    } else if(myRole === Role.ANARCHIST && gameState.doesAnarchistKnowCommunists){
      return otherRole === Role.COMMUNIST;
    } else {
      return false; // Liberals and Monarchists
    } 
  };

  doesHitlerKnowFascists = (gameState: GameState): boolean => {
    return gameState.playerOrder.length <= 6;
  };

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
    this.props.sendWSCommand({
      command: WSCommandType.REGISTER_VOTE,
      vote: this.state.selection === "yes",
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
  }

  render() {
    if(this.props.gameState.state === LobbyState.MONARCHIST_ELECTION_TIE ||
      this.props.gameState.state === LobbyState.MONARCHIST_ELECTION_VOTING){
        return this.renderForMonarchistElection();
    }
    let chancellorName = this.props.gameState[PARAM_CHANCELLOR];
    let shouldShowChancellorRole = this.shouldShowRole(this.props.gameState, chancellorName);
    let chancellorRole =
      this.props.gameState[PARAM_PLAYERS][chancellorName][PLAYER_IDENTITY];
    let presidentName = this.props.gameState[PARAM_PRESIDENT];
    return (
      <ButtonPrompt
        label={"VOTING"}
        renderHeader={() => {
          return (
            <>
              <Player
                id={"voting-player"}
                name={chancellorName}
                showRole={shouldShowChancellorRole}
                role={chancellorRole}
                style={{ marginRight: "10px" }}
                icon={this.props.gameState.icon[chancellorName]}
              />

              <p className="left-align">
                {presidentName +
                  " has nominated " +
                  chancellorName +
                  " as chancellor."}
              </p>
              <p className="left-align">
                {
                  "Vote on whether you want this government to proceed; The vote passes if over 50% of the votes are yes."
                }
              </p>

              {/* These are two optional warnings that appear when player decisions are extra critical,
                                      such as if fascists can win the game or if the voting tracker will hit the end. */}
              {this.props.gameState.fascistPolicies >= 3 && (
                <p className="highlight left-align">
                  {
                    "Fascists will win if Hitler is successfully voted in as chancellor!"
                  }
                </p>
              )}
              {this.props.gameState.electionTracker === 2 && (
                <p className="highlight left-align">
                  {
                    "If this vote fails, the next policy in the draw deck will be immediately enacted."
                  }
                </p>
              )}
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

  renderForMonarchistElection(){
    let candidateName = this.props.gameState.monarchistCandidate;
    let shouldShowCandidateRole = this.shouldShowRole(this.props.gameState, candidateName);
    let candidateRole =
      this.props.gameState[PARAM_PLAYERS][candidateName][PLAYER_IDENTITY];

    let oppositionName = this.props.gameState.opposition;
    let shouldShowOppositionRole = this.shouldShowRole(this.props.gameState, oppositionName);
    let oppositionRole =
      this.props.gameState[PARAM_PLAYERS][oppositionName][PLAYER_IDENTITY];

    let tieText = this.props.gameState.state === LobbyState.MONARCHIST_ELECTION_VOTING 
                  ? "If this vote is a tie, Monarchist gets the final say."
                  : "Since the vote was a tie, Monarchist gets the final say.";
    return (
      <ButtonPrompt
        label={"VOTING"}
        renderHeader={() => {
          return (
            <>
              <Player
                id={"voting-player"}
                name={candidateName}
                showRole={shouldShowCandidateRole}
                role={candidateRole}
                style={{ marginRight: "10px" }}
                icon={this.props.gameState.icon[candidateName]}
              />
              <Player
                id={"voting-player"}
                name={oppositionName}
                showRole={shouldShowOppositionRole}
                role={oppositionRole}
                style={{ marginRight: "10px" }}
                icon={this.props.gameState.icon[oppositionName]}
              />

              <p className="left-align">
                {this.props.gameState.monarchist + " has nominated " + candidateName + " and " 
                + this.props.gameState.president + " has nominated " + oppositionName +"."}
              </p>
              <p className="left-align">
                {
                  "Vote Yes for " + candidateName + " and No for " + oppositionName + ". Whoever wins, " + 
                  "Monarchist will be the President."
                }
              </p>
              <p className="highlight left-align">
                {tieText}
              </p>
              <p className="highlight left-align">
                {
                  "Fascists will win if Hitler is successfully voted in as chancellor!"
                }
              </p>
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


export default VotingPrompt;
