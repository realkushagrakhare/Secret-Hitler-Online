import React, { ReactElement, useEffect, useRef, useState } from "react";
import PlayerDisplayPrompt from "./PlayerDisplayPrompt";
import { SERVER_TIMEOUT } from "../constants";
import {
  DISABLE_EXECUTED_PLAYERS,
  DISABLE_INVESTIGATED_PLAYERS,
  DISABLE_TERM_LIMITED_PLAYERS,
  DISABLE_PLAYERS_FOR_BUGGINNG,
  DISABLE_PLAYERS_FOR_RADICALISATION,
  DISABLE_PLAYERS_FOR_MONARCHIST_ELECTION,
  DISABLE_PLAYERS_FOR_MONARCHIST_OPPOSITION,
} from "../player/PlayerDisplay";
import { GameState, SendWSCommand, WSCommandType } from "../types";

type AllowedWSCommandTypes =
  | WSCommandType.NOMINATE_CHANCELLOR
  | WSCommandType.REGISTER_EXECUTION
  | WSCommandType.REGISTER_SPECIAL_ELECTION
  | WSCommandType.GET_INVESTIGATION
  | WSCommandType.REGISTER_BUGGING_CHOICE
  | WSCommandType.REGISTER_RADICALISATION
  | WSCommandType.REGISTER_MONARCHIST_CHOICE
  | WSCommandType.REGISTER_CONFESSION
  | WSCommandType.REGISTER_ASSASSINATION
  | WSCommandType.REGISTER_OPPOSITION_CHOICE;


type SelectPlayerPromptProps = {
  user: string;
  gameState: GameState;
  sendWSCommand: SendWSCommand;
  commandType: AllowedWSCommandTypes;

  disabledFilter: (name: string, state: GameState) => string; // By default, excludes deceased players
  includeUser: boolean;

  label?: string;
  headerText?: string;
  renderHeader?: () => ReactElement;
  buttonText?: string;
};

type SelectPlayerPromptWithCancelProps = {
  user: string;
  gameState: GameState;
  sendWSCommand: SendWSCommand;
  commandType: AllowedWSCommandTypes;

  disabledFilter: (name: string, state: GameState) => string; // By default, excludes deceased players
  includeUser: boolean;

  label?: string;
  headerText?: string;
  renderHeader?: () => ReactElement;
  buttonText?: string;
  secondButtonText?: string;
};

const defaultProps: Partial<SelectPlayerPromptProps> = {
  disabledFilter: DISABLE_EXECUTED_PLAYERS,
};

/**
 * A PlayerPrompt that sends a specified server command on the button push and automatically locks the button for a set
 * duration.
 */
export default function SelectPlayerPrompt(
  inputProps: SelectPlayerPromptProps
): ReactElement {
  const props = { ...defaultProps, ...inputProps };

  const timeOutID = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isWaitingForServer, setIsWaitingServer] = useState(false);

  const onButtonClick = (selectedItem: string) => {
    // Lock the button so that it can't be pressed multiple times.
    setIsWaitingServer(true);
    timeOutID.current = setTimeout(() => {
      setIsWaitingServer(false);
    }, SERVER_TIMEOUT);

    props.sendWSCommand({ command: props.commandType, target: selectedItem });
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeOutID.current);
    };
  }, []);

  return (
    <PlayerDisplayPrompt
      label={props.label}
      headerText={props.headerText}
      renderHeader={props.renderHeader}
      gameState={props.gameState}
      disabledFilter={props.disabledFilter}
      buttonText={props.buttonText}
      buttonOnClick={onButtonClick}
      buttonDisabled={isWaitingForServer}
      user={props.user}
      includeUser={props.includeUser}
    />
  );
}


/**
 * A PlayerPrompt that sends a specified server command on the button push and automatically locks the button for a set
 * duration.
 */
