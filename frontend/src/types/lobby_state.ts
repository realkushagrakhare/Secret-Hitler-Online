import { PolicyType, Role } from "./game";

export enum LobbyState {
  SETUP = "SETUP",
  CHANCELLOR_NOMINATION = "CHANCELLOR_NOMINATION",
  CHANCELLOR_VOTING = "CHANCELLOR_VOTING", // Voting on the chancellor is taking place.
  LEGISLATIVE_PRESIDENT = "LEGISLATIVE_PRESIDENT", // In the legislative phase. The president is selecting a card to discard.
  LEGISLATIVE_CHANCELLOR = "LEGISLATIVE_CHANCELLOR", // In the legislative phase. The chancellor is selecting a card to enact.
  LEGISLATIVE_PRESIDENT_VETO = "LEGISLATIVE_PRESIDENT_VETO", // Chancellor decided to initiate veto, President chooses whether to allow.
  PP_PEEK = "PRESIDENTIAL_POWER_PEEK", // President may peek at the next three cards in the deck
  PP_INVESTIGATE = "PRESIDENTIAL_POWER_INVESTIGATE", // President can investigate a party membership
  PP_EXECUTION = "PRESIDENTIAL_POWER_EXECUTION", // President may choose a player to execute
  PP_ELECTION = "PRESIDENTIAL_POWER_ELECTION", // President chooses the next president, seat continues as normal after.
  POST_LEGISLATIVE = "POST_LEGISLATIVE", // Waiting for the President to end their turn.
  LIBERAL_VICTORY_POLICY = "LIBERAL_VICTORY_POLICY", // Liberal Party won through enacting Liberal policies.
  LIBERAL_VICTORY_EXECUTION = "LIBERAL_VICTORY_EXECUTION", // Liberal Party won through executing Hitler.
  FASCIST_VICTORY_POLICY = "FASCIST_VICTORY_POLICY", // Fascist Party won through enacting Fascist policies.
  FASCIST_VICTORY_ELECTION = "FASCIST_VICTORY_ELECTION", // Fascist Party won by successfully electing Hitler chancellor.
  COMMUNIST_VICTORY_POLICY = "COMMUNIST_VICTORY_POLICY", // Communist Party won through enacting Communist policies.
  COMMUNIST_VICTORY_EXECUTION = "COMMUNIST_VICTORY_EXECUTION", // Communist Party won through executing Hitler.
  CHANCELLOR_POWER_BUGGING = "CHANCELLOR_POWER_BUGGING", // Chancellor accepts or rejects the choice to bug a player by the President.
  PP_BUGGING = "PRESIDENTIAL_POWER_BUGGING", // President may choose a player to bug.
  PP_GET_BUGGING_IDENTITY = "PRESIDENTIAL_POWER_GET_BUGGING_IDENTITY", // Presidents views the identity of the bugged player if the choice was accepted by the chancellor.
  CP_RADICALISATION = "COMMUNIST_POWER_RADICALISATION", // One of the communist chooses a player to radicalise.
  CP_RADICALISATION_ACCEPT_DENY = "COMMUNIST_POWER_RADICALISATION_ACCEPT_DENY", // The fellow communist accept or deny the selection of player to radicalise.
  ANARCHIST_POWER_ASSASSINATION = "ANARCHIST_POWER_ASSASSINATION", // The anacrhist is deciding a player to assassinate.
  POLICY_REMOVAL = "POLICY_REMOVAL", // The president and the chancellor select which policy to remove from the game.
  FIVE_YEAR_PLAN = "FIVE_YEAR_PLAN", // Upto 2 communists and 1 liberal policy added from discard to draw pile. Draw pile is shuffled.
  CONGRESS = "CONGRESS", // The new communists come to know about other communists.
  PP_CONFESSION = "PRESIDENTIAL_POWER_CONFESSION", // President is choosing a player who will be executed and his membership will be revealed.
  MONARCHIST_POWER_ELECTION = "MONARCHIST_POWER_ELECTION", // Monarchist chooses if he wants to reveal himself to use this special power of election. If yes, he also nominates a chancellor.
  MONARCHIST_OPPOSITION_NOMINATION = "MONARCHIST_OPPOSITION_NOMINATION", // The President nominates a candidate against monarchist's candidate.
  MONARCHIST_ELECTION_VOTING = "MONARCHIST_ELECTION_VOTING", // Voting during monarchist's special election is taking place.
  MONARCHIST_ELECTION_TIE = "MONARCHIST_ELECTION_TIE", // Monarchist selects the chancellor in case of a tie.
}

export type PlayerState = {
  id?: Role;
  alive: boolean;
  investigated: boolean;
  isRoleRevealed: boolean;
  knowsCommunists: boolean;
};

export type GameState = {
  state: LobbyState;
  lastState: LobbyState;
  playerOrder: string[];
  players: Record<string, PlayerState>;
  chancellor: string;
  president: string;
  lastChancellor: string;
  lastPresident: string;
  electionTracker: number;
  electionTrackerAdvanced: boolean;
  userVotes: Record<string, boolean>;
  liberalPolicies: number;
  fascistPolicies: number;
  communistPolicies: number;
  isExpansionGame: boolean;
  drawSize: number;
  discardSize: number;
  // TODO: Make GameState type more complex, correlating
  // these fields with certain LobbyStates.
  // This actually is a little more complicated, since GameState currently represents the
  // the full packet data sent by the server. See `Lobby.java` `updateUser()`
  // for how all of this is packaged.
  presidentChoices?: PolicyType[];
  chancellorChoices?: PolicyType[];
  targetUser?: string;
  lastPolicy: string;
  vetoOccurred: boolean;
  peek?: PolicyType[];

  usernames?: string[];
  /** Maps from usernames to icon keys */
  icon: Record<string, string>;
  doesAnarchistKnowCommunists: boolean;
  vetoList?: string[];
  vetoRemaining: number;
  numFascist: number;
  numLiberal: number;
  numCommunist: number;
  hasAnarchist: boolean;
  hasMonarchist: boolean;
  communist1: string;
  communist2: string;
  radicalisationSuccess: boolean;
  policyRemovalMap?: Record<string, PolicyType>; 
  policyRemoved: PolicyType | undefined;
  anarchist: string;
  monarchist: string;
  monarchistCandidate: string;
  opposition: string;
  usedAnarchistPower: boolean;
  antiPolicyPlace: number[];
  policyRemovedPlace: number[];
};
