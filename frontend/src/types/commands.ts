// TODO: Change these all to camelCase
export const enum WSCommandType {
  NONE = "none",
  PING = "ping",
  START_GAME = "start-game",
  START_COMMUNIST_EXPANSION_GAME = "start-communist-expansion-game",
  GET_STATE = "get-state",
  REGISTER_CHANCELLOR_VETO = "chancellor-veto",
  REGISTER_PRESIDENT_VETO = "president-veto",
  REGISTER_PEEK = "register-peek",
  END_TERM = "end-term",
  // Select an icon
  SELECT_ICON = "select-icon",
  // Select a player
  NOMINATE_CHANCELLOR = "nominate-chancellor",
  REGISTER_EXECUTION = "register-execution",
  REGISTER_SPECIAL_ELECTION = "register-special-election",
  GET_INVESTIGATION = "get-investigation",
  // Voting action
  REGISTER_VOTE = "register-vote",
  // Policy action
  REGISTER_CHANCELLOR_CHOICE = "register-chancellor-choice",
  REGISTER_PRESIDENT_CHOICE = "register-president-choice",
  // Bugging action
  REGISTER_BUGGING_CHOICE = "register-bugging-choice",
  ACCEPT_DENY_BUGGING = "accept-deny-bugging",
  GET_BUGGING_IDENTITY = "get-bugging-identity",
  // Radicalisation
  REGISTER_RADICALISATION = "register-radicalisation",
  ACCEPT_DENY_RADICALISATION = "accept-deny-radicalisation",
  // Policy Removal action
  REGISTER_POLICY_REMOVAL_CHOICE = "register-policy-removal-choice",
  REGISTER_MONARCHIST_CHOICE = "register-monarchist-choice",
  REGISTER_OPPOSITION_CHOICE = "register-opposition-choice",
  // Confession
  REGISTER_CONFESSION = "register-confession",
  // Anarchist power
  REGISTER_ANARCHIST_POWER = "register-anarchist-power",
  REGISTER_ASSASSINATION = "register-assassination",
}

/** All possible commands and associated parameters. */
export type ServerRequestPayload =
  | { command: WSCommandType.PING }
  | { command: WSCommandType.START_GAME }
  | { command: WSCommandType.START_COMMUNIST_EXPANSION_GAME}
  | { command: WSCommandType.GET_STATE }
  | { command: WSCommandType.REGISTER_CHANCELLOR_VETO }
  | { command: WSCommandType.REGISTER_PRESIDENT_VETO; veto: boolean }
  | { command: WSCommandType.REGISTER_PEEK }
  | { command: WSCommandType.END_TERM }
  | { command: WSCommandType.SELECT_ICON; icon: string }
  | { command: WSCommandType.NOMINATE_CHANCELLOR; target: string }
  | { command: WSCommandType.REGISTER_EXECUTION; target: string }
  | { command: WSCommandType.REGISTER_SPECIAL_ELECTION; target: string }
  | { command: WSCommandType.GET_INVESTIGATION; target: string }
  | { command: WSCommandType.REGISTER_VOTE; vote: boolean }
  | { command: WSCommandType.REGISTER_CHANCELLOR_CHOICE; choice: number }
  | { command: WSCommandType.REGISTER_PRESIDENT_CHOICE; choice: number }
  | { command: WSCommandType.REGISTER_BUGGING_CHOICE; target: string }
  | { command: WSCommandType.ACCEPT_DENY_BUGGING; veto: boolean }
  | { command: WSCommandType.GET_BUGGING_IDENTITY; }
  | { command: WSCommandType.REGISTER_POLICY_REMOVAL_CHOICE; choice: number}
  | { command: WSCommandType.REGISTER_RADICALISATION; target: string }
  | { command: WSCommandType.ACCEPT_DENY_RADICALISATION; veto: boolean }
  | { command: WSCommandType.REGISTER_MONARCHIST_CHOICE; target: string;}
  | { command: WSCommandType.REGISTER_OPPOSITION_CHOICE; target: string}
  | { command: WSCommandType.REGISTER_CONFESSION; target: string }
  | { command: WSCommandType.REGISTER_ASSASSINATION; target: string }
  | { command: WSCommandType.REGISTER_ANARCHIST_POWER; veto: boolean }
  | { command: WSCommandType.NONE }


export type SendWSCommand = (payload: ServerRequestPayload) => void;

/**
 * A WebSocket command to send to the server.
 * @param {WSCommandType} command The command type.
 * @param {string} lobby The lobby to send the command to.
 * @param {string} name The name of the player sending the command.
 *
 * Optional, depending on command:
 * @param {number} icon The icon to select.
 * @param {string} target The target of the command. Used for powers and nominations.
 * @param {boolean} vote The vote to register.
 * @param {number} choice The policy index to register.
 */
export type WSCommand = {
  name: string;
  lobby: string;
} & ServerRequestPayload;