export function SelectPlayerPromptWithCancel(
  inputProps: SelectPlayerPromptWithCancelProps
): ReactElement {
  const props = { ...defaultProps, ...inputProps };

  const timeOutID = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isWaitingForServer, setIsWaitingServer] = useState(false);

  const onButtonClick = (selectedItem: string) => {
    // Lock the button so that it can't be pressed multiple times.
    setIsWaitingServer(true);
    timeOutID.current = setTimeout(() => {
      setIsWaitingServer(false);
    }, SERVER_TIMEOUT);
    if(selectedItem === undefined){
      return;
    }
    props.sendWSCommand({ command: props.commandType, target: selectedItem});
  };

  const onSecondButtonClick = (selectedItem: string) => {
    // Lock the button so that it can't be pressed multiple times.
    setIsWaitingServer(true);
    timeOutID.current = setTimeout(() => {
      setIsWaitingServer(false);
    }, SERVER_TIMEOUT);

    props.sendWSCommand({ command: props.commandType, target: "" });
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeOutID.current);
    };
  }, []);

  return (
    <PlayerDisplayPrompt
      label={props.label}
      headerText={props.headerText}
      renderHeader={props.renderHeader}
      gameState={props.gameState}
      disabledFilter={props.disabledFilter}
      buttonText={props.buttonText}
      buttonOnClick={onButtonClick}
      buttonDisabled={isWaitingForServer}
      user={props.user}
      includeUser={props.includeUser}
      secondButtonText={props.secondButtonText}
      secondButtonOnClick={onSecondButtonClick}
      secondButtonDisabled={isWaitingForServer}
      secondButtonExists={true}
    />
  );
}


// Definitions for some basic templates.
/**
 * Returns the HTML for the NominationPrompt.
 * @param user {String} the name of the user.
 * @param gameState {Object} the state of the game.
 * @param sendWSCommand {function} the callback function for sending websocket commands.
 * @return {html} the HTML Tag for a SelectPlayerPrompt that requests the player to select a chancellor.
 *         Notably, the prompt disables players that are term-limited, and when the button is pressed sends the
 *         COMMAND_NOMINATE_CHANCELLOR command to the server.
 */
export const SelectNominationPrompt = (
  user: string,
  gameState: GameState,
  sendWSCommand: SendWSCommand
): ReactElement => {
  let shouldFascistVictoryWarningBeShown = gameState.fascistPolicies >= 3;

  return (
    <SelectPlayerPrompt
      user={user}
      commandType={WSCommandType.NOMINATE_CHANCELLOR}
      label={"NOMINATION"}
      gameState={gameState}
      sendWSCommand={sendWSCommand}
      renderHeader={() => {
        return (
          <div>
            <p className="left-align">
              Nominate a player to become the next Chancellor.
            </p>
            <p
              className="left-align highlight"
              hidden={!shouldFascistVictoryWarningBeShown}
            >
              Fascists will win if Hitler is nominated and voted in as
              Chancellor!
            </p>
          </div>
        );
      }}
      disabledFilter={DISABLE_TERM_LIMITED_PLAYERS}
      includeUser={false}
    />
  );
};

/**
 * Returns the HTML for the InvestigationPrompt.
 * @param user {String} the name of the user.
 * @param gameState {Object} the state of the game.
 * @param sendWSCommand {function} the callback function for sending websocket commands.
 * @return {html} The HTML Tag for a SelectPlayerPrompt that requests the player to select a player to investigate.
 *         The prompt disables players that have been investigated, and when the button is pressed sends the
 *         COMMAND_GET_INVESTIGATION command to the server.
 */
export const SelectInvestigationPrompt = (
  user: string,
  gameState: GameState,
  sendWSCommand: SendWSCommand
): ReactElement => {
  return (
    <SelectPlayerPrompt
      user={user}
      gameState={gameState}
      sendWSCommand={sendWSCommand}
      commandType={WSCommandType.GET_INVESTIGATION}
      disabledFilter={DISABLE_INVESTIGATED_PLAYERS}
      includeUser={false}
      label={"INVESTIGATE LOYALTY"}
      renderHeader={() => {
        return (
          <>
            <p className={"left-align"}>
              Choose a player and investigate their party alignment. You'll
              learn if the player is a member of the Fascist or Liberal party,
              but not their specific role (e.g., Hitler).
            </p>
            <p className={"left-align"}>
              Players that have been investigated once cannot be investigated
              again.
            </p>
            <p className={"left-align highlight"}>
              (Remember that you can lie about the player's party alignment!)
            </p>
          </>
        );
      }}
    />
  );
};

/**
 * Returns the HTML for the InvestigationPrompt.
 * @param user {String} the name of the user.
 * @param gameState {Object} the state of the game.
 * @param sendWSCommand {function} the callback function for sending websocket commands.
 * @return {html} The HTML Tag for a SelectPlayerPrompt that requests the player to select a player to investigate.
 *         The prompt disables players that have been investigated, and when the button is pressed sends the
 *         COMMAND_GET_INVESTIGATION command to the server.
 */
export const SelectConfessionPrompt = (
  user: string,
  gameState: GameState,
  sendWSCommand: SendWSCommand
): ReactElement => {
  return (
    <SelectPlayerPrompt
      user={user}
      gameState={gameState}
      sendWSCommand={sendWSCommand}
      commandType={WSCommandType.REGISTER_CONFESSION}
      disabledFilter={DISABLE_EXECUTED_PLAYERS}
      includeUser={false}
      label={"CONFESSION"}
      renderHeader={() => {
        return (
          <>
            <p className={"left-align"}>
              Choose a player to execute. That player's party membership,
              Fascist or Liberal or Communist party, will be revealed to
              everyone.
            </p>
            <p className={"left-align highlight"}>
              (Remember, their secret role (e.g., Anarchist), will not be revealed.!)
            </p>
          </>
        );
      }}
    />
  );
};


/**
 * Returns the HTML for the SelectBuggingPrompt.
 * @param user {String} the name of the user.
 * @param gameState {Object} the state of the game.
 * @param sendWSCommand {function} the callback function for sending websocket commands.
 * @return {html} The HTML Tag for a SelectPlayerPrompt that requests the player to select a player to investigate.
 *         The prompt disables players that have been investigated or have been vetoed, and when the button is pressed sends the
 *         COMMAND_REGISTER_BUGGING_CHOICE command to the server.
 */
export const SelectBuggingPrompt = (
  user: string,
  gameState: GameState,
  sendWSCommand: SendWSCommand
): ReactElement => {
  return (
    <SelectPlayerPrompt
      user={user}
      gameState={gameState}
      sendWSCommand={sendWSCommand}
      commandType={WSCommandType.REGISTER_BUGGING_CHOICE}
      disabledFilter={DISABLE_PLAYERS_FOR_BUGGINNG}
      includeUser={false}
      label={"BUGGING PLAYER CHOICE"}
      renderHeader={() => {
        return (
          <>
            <p className={"left-align"}>
              Choose a player to bug. The chancellor has <strong>{gameState.vetoRemaining}</strong> vetoes remaining. 
              You'll both learn if the player is a member of the Fascist or Liberal or
              Communist party, but not their specific role (e.g., Hitler).
            </p>
            <p className={"left-align"}>
              Players that have been executed, investigated or have ben vetoed 
              cannot be bugged.
            </p>
            <p className={"left-align highlight"}>
              (Remember that you can lie about the player's party alignment!)
            </p>
          </>
        );
      }}
    />
  );
};

export const SelectRadicalisationPrompt = (
  user: string,
  gameState: GameState,
  sendWSCommand: SendWSCommand
): ReactElement => {
  return (
    <SelectPlayerPrompt
      user={user}
      gameState={gameState}
      sendWSCommand={sendWSCommand}
      commandType={WSCommandType.REGISTER_RADICALISATION}
      disabledFilter={DISABLE_PLAYERS_FOR_RADICALISATION}
      includeUser={false}
      label={"BUGGING PLAYER CHOICE"}
      renderHeader={() => {
        return (
          <>
            <p className={"left-align"}>
              Choose a player to radicalise. If there is another communist (not anarchist)
              in the game, they will get to accept or deny the request.
            </p>
            <p className={"left-align"}>
              Players that have been executed, investigated or who are communists 
              cannot be radicalised.
            </p>
            <p className={"left-align highlight"}>
              (Remember that radicalisation will fail on fascists!)
            </p>
          </>
        );
      }}
    />
  );
};

export const MonarchistPowerSelectPrompt = (
  user: string,
  gameState: GameState,
  sendWSCommand: SendWSCommand
): ReactElement => {
  return (
    <SelectPlayerPromptWithCancel
      user={user}
      gameState={gameState}
      sendWSCommand={sendWSCommand}
      commandType={WSCommandType.REGISTER_MONARCHIST_CHOICE}
      disabledFilter={DISABLE_PLAYERS_FOR_MONARCHIST_ELECTION}
      includeUser={false}
      label={"MONARCHIST POWER: SPECIAL ELECTION"}
      renderHeader={() => {
        return (
          <>
            <p className={"left-align"}>
              You can use your power to call special election. In this, you pick a chancellor 
              candidate. Then the current president will pick an opposition candidate.
            </p>
            <p className={"left-align"}>
              The players vote for one candidate. Whosoever wins, you become the president.
            </p>
            <p className={"left-align highlight"}>
              (Remember to use your power, you need to reveal your secret role!)
            </p>
          </>
        );
      }}
    />
  );
};

export const SelectOppositionPrompt = (
  user: string,
  gameState: GameState,
  sendWSCommand: SendWSCommand
): ReactElement => {
  return (
    <SelectPlayerPromptWithCancel
      user={user}
      gameState={gameState}
      sendWSCommand={sendWSCommand}
      commandType={WSCommandType.REGISTER_OPPOSITION_CHOICE}
      disabledFilter={DISABLE_PLAYERS_FOR_MONARCHIST_OPPOSITION}
      includeUser={false}
      label={"SPECIAL ELECTION: SELECTING OPPOSITION"}
      secondButtonText="CANCEL"
      renderHeader={() => {
        return (
          <>
            <p className={"left-align"}>
              The monarchist has called for special election and selected his candidate.
            </p>
            <p className={"left-align"}>
              You can now select a candidate in opposition to monarchist's candidate.
            </p>
            <p className={"left-align highlight"}>
              (The players vote for one candidate. Whosoever wins, Monarchist will be the president!)
            </p>
          </>
        );
      }}
    />
  );
};


export const SelectAssassinationPrompt = (
  user: string,
  gameState: GameState,
  sendWSCommand: SendWSCommand
): ReactElement => {
  return (
    <SelectPlayerPrompt
      user={user}
      gameState={gameState}
      sendWSCommand={sendWSCommand}
      commandType={WSCommandType.REGISTER_ASSASSINATION}
      disabledFilter={DISABLE_EXECUTED_PLAYERS}
      includeUser={false}
      label={"ANARCHIST POWER: ASSASSINATION"}
      renderHeader={() => {
        return (
          <>
            <p className={"left-align"}>
              Choose a player to execute. That player can no longer speak, vote,
              or run for office.
            </p>
            <p className={"left-align"}>
              The game ends if Hitler is executed.
            </p>
          </>
        );
      }}
    />
  );
};

export const SelectSpecialElectionPrompt = (
  user: string,
  gameState: GameState,
  sendWSCommand: SendWSCommand
): ReactElement => {
  return (
    <SelectPlayerPrompt
      user={user}
      gameState={gameState}
      sendWSCommand={sendWSCommand}
      commandType={WSCommandType.REGISTER_SPECIAL_ELECTION}
      disabledFilter={DISABLE_EXECUTED_PLAYERS}
      includeUser={false}
      label={"SPECIAL ELECTION"}
      headerText={
        "Choose any player to become the next president. Once their term is finished, the order continues as normal."
      }
    />
  );
};

export const SelectExecutionPrompt = (
  user: string,
  gameState: GameState,
  sendWSCommand: SendWSCommand
): ReactElement => {
  return (
    <SelectPlayerPrompt
      user={user}
      gameState={gameState}
      sendWSCommand={sendWSCommand}
      commandType={WSCommandType.REGISTER_EXECUTION}
      disabledFilter={DISABLE_EXECUTED_PLAYERS}
      includeUser={false}
      label={"EXECUTION"}
      renderHeader={() => {
        return (
          <>
            <p className={"left-align"}>
              Choose a player to execute. That player can no longer speak, vote,
              or run for office.
            </p>
            <p className={"left-align highlight"}>
              The game ends if Hitler is executed.
            </p>
          </>
        );
      }}
    />
  );
};
