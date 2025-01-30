import React, { Component } from "react";
import ReactGA from "react-ga";
import "./App.css";
import "./Lobby.css";
import "./fonts.css";
import MaxLengthTextField from "./util/MaxLengthTextField";
import CustomAlert from "./custom-alert/CustomAlert";
import RoleAlert from "./custom-alert/RoleAlert";
import EventBar from "./event-bar/EventBar";

// TODO: replace constants with enums from types
import {
  PAGE,
  MAX_FAILED_CONNECTIONS,
  SERVER_ADDRESS_HTTP,
  NEW_LOBBY,
  CHECK_LOGIN,
  SERVER_ADDRESS,
  WEBSOCKET,
  PARAM_USERNAMES,
  LOBBY_CODE_LENGTH,
  PARAM_STATE,
  STATE_CHANCELLOR_NOMINATION,
  STATE_CHANCELLOR_VOTING,
  PARAM_PRESIDENT,
  STATE_LEGISLATIVE_PRESIDENT,
  STATE_LEGISLATIVE_CHANCELLOR,
  PARAM_PACKET_TYPE,
  PACKET_LOBBY,
  PACKET_GAME_STATE,
  PACKET_INVESTIGATION,
  PACKET_OK,
  STATE_SETUP,
  STATE_POST_LEGISLATIVE,
  STATE_LEGISLATIVE_PRESIDENT_VETO,
  STATE_PP_INVESTIGATE,
  STATE_PP_EXECUTION,
  STATE_PP_ELECTION,
  STATE_PP_PEEK,
  PLAYER_IS_ALIVE,
  PARAM_TARGET,
  STATE_FASCIST_VICTORY_ELECTION,
  STATE_FASCIST_VICTORY_POLICY,
  STATE_LIBERAL_VICTORY_EXECUTION,
  STATE_LIBERAL_VICTORY_POLICY,
  STATE_COMMUNIST_VICTORY_EXECUTION,
  STATE_COMMUNIST_VICTORY_POLICY,
  STATE_PP_BUGGING,
  STATE_CHANCELLOR_POWER_BUGGING,
  STATE_PP_GET_BUGGING_IDENTITY,
  STATE_CP_RADICALISATION,
  STATE_CP_RADICALISATION_ACCEPT_DENY,
  STATE_ANARCHIST_POWER_ASSASSINATION,
  STATE_FIVE_YEAR_PLAN,
  STATE_POLICY_REMOVAL,
  WEBSOCKET_HEADER,
  DEBUG,
  PACKET_PONG,
  PING_INTERVAL,
  SERVER_PING,
  PARAM_ICON,
  PARAM_INVESTIGATION,
  PACKET_BUGGING,
  PARAM_BUGGED,
  PARAM_ACCEPTED,
  STATE_CONGRESS,
  STATE_PP_CONFESSION,
  STATE_MONARCHIST_POWER_ELECTION,
  STATE_MONARCHIST_OPPOSITION_NOMINATION,
  STATE_MONARCHIST_ELECTION_VOTING,
  STATE_MONARCHIST_ELECTION_TIE,
} from "./constants";

import PlayerDisplay, {
  DISABLE_EXECUTED_PLAYERS,
  DISABLE_NONE,
} from "./player/PlayerDisplay";
import StatusBar from "./status-bar/StatusBar";
import Board from "./board/Board";
import VotingPrompt from "./custom-alert/VotingPrompt";
import AcceptDenyPrompt from "./custom-alert/AcceptDenyPrompt"
import PresidentLegislativePrompt from "./custom-alert/PresidentLegislativePrompt";
import ChancellorLegislativePrompt from "./custom-alert/ChancellorLegislativePrompt";
import VetoPrompt from "./custom-alert/VetoPrompt";
import ElectionTrackerAlert from "./custom-alert/ElectionTrackerAlert";
import PolicyEnactedAlert from "./custom-alert/PolicyEnactedAlert";
import {
  MonarchistPowerSelectPrompt,
  SelectAssassinationPrompt,
  SelectBuggingPrompt,
  SelectConfessionPrompt,
  SelectExecutionPrompt,
  SelectInvestigationPrompt,
  SelectNominationPrompt,
  SelectOppositionPrompt,
  SelectRadicalisationPrompt,
  SelectSpecialElectionPrompt,
} from "./custom-alert/SelectPlayerPrompt";
import ButtonPrompt from "./custom-alert/ButtonPrompt";
import PeekPrompt from "./custom-alert/PeekPrompt";
import InvestigationAlert from "./custom-alert/InvestigationAlert";
import Deck from "./board/Deck";
import PlayerPolicyStatus from "./util/PlayerPolicyStatus";

import VictoryFascistHeader from "./assets/victory-fascist-header.png";
import VictoryLiberalHeader from "./assets/victory-liberal-header.png";
import VictoryHeaderCommunist from "./assets/victory-communist-header.png";
import IconSelection from "./custom-alert/IconSelection";
import HelmetMetaData from "./util/HelmetMetaData";
import { defaultPortrait } from "./assets";
import Player from "./player/Player";
import LoginPageContent from "./LoginPageContent";
import Cookies from "js-cookie";
import AnnouncementBox from "./util/AnnouncementBox";
import {
  GameState,
  LobbyState,
  PolicyType,
  Role,
  ServerRequestPayload,
  WSCommand,
  WSCommandType,
} from "./types";
import GetBuggingIdentityPromt from "./custom-alert/GetBuggingIdentityPrompt";

const EVENT_BAR_FADE_OUT_DURATION = 500;
const CUSTOM_ALERT_FADE_DURATION = 1000;

const DEFAULT_GAME_STATE: GameState = {
  liberalPolicies: 0,
  fascistPolicies: 0,
  communistPolicies: 0,
  discardSize: 0,
  drawSize: 17,
  players: {},
  playerOrder: [],
  state: LobbyState.SETUP,
  president: "",
  chancellor: "",
  electionTracker: 0,
  vetoOccurred: false,
  lastState: LobbyState.SETUP,
  lastChancellor: "",
  lastPresident: "",
  electionTrackerAdvanced: false,
  userVotes: {},
  presidentChoices: [],
  chancellorChoices: [],
  targetUser: "",
  lastPolicy: "",
  peek: [],
  icon: {},
  doesAnarchistKnowCommunists: false,
  vetoList: [],
  vetoRemaining: 3,
  isExpansionGame: false,
  numCommunist: 0,
  numFascist: 0,
  numLiberal: 0,
  hasAnarchist: false,
  hasMonarchist: false,
  communist1: "",
  communist2: "",
  radicalisationSuccess: false,
  policyRemoved: undefined,
  anarchist: "",
  monarchist: "",
  usedAnarchistPower: true,
  policyRemovedPlace: [-1, -1, -1],
  antiPolicyPlace: [-1, -1, -1],
  monarchistCandidate: "",
  opposition: "",
};

const COOKIE_NAME = "name";
const COOKIE_LOBBY = "lobby";

if (DEBUG) {
  console.warn("Running in debug mode.");
}

// TODO: Turn App into a functional component
// TODO: Refactor out pages into separate components
// TODO: Refactor out AnimationQueue

// TODO: Remove this type and replace with actual state variables.
type AppState = {
  page: PAGE;
  joinName: string;
  joinLobby: string;
  joinError: string;
  createLobbyName: string;
  createLobbyError: string;
  name: string;
  lobby: string;
  lobbyFromURL: boolean;
  usernames: string[];
  icons: { [key: string]: string };
  gameState: GameState;
  /* Stores the last gameState[PARAM_STATE] value to check for changes. */
  lastState: any;
  liberalPolicies: number;
  fascistPolicies: number;
  communistPolicies: number;
  /*The position of the election tracker, ranging from 0 to 3.*/
  electionTracker: number;
  showVotes: boolean;
  drawDeckSize: number;
  discardDeckSize: number;
  snackbarMessage: string;
  showAlert: boolean;
  alertContent: JSX.Element;
  showEventBar: boolean;
  eventBarMessage: string;
  statusBarText: string;
  allAnimationsFinished: boolean;
};

const defaultAppState: AppState = {
  page: PAGE.LOGIN,
  joinName: "",
  joinLobby: "",
  joinError: "",
  createLobbyName: "",
  createLobbyError: "",
  name: "P1",
  lobby: "AAAAAA",
  lobbyFromURL: false,
  usernames: [],
  icons: {},
  gameState: DEFAULT_GAME_STATE,
  lastState: {},
  liberalPolicies: 0,
  fascistPolicies: 0,
  communistPolicies: 0,
  electionTracker: 0,
  showVotes: false,
  drawDeckSize: 17,
  discardDeckSize: 0,
  snackbarMessage: "",
  showAlert: false,
  alertContent: <div />,
  showEventBar: false,
  eventBarMessage: "",
  statusBarText: "---",
  allAnimationsFinished: true,
};

class App extends Component<{}, AppState> {
  websocket?: WebSocket = undefined;
  failedConnections: number = 0;
  pingInterval?: NodeJS.Timeout = undefined;
  reconnectOnConnectionClosed: boolean = true;
  snackbarMessages: number = 0;
  animationQueue: (() => void)[] = [];
  okMessageListeners: (() => void)[] = [];
  allAnimationsFinished: boolean = true;
  gameOver: boolean = false;

  // noinspection DuplicatedCode
  constructor(props: any) {
    super(props);

    let name = Cookies.get(COOKIE_NAME) ? Cookies.get(COOKIE_NAME) : "";
    let lobby = Cookies.get(COOKIE_LOBBY) ? Cookies.get(COOKIE_LOBBY) : "";

    this.state = {
      ...defaultAppState,
      joinName: name || "",
      joinLobby: lobby || "",
      createLobbyName: name || "",
    };

    // The website uses Google Analytics!
    ReactGA.initialize("UA-166327773-1");
    ReactGA.pageview("/");

    // These are necessary for handling class fields safely (ex: websocket)
    this.onWebSocketClose = this.onWebSocketClose.bind(this);
    this.tryOpenWebSocket = this.tryOpenWebSocket.bind(this);
    this.onClickLeaveLobby = this.onClickLeaveLobby.bind(this);
    this.onClickCopy = this.onClickCopy.bind(this);
    this.onClickStartGame = this.onClickStartGame.bind(this);
    this.onClickStartCommunistExpansionGame = this.onClickStartCommunistExpansionGame.bind(this);
    this.sendWSCommand = this.sendWSCommand.bind(this);
    this.showSnackBar = this.showSnackBar.bind(this);
    this.onAnimationFinish = this.onAnimationFinish.bind(this);
    this.onGameStateChanged = this.onGameStateChanged.bind(this);
    this.hideAlertAndFinish = this.hideAlertAndFinish.bind(this);
    this.addAnimationToQueue = this.addAnimationToQueue.bind(this);
    this.clearAnimationQueue = this.clearAnimationQueue.bind(this);
    this.queueAlert = this.queueAlert.bind(this);
    this.showChangeIconAlert = this.showChangeIconAlert.bind(this);
    this.updateChangeIconAlert = this.updateChangeIconAlert.bind(this);
    this.onClickChangeIcon = this.onClickChangeIcon.bind(this);

    // Ping the server to wake it up if it's not currently being used
    // This reduces the delay users experience when starting lobbies
    fetch(SERVER_ADDRESS_HTTP + SERVER_PING);
  }

  /////////// Server Communication
  // <editor-fold desc="Server Communication">

  /**
   * Attempts to request the server to create a new lobby and returns the response.
   * @return {Promise<Response>}
   */
  async tryCreateLobby() {
    return fetch(SERVER_ADDRESS_HTTP + NEW_LOBBY);
  }

  /**
   * Checks if the login is valid.
   * @param name the name of the user.
   * @param lobby the lobby code.
   * @return {Promise<Response>} The response from the server.
   */
  async tryLogin(name: string, lobby: string) {
    ReactGA.event({
      category: "Login Attempt",
      action: "User attempted to provide login credentials to the server.",
    });
    return await fetch(
      SERVER_ADDRESS_HTTP +
        CHECK_LOGIN +
        "?name=" +
        encodeURI(name) +
        "&lobby=" +
        encodeURI(lobby)
    );
  }

  /**
   * Attempts to open a WebSocket with the server.
   * @param name the name of the user to connect with.
   * @param lobby the lobby to connect with.
   * @effects If a connection was successfully established, sets the state with the {@code name}, {@code lobby},
   *          and {@code ws} parameters. The WebSocket has a message callback to this.onWebSocketMessage().
   * @return {boolean} true if the connection was opened successfully. Otherwise, returns false.
   */
  tryOpenWebSocket(name: string, lobby: string) {
    if (DEBUG) {
      console.log("Opening connection with lobby: " + lobby);
      console.log("Failed connections: " + this.failedConnections);
    }
    let url =
      WEBSOCKET_HEADER +
      SERVER_ADDRESS +
      WEBSOCKET +
      "?name=" +
      encodeURIComponent(name) +
      "&lobby=" +
      encodeURIComponent(lobby);
    if (DEBUG) {
      console.trace("TryOpenWebsocket URL: " + url);
    }

    // Close existing websocket
    if (this.websocket) {
      // Clear onClose event to prevent reconnection
      this.websocket.onclose = () => {};
      this.websocket.close();
      this.websocket = undefined;
    }

    let ws = new WebSocket(url);
    if (ws.OPEN) {
      console.log("Websocket opened successfully to " + url);
      this.websocket = ws;
      this.reconnectOnConnectionClosed = true;
      // Only move the player to the lobby page if they were logging in.
      // This is to prevent the bug where players flash in/out of the lobby page
      // at random points in the game.
      if (this.state.page === PAGE.LOGIN) {
        this.setState({ page: PAGE.LOBBY });
      }
      this.setState({
        name: name,
        lobby: lobby,
        usernames: [],
        joinName: "",
        joinLobby: "",
        joinError: "",
        createLobbyName: "",
        createLobbyError: "",
      });
      ws.onmessage = (msg) => this.onWebSocketMessage(msg);
      ws.onclose = () => this.onWebSocketClose();

      // Ping the web server at a set interval.
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
      }
      this.pingInterval = setInterval(() => {
        this.sendWSCommand({ command: WSCommandType.PING });
      }, PING_INTERVAL);

      return true;
    } else {
      return false;
    }
  }

  /**
   * Called when the websocket closes.
   * @effects attempts to reopen the websocket connection.
   *          If the user pressed the "Leave Lobby" button or a maximum number of attempts has been reached
   *          ({@code MAX_FAILED_CONNECTIONS}), does not reopen the websocket connection and returns the user to the
   *          login screen with a relevant error message.
   */
  onWebSocketClose() {
    // Clear the server ping interval when the socket is closed.
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    console.log(
      "A websocket closed: " +
        this.websocket?.url +
        ". Reopening to current lobby " +
        this.state.lobby
    );
    //

    if (
      this.reconnectOnConnectionClosed &&
      this.failedConnections < MAX_FAILED_CONNECTIONS
    ) {
      if (this.failedConnections >= 1) {
        // Only show the error bar if the first attempt has failed.
        this.showSnackBar("Lost connection to the server: retrying...");
        ReactGA.event({
          category: "Lost Server Connection",
          action: "User lost connection to the server. (>1 attempts)",
        });
      }
      this.failedConnections += 1;
      this.tryOpenWebSocket(this.state.name, this.state.lobby);
    } else if (this.reconnectOnConnectionClosed) {
      if (DEBUG) {
        console.log("Disconnecting from lobby.");
      }
      this.setState({
        joinName: this.state.name,
        joinLobby: this.state.lobby,
        joinError: "Disconnected from the lobby.",
        page: PAGE.LOGIN,
      });
      ReactGA.event({
        category: "Lost Server Connection (Terminal)",
        action:
          "User was unable to reconnect to the server. (max attempts reached)",
      });
      this.clearAnimationQueue();
    } else {
      // User purposefully closed the connection.
      if (this.gameOver) {
        // Do not reopen if the game is over, since disconnecting is intentional.
      } else {
        this.setState({
          page: PAGE.LOGIN,
          joinName: this.state.name,
          joinLobby: this.state.lobby,
          joinError: "",
        });
        this.clearAnimationQueue();
      }
    }
  }

  async onWebSocketMessage(msg: MessageEvent) {
    this.failedConnections = 0;
    let message = JSON.parse(msg.data);
    console.log(JSON.stringify(message));
    // Decode message contents as communication is encoded
    if (DEBUG) {
      console.log(JSON.stringify(message));
    }
    switch (message[PARAM_PACKET_TYPE]) {
      case PACKET_LOBBY:
        this.setState({
          usernames: message[PARAM_USERNAMES],
          icons: message[PARAM_ICON],
          page: PAGE.LOBBY,
        });
        if (message[PARAM_ICON][this.state.name] === defaultPortrait) {
          this.showChangeIconAlert();
        }
        this.updateChangeIconAlert();
        break;

      case PACKET_GAME_STATE:
        if (message !== this.state.gameState) {
          this.onGameStateChanged(message);
        }
        this.setState({ gameState: message, page: PAGE.GAME });
        break;

      case PACKET_OK: // Traverse all listeners and call the functions.
        let i = 0;
        for (i; i < this.okMessageListeners.length && i < 1; i++) {
          this.okMessageListeners[i]();
        }
        this.okMessageListeners = []; // clear all listeners.
        break;

      case PACKET_INVESTIGATION:
        // Trigger investigation screen when the server responds.
        console.log(
          "Investigated player role: " + message[PARAM_INVESTIGATION]
        );
        // Set party to liberal/fascist/communist using sent packet
        const party = message[PARAM_INVESTIGATION];

        this.queueAlert(
          <InvestigationAlert
            party={party}
            target={message[PARAM_TARGET]}
            hideAlert={this.hideAlertAndFinish}
          />,
          false
        );
        break;
      case PACKET_BUGGING:
        console.log(
          "Bugged player role: " + message[PARAM_BUGGED]
        );
        const accepted = message[PARAM_ACCEPTED];
        if(accepted === true){
          // Set party to liberal/fascist/communist using sent packet
          const partyMembership = message[PARAM_BUGGED];
          this.queueAlert(
            <InvestigationAlert
              party={partyMembership}
              target={message[PARAM_TARGET]}
              hideAlert={this.hideAlertAndFinish}
            />,
            false
          );
        }
        break;
      case PACKET_PONG:
      default:
      // No action
    }
  }

  /**
   * Sends a specified command to the server.
   * @param command the String command label.
   * @param params a dictionary of any parameters that need to be provided with the command.
   * @effects sends a message to the server with the following parameters:
   *          {@code PARAM_COMMAND}: {@code command}
   *          {@code PARAM_LOBBY}: {@code this.state.lobby}
   *          {@code PARAM_NAME}: {@code this.state.name}
   *          and each (key, value) pair in {@code params}.
   */
  sendWSCommand(request: ServerRequestPayload) {
    // Do not need to encode name + lobby because this is sent through websocket
    const data: WSCommand = {
      ...request,
      name: this.state.name,
      lobby: this.state.lobby,
    };

    if (DEBUG) {
      console.log(JSON.stringify(data));
    }
    if (this.websocket !== undefined) {
      this.websocket.send(JSON.stringify(data));
    } else {
      this.showSnackBar(
        "Could not connect to the server. Try refreshing the page if this happens again."
      );
    }
  }

  //</editor-fold>

  /////////////////// Login Page
  // <editor-fold desc="Login Page">

  /**
   * Updates the "Name" field under Join Game.
   * @param text the text to update the text field to.
   */
  updateJoinName = (text: string) => {
    this.setState({
      joinName: text,
    });
  };

  /**
   * Updates the Lobby field under Join Game.
   * @param text the text to update the text field to.
   */
  updateJoinLobby = (text: string) => {
    this.setState({
      joinLobby: text,
    });
  };

  /**
   * Updates the Name field under Create Lobby.
   * @param text the text to update the text field to.
   */
  updateCreateLobbyName = (text: string) => {
    this.setState({
      createLobbyName: text,
    });
  };

  shouldJoinButtonBeEnabled() {
    return (
      this.state.joinLobby.length === LOBBY_CODE_LENGTH &&
      this.state.joinName.length !== 0
    );
  }

  shouldCreateLobbyButtonBeEnabled() {
    return this.state.createLobbyName.length !== 0;
  }

  /**
   * Attempts to connect to the lobby via websocket.
   */
  onClickJoin = () => {
    this.setState({ joinError: "Connecting..." });
    this.tryLogin(this.state.joinName, this.state.joinLobby)
      .then((response) => {
        if (!response.ok) {
          if (DEBUG) {
            console.log("Response is not ok");
          }
          if (response.status === 404) {
            this.setState({ joinError: "The lobby could not be found." });
            ReactGA.event({
              category: "Login Failed",
              action: "Lobby not found - User unable to connect.",
            });
          } else if (response.status === 403) {
            this.setState({
              joinError:
                "There is already a user with the name '" +
                this.state.joinName +
                "' in the lobby.",
            });
            ReactGA.event({
              category: "Login Failed",
              action: "Duplicate name - User unable to connect.",
            });
          } else if (response.status === 488) {
            this.setState({ joinError: "The lobby is currently in a game." });
            ReactGA.event({
              category: "Login Failed",
              action: "Ongoing game - User unable to connect.",
            });
          } else if (response.status === 489) {
            this.setState({ joinError: "The lobby is currently full." });
            ReactGA.event({
              category: "Login Failed",
              action: "Lobby full - User unable to connect.",
            });
          } else {
            this.setState({
              joinError:
                "There was an error connecting to the server. Please try again.",
            });
            ReactGA.event({
              category: "Login Failed",
              action: "Misc - User was unable to connect.",
            });
          }
        } else {
          // Username and lobby were verified. Try to open websocket.
          if (
            !this.tryOpenWebSocket(this.state.joinName, this.state.joinLobby)
          ) {
            this.setState({
              joinError:
                "There was an error connecting to the server. Please try again.",
            });
          } else {
            // Save the username and lobby login
            Cookies.set(COOKIE_NAME, this.state.name, { expires: 7 });
            Cookies.set(COOKIE_LOBBY, this.state.joinLobby);
          }
        }
      })
      .catch(() => {
        this.setState({
          joinError:
            "There was an error contacting the server. Please wait and try again.",
        });
      });
  };

  /**
   * Attempts to connect to the server and create a new lobby, and then opens a connection to the lobby.
   */
  onClickCreateLobby = () => {
    this.setState({ createLobbyError: "Connecting..." });
    this.tryCreateLobby()
      .then((response) => {
        if (response.ok) {
          response.text().then((lobbyCode) => {
            if (!this.tryOpenWebSocket(this.state.createLobbyName, lobbyCode)) {
              // if the connection failed
              this.setState({
                createLobbyError:
                  "There was an error connecting to the server. Please try again.",
              });
              ReactGA.event({
                category: "Lobby Creation Failed",
                action: "Failed to create a new lobby.",
              });
            } else {
              ReactGA.event({
                category: "Lobby Created",
                action: "Successfully created new lobby.",
              });
              // Save the username and lobby login
              Cookies.set(COOKIE_NAME, this.state.name, { expires: 7 });
              Cookies.set(COOKIE_LOBBY, lobbyCode);
            }
          });
        } else {
          this.setState({
            createLobbyError:
              "There was an error connecting to the server. Please try again.",
          });
          ReactGA.event({
            category: "Lobby Creation Failed",
            action: "Failed to create a new lobby.",
          });
        }
      })
      .catch(() => {
        this.setState({
          createLobbyError:
            "There was an error connecting to the server. Please try again.",
        });
        ReactGA.event({
          category: "Lobby Creation Failed",
          action: "Failed to create a new lobby.",
        });
      });
  };

  renderLoginPage() {
    return (
      <div className="App">
        <header className="App-header">SECRET-HITLER.ORG</header>
        <br />
        <div style={{ textAlign: "center" }}>
          {/** TODO: Add reusable announcement component. 
                    <div style={{backgroundColor: "#222222", width: "50vmin", margin: "0 auto", padding: "20px"}}>
                        <p>
                            Hello! Secret Hitler Org is currently undergoing some maintenance.
                            Sorry for the interruption and please check back in in a few hours! -Shrimp
                        </p>
                        <p style={{fontStyle: "italic", fontSize: "calc(8px + 1vmin)"}}>(DATE TIME PM PT)</p>

                    </div>
                    */}
          <h2>JOIN A GAME</h2>
          <MaxLengthTextField
            label={"Lobby"}
            onChange={this.updateJoinLobby}
            value={this.state.joinLobby}
            maxLength={LOBBY_CODE_LENGTH}
            showCharCount={false}
            forceUpperCase={true}
          />

          <MaxLengthTextField
            label={"Your Name"}
            onChange={this.updateJoinName}
            value={this.state.joinName}
            maxLength={12}
          />
          <p id={"errormessage"}>{this.state.joinError}</p>
          <button
            onClick={this.onClickJoin}
            disabled={!this.shouldJoinButtonBeEnabled()}
          >
            JOIN
          </button>
        </div>
        <br />
        <div>
          <h2>CREATE A LOBBY</h2>
          <MaxLengthTextField
            label={"Your Name"}
            onChange={this.updateCreateLobbyName}
            value={this.state.createLobbyName}
            maxLength={12}
          />
          <p id={"errormessage"}>{this.state.createLobbyError}</p>
          <button
            onClick={this.onClickCreateLobby}
            disabled={!this.shouldCreateLobbyButtonBeEnabled()}
          >
            CREATE LOBBY
          </button>
        </div>
        <AnnouncementBox>
          <h2>Announcing: BOTS!</h2>
          <p>
            You can now start games with only 1-4 players; extra spots will be
            filled by bots.
          </p>
          <p>
            Bots are still in beta, so{" "}
            <a
              href={
                "https://github.com/ShrimpCryptid/Secret-Hitler-Online/issues/44"
              }
              target={"_blank"}
              rel="noreferrer"
            >
              leave feedback on GitHub!
            </a>
          </p>
          <p style={{ fontStyle: "italic", fontSize: "calc(8px + 1vmin)" }}>
            (Please be nice, they are trying their best.)
          </p>
        </AnnouncementBox>
        <br />
        <LoginPageContent />
      </div>
    );
  }

  //</editor-fold>

  /////////////////// Lobby Page
  //<editor-fold desc="Lobby Page">

  /**
   * Renders the playerlist as a sequence of paragraph tags.
   * Written as "{@literal <p>} - {@code username} {@literal </p>}".
   */
  renderPlayerList() {
    return this.state.usernames.map((name: string, i: number) => {
      return (
        <Player
          key={i}
          name={i === 0 ? name + "[VIP]" : name}
          showRole={false}
          icon={this.state.icons[name]}
          isBusy={this.state.icons[name] === defaultPortrait}
          highlight={name === this.state.name}
        />
      );
    });
  }

  onClickChangeIcon() {
    this.showChangeIconAlert();
  }

  updateChangeIconAlert() {
    this.setState({
      alertContent: (
        <IconSelection
          onConfirm={() => {
            this.clearAnimationQueue();
            this.hideAlertAndFinish();
          }}
          sendWSCommand={this.sendWSCommand}
          playerToIcon={this.state.icons}
          players={this.state.usernames}
          user={this.state.name}
          onClickTweet={() => {
            ReactGA.event({ category: "Sharing", action: "User shared tweet" });
          }}
        />
      ),
    });
  }

  showChangeIconAlert() {
    this.queueAlert(<div />, false); // false here prevents dialog from closing when server confirms selection
    this.updateChangeIconAlert();
  }

  /**
   * Determines whether the 'Start Game' button in the lobby should be enabled.
   */
  shouldStartGameBeEnabled() {
    // Verify that all players have icons
    for (let i = 0; i < this.state.usernames.length; i++) {
      if (this.state.icons[this.state.usernames[i]] === defaultPortrait) {
        return false;
      }
    }
    return this.state.usernames.length <= 10;
  }

  /**
   * Determines whether the 'Start Expansion Game' button in the lobby should be enabled.
   */
  shouldStartExpansionGameBeEnabled() {
    // Verify that all players have icons
    for (let i = 0; i < this.state.usernames.length; i++) {
      if (this.state.icons[this.state.usernames[i]] === defaultPortrait) {
        return false;
      }
    }
    return this.state.usernames.length >= 3 && this.state.usernames.length <= 15;
  }

  /**
   * Contacts the server and requests to start the game.
   */
  onClickStartGame() {
    ReactGA.event({
      category: "Starting Game",
      action: this.state.usernames.length + " players started game.",
    });
    this.sendWSCommand({ command: WSCommandType.START_GAME });
  }

  /**
     * Contacts the server and requests to start of communist expansion game.
     */
    onClickStartCommunistExpansionGame() {
      ReactGA.event({
        category: "Starting Game",
        action: this.state.usernames.length + " players started game.",
      });
      this.sendWSCommand({ command: WSCommandType.START_COMMUNIST_EXPANSION_GAME });
    }

  onClickLeaveLobby() {
    this.websocket?.close();
    this.reconnectOnConnectionClosed = false;
  }

  onClickCopy() {
    const text = document.getElementById("linkText");
    if (text === null) {
      return;
    }
    (text as HTMLTextAreaElement).select();
    (text as HTMLTextAreaElement).setSelectionRange(0, 999999);
    document.execCommand("copy");
    this.showSnackBar("Copied!");
  }

  showSnackBar(message: string) {
    this.setState({ snackbarMessage: message });
    let snackbar = document.getElementById("snackbar");
    if (snackbar === null) {
      return;
    }
    snackbar.className = "show";
    this.snackbarMessages++;
    setTimeout(() => {
      this.snackbarMessages--;
      if (this.snackbarMessages === 0) {
        snackbar!.className = snackbar!.className.replace("show", "");
      }
    }, 3000);
  }

  renderLobbyPage() {
    // The first player in the lobby is counted as the VIP.
    let isVIP =
      this.state.usernames.length > 0 &&
      this.state.usernames[0] === this.state.name;
    return (
      <div className="App">
        <header className="App-header">SECRET-HITLER.ORG</header>

        <CustomAlert show={this.state.showAlert}>
          {this.state.alertContent}
        </CustomAlert>

        <div
          style={{ textAlign: "left", marginLeft: "20px", marginRight: "20px" }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h2>LOBBY CODE: </h2>
            <h2
              style={{ marginLeft: "5px", color: "var(--textColorHighlight)" }}
            >
              {this.state.lobby}
            </h2>
          </div>

          <p style={{ marginBottom: "2px" }}>
            Copy and share this link to invite other players.
          </p>
          <div
            style={{
              textAlign: "left",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <textarea
              id="linkText"
              readOnly={true}
              value={"https://secret-hitler.org/?lobby=" + this.state.lobby}
            />
            <button onClick={this.onClickCopy}>COPY</button>
          </div>

          <div id={"lobby-lower-container"}>
            <div id={"lobby-player-area-container"}>
              <div id={"lobby-player-text-choose-container"}>
                <p id={"lobby-player-count-text"}>
                  Players ({this.state.usernames.length}/10)
                </p>
                <button
                  id={"lobby-change-icon-button"}
                  onClick={this.onClickChangeIcon}
                >
                  CHANGE ICON
                </button>
              </div>
              <div id={"lobby-player-container"}>{this.renderPlayerList()}</div>
            </div>

            <div id={"lobby-button-container"}>
              {!isVIP && (
                <p id={"lobby-vip-text"}>Only the VIP can start the game.</p>
              )}
              <button
                onClick={this.onClickStartGame}
                disabled={!isVIP || !this.shouldStartGameBeEnabled()}
              >
                START GAME
              </button>
              <button
                onClick={this.onClickStartCommunistExpansionGame}
                disabled={!isVIP || !this.shouldStartExpansionGameBeEnabled()}
              >
                COMMUNIST EXPANSION GAME
              </button>
              <button onClick={this.onClickLeaveLobby}>LEAVE LOBBY</button>
            </div>
            <div id={"lobby-text-container"}>
              <p id={"lobby-about-text"}>
                <a
                  href={
                    "https://github.com/ShrimpCryptid/Secret-Hitler-Online/blob/main/README.md"
                  }
                  target={"_blank"}
                  rel="noopener noreferrer"
                >
                  About this project
                </a>
              </p>
              <br />
              <p id={"lobby-warning-text"}>
                You can report bugs on the{" "}
                <a
                  href={
                    "https://github.com/ShrimpCryptid/Secret-Hitler-Online/issues"
                  }
                  rel="noopener noreferrer"
                  target={"_blank"}
                >
                  Issues page.
                </a>
              </p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div id="snackbar">{this.state.snackbarMessage}</div>
        </div>
      </div>
    );
  }

  //</editor-fold>

  /////////////////// Game Page
  //<editor-fold desc="Game Page">

  showExecutionResults(name: string, newState: GameState): void {
    if (name === newState.targetUser) {
      this.queueAlert(
        <ButtonPrompt
          label={"YOU HAVE BEEN EXECUTED"}
          headerText={
            "Executed players may not speak, vote, or run for office. You should not reveal your identity to the group."
          }
          buttonOnClick={this.hideAlertAndFinish}
        />,
        false
      );
    } else {
      this.queueAlert(
        <ButtonPrompt
          label={"EXECUTION RESULTS"}
          footerText={
            newState.targetUser +
            " has been executed. They may no longer speak, vote, or run for office."
          }
          buttonOnClick={this.hideAlertAndFinish}
          buttonText={"OKAY"}
        >
          <PlayerDisplay
            user={name}
            gameState={newState}
            showRoles={false}
            playerDisabledFilter={DISABLE_EXECUTED_PLAYERS}
            players={[newState.targetUser!]}
          />
        </ButtonPrompt>,
        false
      );
    }
  }

  revealIdentity(name: string, revealName: string, newState: GameState): void {
    this.queueAlert(
      <ButtonPrompt
          label={"SPECIAL POWER"}
          footerText={
            revealName +
            " has decide to reveal their identity and use their special power."
          }
          buttonOnClick={this.hideAlertAndFinish}
          buttonText={"OKAY"}
        >
          <PlayerDisplay
            user={name}
            gameState={newState}
            showRoles={true}
            playerDisabledFilter={DISABLE_EXECUTED_PLAYERS}
            players={[revealName]}
          />
      </ButtonPrompt>,
      false
    );
  }

  /**
   * Queues animations for when the game state has changed.
   * @param newState {Object} the new game state sent from the server.
   */
  onGameStateChanged(newState: GameState) {
    let oldState = this.state.gameState;
    let name = this.state.name;
    let isPresident = this.state.name === newState.president;
    let isChancellor = this.state.name === newState.chancellor;
    let state = newState.state;

    // If last state was setup, which indicates that the client is re-entering the game or starting the game, then
    // we set the card count, liberal/fascist policy count, and the tracker.
    if (
      oldState.hasOwnProperty(PARAM_STATE) &&
      oldState[PARAM_STATE] === STATE_SETUP
    ) {
      this.setState({
        liberalPolicies: newState.liberalPolicies,
        fascistPolicies: newState.fascistPolicies,
        electionTracker: newState.electionTracker,
        drawDeckSize: newState.drawSize,
        discardDeckSize: newState.discardSize,
      });
    }

    // Check for changes in enacted policies and election tracker.
    const statesToShowPolicyFor = [
      LobbyState.POST_LEGISLATIVE,
      LobbyState.PP_INVESTIGATE,
      LobbyState.PP_EXECUTION,
      LobbyState.PP_ELECTION,
      LobbyState.PP_PEEK,
      LobbyState.PP_BUGGING,
      LobbyState.CHANCELLOR_POWER_BUGGING,
      LobbyState.FASCIST_VICTORY_POLICY,
      LobbyState.LIBERAL_VICTORY_POLICY,
      LobbyState.COMMUNIST_VICTORY_POLICY,
    ];
    if (statesToShowPolicyFor.includes(state)) {
      // Check if the election tracker changed positions.
      if (newState.electionTracker !== this.state.gameState.electionTracker) {
        let newPos = newState.electionTracker;
        let advancedToThree = newPos === 0 && newState.electionTrackerAdvanced;
        // We ignore all resets to 0, unless that reset was caused by the election tracker reaching 3.
        if (newPos !== 0 || advancedToThree) {
          // If the last phase was voting, we failed due to voting. Therefore, show votes.
          if (oldState[PARAM_STATE] === STATE_CHANCELLOR_VOTING) {
            //this.queueAlert(<RoleAlert onClick={this.hideAlertAndFinish} />);
            this.addAnimationToQueue(() => this.showVotes(newState));
          }

          let trackerPosition = newPos;
          if (advancedToThree) {
            // If the tracker was reset because it advanced to 3, show it moving to 3 in the dialog box.
            trackerPosition = 3;
          }
          this.queueAlert(
            <ElectionTrackerAlert
              trackerPosition={trackerPosition}
              closeAlert={this.hideAlertAndFinish}
            />
          );
        }
      }

      let liberalChanged =
        newState.liberalPolicies !== oldState.liberalPolicies;
      let fascistChanged =
        newState.fascistPolicies !== oldState.fascistPolicies;
      let communistChanged =
        newState.communistPolicies !== oldState.communistPolicies;

      if (liberalChanged || fascistChanged || communistChanged) {
        // Show an alert with the new policy
        this.queueAlert(
          <PolicyEnactedAlert
            hideAlert={this.hideAlertAndFinish}
            policyType={newState.lastPolicy}
          />
        );
      }

      // Update the decks, board with the new policies / election tracker.
      this.addAnimationToQueue(() => {
        this.setState({
          liberalPolicies: newState.liberalPolicies,
          fascistPolicies: newState.fascistPolicies,
          communistPolicies: newState.communistPolicies,
          electionTracker: newState.electionTracker,
        });
        setTimeout(() => this.onAnimationFinish(), 500);
      });
    }

    // Check for state change
    if (newState[PARAM_STATE] !== this.state.gameState[PARAM_STATE]) {
      JSON.stringify(newState);
      // state has changed
      switch (newState[PARAM_STATE]) {
        case STATE_CHANCELLOR_NOMINATION:
          if (
            newState.electionTracker === 0 &&
            newState.liberalPolicies === 0 &&
            newState.fascistPolicies === 0 &&
            newState.communistPolicies === 0
          ) {
            // If the game has just started (everything in default state), show the player's role.
            this.queueAlert(
              <RoleAlert
                role={newState.players[this.state.name].id}
                gameState={newState}
                name={name}
                onClick={() => {
                  this.hideAlertAndFinish();
                }}
              />,
              false
            );
          }

          this.queueEventUpdate("CHANCELLOR NOMINATION");
          this.queueStatusMessage(
            "Waiting for president to nominate a chancellor."
          );

          if (isPresident) {
            //Show the chancellor nomination window.
            this.queueAlert(
              SelectNominationPrompt(name, newState, this.sendWSCommand)
            );
          }

          break;

        case STATE_MONARCHIST_ELECTION_VOTING:
        case STATE_CHANCELLOR_VOTING:
          this.setState({ statusBarText: "" });
          this.queueEventUpdate("VOTING");
          this.queueStatusMessage("Waiting for all players to vote.");
          // Check if the player is dead or has already voted-- if so, do not show the voting prompt.
          if (
            newState.players[name][PLAYER_IS_ALIVE] &&
            !Object.keys(newState.userVotes).includes(name)
          ) {
            this.queueAlert(
              <VotingPrompt
                gameState={newState}
                sendWSCommand={this.sendWSCommand}
                user={this.state.name}
              />,
              true
            );
          }
          break;

        case STATE_MONARCHIST_ELECTION_TIE:
          this.setState({ statusBarText: "" });
          this.queueEventUpdate("MONARCHIST ELECTION TIE");
          this.queueStatusMessage("Waiting for monarchist to have the final say.");
          // Only monarchist gets to vote in case of tie.
          if (
            newState.players[name][PLAYER_IS_ALIVE] &&
            !Object.keys(newState.userVotes).includes(name) &&
            name === newState.monarchist
          ) {
            this.queueAlert(
              <VotingPrompt
                gameState={newState}
                sendWSCommand={this.sendWSCommand}
                user={this.state.name}
              />,
              true
            );
          }
          break;

        case STATE_LEGISLATIVE_PRESIDENT:
          // The vote completed, so show the votes.
          this.addAnimationToQueue(() => this.showVotes(newState));
          this.queueEventUpdate("LEGISLATIVE SESSION");

          // TODO: Animate cards being pulled from the draw deck for all users.

          this.queueStatusMessage(
            "Waiting for the president to choose a policy to discard."
          );

          if (isPresident) {
            if (!newState.presidentChoices) {
              throw new Error("President choices not found.");
            }
            this.queueAlert(
              <PresidentLegislativePrompt
                policyOptions={newState.presidentChoices}
                sendWSCommand={this.sendWSCommand}
                isPresidentLegislative={true}
              />
            );
          }

          break;

        case STATE_LEGISLATIVE_CHANCELLOR:
          this.queueStatusMessage(
            "Waiting for the chancellor to choose a policy to enact."
          );
          if (isChancellor) {
            if (!newState.chancellorChoices) {
              throw new Error("Chancellor choices not found.");
            }
            this.queueAlert(
              <ChancellorLegislativePrompt
                fascistPolicies={newState.fascistPolicies}
                showError={(message: string) =>
                  this.setState({ snackbarMessage: message })
                }
                policyOptions={newState.chancellorChoices}
                sendWSCommand={this.sendWSCommand}
                // Disable if veto has already happened
                enableVeto={
                  newState.fascistPolicies === 5 && !newState.vetoOccurred
                }
              />
            );
          }
          break;

        case STATE_LEGISLATIVE_PRESIDENT_VETO:
          this.queueStatusMessage(
            "Chancellor has motioned to veto the agenda. Waiting for the president to decide."
          );
          if (isPresident) {
            this.queueAlert(
              <VetoPrompt
                sendWSCommand={this.sendWSCommand}
                electionTracker={newState.electionTracker}
              />,
              true
            );
          }
          break;

        case STATE_PP_PEEK:
          this.queueEventUpdate("PRESIDENTIAL POWER");
          if (isPresident) {
            if (!newState.peek) {
              throw new Error("Peek policies not found.");
            }
            this.queueAlert(
              <PeekPrompt
                policies={newState.peek}
                sendWSCommand={this.sendWSCommand}
                names={undefined}
                label={"PEEK"}
                hideAlert={undefined}
                text={"These are the next three policies in the draw deck."}
              />,
              true
            );
          } else {
            this.queueStatusMessage(
              "Peek: President is previewing the next 3 policies."
            );
          }
          break;
        
        case STATE_PP_ELECTION:
          this.queueEventUpdate("PRESIDENTIAL POWER");
          if (isPresident) {
            this.queueAlert(
              SelectSpecialElectionPrompt(name, newState, this.sendWSCommand)
            );
          } else {
            this.queueStatusMessage(
              "Special Election: President is choosing the next president."
            );
          }
          break;

        case STATE_PP_EXECUTION:
          this.queueEventUpdate("PRESIDENTIAL POWER");
          if (isPresident) {
            this.queueAlert(
              SelectExecutionPrompt(name, newState, this.sendWSCommand),
              true
            );
          } else {
            this.queueStatusMessage(
              "Execution: President is choosing a player to execute."
            );
          }
          break;

        case STATE_PP_INVESTIGATE:
          this.queueEventUpdate("PRESIDENTIAL POWER");
          if (isPresident) {
            this.queueAlert(
              SelectInvestigationPrompt(name, newState, this.sendWSCommand)
            );
          } else {
            this.queueStatusMessage(
              "Investigation: President is choosing a player to investigate."
            );
          }
          break;
        
        case STATE_PP_BUGGING:
          const buggingFooter = newState.lastState === STATE_CHANCELLOR_POWER_BUGGING
          ? "Previous bugging request on " + newState.targetUser + " was vetoed by the chancellor."
          : "";
          const buggingHeader = "Investigation: President, " + newState.president + ", is choosing a player for bugging. "
              + "Chancellor" + newState.chancellor + ", can either accept this request or deny, and he has upto " + newState.vetoRemaining + " vetoes. "
              + "If chancellor decides accept, first the chancellor and then the president will view the party membership"
              + " of the selected player.";

          this.queueEventUpdate("PRESIDENTIAL POWER");
          if (isPresident) {
            this.queueAlert(
              SelectBuggingPrompt(name, newState, this.sendWSCommand)
            );
          } else {
            this.queueAlert(
              <ButtonPrompt
                label={"BUGGING"}
                footerText={buggingFooter}
                headerText={buggingHeader}
                buttonOnClick={this.hideAlertAndFinish}
                buttonText={"OKAY"}
              >
              </ButtonPrompt>,
            );
          }
          break;
        
        case STATE_CHANCELLOR_POWER_BUGGING:
          this.queueEventUpdate("CHANCELLOR POWER");
          if(isChancellor){
            this.queueAlert(
              <AcceptDenyPrompt
                gameState={newState}
                sendWSCommand={this.sendWSCommand}
                user={this.state.name}
                targetName={this.state.gameState.targetUser!}
              />,
            )
          } else {
            this.queueStatusMessage(
              "Bugging: Chancellor is deciding if " + newState.targetUser + ", selected by the President, should be bugged. "
              + "Chancellor has upto " + newState.vetoRemaining + " vetoes remaining. "
              
            );
          }
          break;
        
        case STATE_PP_GET_BUGGING_IDENTITY:
          this.queueEventUpdate("PRESIDENT POWER");
          if(isPresident){
            this.queueAlert(
              <GetBuggingIdentityPromt
                target={newState.targetUser}
                sendWSCommand={this.sendWSCommand}
                chancellor={newState.chancellor}
              />,
            )
          } else {
            this.queueStatusMessage(
              "Bugging: Chancellor has viewed the party membership of the selected player."
              + "And now president is doing the same."
            );
          }
          break;

        case STATE_CP_RADICALISATION:
          this.queueEventUpdate("COMMUNIST POWER");
          if(name === newState.communist1){
            this.queueAlert(
              SelectRadicalisationPrompt(name, newState, this.sendWSCommand)
            );
          } else {
            this.queueStatusMessage(
              "Radicalisation: The communists are selecting the player to radicalise."
            );
          }
          break;

        case STATE_CP_RADICALISATION_ACCEPT_DENY:
          if(name === newState.communist2){
            this.queueAlert(
              <AcceptDenyPrompt
                gameState={newState}
                sendWSCommand={this.sendWSCommand}
                user={this.state.name}
                targetName={this.state.gameState.targetUser!}
              />,
            )
          } else if(name === newState.communist1){
            this.queueStatusMessage(
              "Your fellow communist is deciding to go ahead or veto the radicalisation choice."
            );
          }
          break;

        case STATE_ANARCHIST_POWER_ASSASSINATION:
          this.queueEventUpdate("ANARCHIST POWER");
          if(name === newState.anarchist){
            this.queueAlert(
              SelectAssassinationPrompt(name, newState, this.sendWSCommand),
              true
            );
          } else {
            this.queueStatusMessage(
              "Assassination: The anarchist now has the power to execute a player."
            );
            this.revealIdentity(name, newState.anarchist, newState);
          }
          break;
        
        case STATE_POLICY_REMOVAL:
          if(isPresident || isChancellor){
            if(newState.policyRemovalMap === undefined ||
              !Object.keys(newState.policyRemovalMap).includes(name))
            {
              if (!newState.peek) {
                throw new Error("Peek policies not found during policy removal state.");
              }
              this.queueAlert(
                <PresidentLegislativePrompt
                  policyOptions={newState.peek}
                  sendWSCommand={this.sendWSCommand}
                  isPresidentLegislative={false}
                />
              );
            }
          } else {
            this.queueStatusMessage(
              "Policy Removal: The president and the chancellor will both select a policy." 
              + "\nIf they select the same, it will be removed from the game."
            );
          }
          break;
        
        case STATE_PP_CONFESSION:
          this.queueEventUpdate("PRESIDENTIAL POWER");
          if (isPresident) {
            this.queueAlert(
              SelectConfessionPrompt(name, newState, this.sendWSCommand)
            );
          } else {
            this.queueStatusMessage(
              "Confession: President is choosing a player to execute and then "
              + " reveal that player's party membership to everyone."
            );
          }
          break;
        
        case STATE_MONARCHIST_POWER_ELECTION:
          this.queueEventUpdate("MONARCHIST POWER");
          if(newState.monarchist === name){
            this.queueAlert(
              MonarchistPowerSelectPrompt(name, newState, this.sendWSCommand),
            );
          } else {
            this.queueStatusMessage(
              "Special Election: Monarchist is deciding whether to use his power to call for special election."
            );
          }
          break;
        
        case STATE_MONARCHIST_OPPOSITION_NOMINATION:
          this.revealIdentity(name, newState.monarchist, newState);
          if(isPresident){
            this.queueAlert(
              SelectOppositionPrompt(name, newState, this.sendWSCommand),
            );
          } else {
            this.queueAlert(
              <ButtonPrompt
                  label={"SPECIAL POWER"}
                  footerText={
                    newState.monarchist +
                    " has decide to reveal their identity and use their special power."
                  }
                  buttonOnClick={this.hideAlertAndFinish}
                  buttonText={"OKAY"}
                >
                  <PlayerDisplay
                    user={name}
                    gameState={newState}
                    showRoles={true}
                    playerDisabledFilter={DISABLE_EXECUTED_PLAYERS}
                    players={[name]}
                  />
              </ButtonPrompt>,
              false
            );

            if(name !== newState.monarchist){
              let isTarget = newState.monarchistCandidate === name;
              let footerText = isTarget
                ? `You are selected as chancellor candidate by the monarchist. The President ${newState[PARAM_PRESIDENT]} will now pick an opposition candidate.`
                : `${newState.monarchistCandidate} is selected as candidate by the monarchist. The President ${newState[PARAM_PRESIDENT]} will now pick an opposition candidate.`;
              this.queueAlert(
                <ButtonPrompt
                  label={"MONARCHIST  SELECTION"}
                  footerText={footerText}
                  buttonOnClick={this.hideAlertAndFinish}
                  buttonText={"OKAY"}
                >
                  <PlayerDisplay
                    user={name}
                    gameState={newState}
                    showLabels={false}
                    players={[newState.monarchistCandidate!]}
                  />
                </ButtonPrompt>,
                true
              );
            }
          }
          break;
        
        case STATE_POST_LEGISLATIVE:
          // Show results of any special elections, executions, or investigations.
          switch (newState.lastState) {
            case STATE_PP_ELECTION:
              if (!isPresident) {
                console.log("Special Election Alert: " + newState.targetUser);
                this.queueAlert(
                  <ButtonPrompt
                    label={"SPECIAL ELECTION"}
                    footerText={
                      newState[PARAM_PRESIDENT] +
                      " has chosen " +
                      newState.targetUser +
                      " to be the next president." +
                      "\nThe normal presidential order will resume after the next round."
                    }
                    buttonText={"OKAY"}
                    buttonOnClick={this.hideAlertAndFinish}
                  >
                    <PlayerDisplay
                      user={name}
                      gameState={newState}
                      showLabels={false}
                      players={[newState.targetUser!]}
                    />
                  </ButtonPrompt>,
                  false
                );
              }
              break;
            case STATE_PP_EXECUTION:
              // If player was executed
              this.showExecutionResults(name, newState);
              break;

            case STATE_ANARCHIST_POWER_ASSASSINATION:
              this.showExecutionResults(name, newState);
              break;
            
            case STATE_PP_CONFESSION:
              this.showExecutionResults(name, newState);
              const role = newState.players[name].id;
              let party = "LIBERAL";
              if (role === Role.COMMUNIST || role === Role.ANARCHIST){
                party = "COMMUNIST";
              } else if(role === Role.FASCIST || role === Role.HITLER || role === Role.MONARCHIST){
                party = "FASCIST";
              }

              this.queueAlert(
                <InvestigationAlert
                  party={party}
                  target={newState.targetUser}
                  hideAlert={this.hideAlertAndFinish}
                />,
                false
              );
              break;

            case STATE_PP_INVESTIGATE:
              if (!isPresident) {
                let isTarget = newState.targetUser === name;
                let footerText = isTarget
                  ? `You have been investigated by ${newState[PARAM_PRESIDENT]}. The president now knows your party affiliation.`
                  : `${newState.targetUser} has been investigated by ${newState[PARAM_PRESIDENT]}. The president now knows their party affiliation.`;
                this.queueAlert(
                  <ButtonPrompt
                    label={"INVESTIGATION RESULTS"}
                    // If target: You have been investigated by [President Name].
                    //            The president now knows your party affiliation.
                    // If not target: [Target Name] has been investigated by [President Name].
                    //                The president now knows their party affiliation.
                    footerText={footerText}
                    buttonOnClick={this.hideAlertAndFinish}
                    buttonText={"OKAY"}
                  >
                    <PlayerDisplay
                      user={name}
                      gameState={newState}
                      showLabels={false}
                      players={[newState.targetUser!]}
                    />
                  </ButtonPrompt>,
                  true
                );
              } else {
                // Is President; do nothing because we handle the
                // response directly from the server.
              }
              break;
            case STATE_PP_GET_BUGGING_IDENTITY:
              if (!isPresident) {
                let isTarget = newState.targetUser === name;
                let footerText = isTarget
                  ? `You were bugged. The President ${newState[PARAM_PRESIDENT]} and the Chancellor ${newState[PARAM_PRESIDENT]} know your party affiliation.`
                  : `${newState.targetUser} was bugged. The President ${newState[PARAM_PRESIDENT]} and the Chancellor ${newState[PARAM_PRESIDENT]} know their party affiliation.`;
                this.queueAlert(
                  <ButtonPrompt
                    label={"BUGGING SELECTION"}
                    footerText={footerText}
                    buttonOnClick={this.hideAlertAndFinish}
                    buttonText={"OKAY"}
                  >
                    <PlayerDisplay
                      user={name}
                      gameState={newState}
                      showLabels={false}
                      players={[newState.targetUser!]}
                    />
                  </ButtonPrompt>,
                  true
                );
              } else {
                // Is President; do nothing because we handle the
                // response directly from the server.
              }
              break;

            case STATE_CP_RADICALISATION_ACCEPT_DENY:
              if (newState.targetUser === name) {
                if(newState.radicalisationSuccess){
                  this.queueAlert(
                    <RoleAlert
                      role={newState.players[this.state.name].id}
                      gameState={newState}
                      name={name}
                      onClick={() => {
                        this.hideAlertAndFinish();
                      }}
                    />,
                    false
                  );
                }
              } else if(name === newState.communist1 || name === newState.communist2
              || (newState.players[name].id === Role.ANARCHIST 
              && newState.doesAnarchistKnowCommunists)){
                let footerText = `The radicalisation of ${newState.targetUser} 
                ${newState.radicalisationSuccess?"SUCCEEDED":"FAILED"}!`;
                this.queueAlert(
                  <ButtonPrompt
                    label={"RADICALISATION"}
                    footerText={footerText}
                    buttonOnClick={this.hideAlertAndFinish}
                    buttonText={"OKAY"}
                  >
                    <PlayerDisplay
                      user={name}
                      gameState={newState}
                      showLabels={false}
                      players={[newState.targetUser!]}
                    />
                  </ButtonPrompt>,
                  true
                );
              } 
              break;
            
            case STATE_FIVE_YEAR_PLAN:
              this.queueEventUpdate("COMMUNIST POWER");
              if (!newState.peek) {
                throw new Error("5 year plan policies not found.");
              }
              this.queueAlert(
                <PeekPrompt
                  policies={newState.peek}
                  sendWSCommand={this.sendWSCommand}
                  names={undefined}
                  hideAlert={this.hideAlertAndFinish}
                  text={"As part of part year plan upto 2 communist and 1 liberal"
                    + " policies are added from discard to the draw pile."
                    + "These are the policies that were added to the draw pile."}
                  label={"FIVE YEAR PLAN"}
                />,
                true
              );
              break;
            
            case STATE_CONGRESS:
              this.queueEventUpdate("COMMUNIST POWER");
              if (!newState.peek) {
                throw new Error("5 year plan policies not found.");
              }
              this.queueStatusMessage(
                "CONGRESS: The newly radicalised communist will come to know who "
                + " the other communists are."
              );
              break;

            
            case STATE_POLICY_REMOVAL:
              if (!newState.policyRemovalMap) {
                throw new Error("Policy removal choices not found.");
              }
              let policies: PolicyType[] = [
                newState.policyRemovalMap[newState.president],
                newState.policyRemovalMap[newState.chancellor]];
              let names: string[] = [newState.president, newState.chancellor];
              this.queueAlert(
                <PeekPrompt
                  policies={policies}
                  sendWSCommand={this.sendWSCommand}
                  names={names}
                  hideAlert={this.hideAlertAndFinish}
                  text={"A policy is selected by the president and the chancellor separately. If they match, the selected policy will be removed from the game."}
                  label={"POLICY REMOVAL"}
                />,
                true
              );
              /* To-Do: Add animation for removing policy.*/
              break;

            case STATE_PP_PEEK: // No additional case is necessary for peeking.
            default:
          }

          this.queueStatusMessage(
            "Waiting for the president to end their term."
          );
          break;

        case STATE_LIBERAL_VICTORY_EXECUTION:
        case STATE_FASCIST_VICTORY_ELECTION:
        case STATE_FASCIST_VICTORY_POLICY:
        case STATE_LIBERAL_VICTORY_POLICY:
        case STATE_COMMUNIST_VICTORY_EXECUTION:
        case STATE_COMMUNIST_VICTORY_POLICY:
          // Show normal enactments when victory events happen.
          if (newState.state === STATE_LIBERAL_VICTORY_EXECUTION
            || newState.state === STATE_COMMUNIST_VICTORY_EXECUTION) {
            this.showExecutionResults(name, newState);
          }
          if (newState.state === STATE_FASCIST_VICTORY_ELECTION) {
            this.addAnimationToQueue(() => this.showVotes(newState));
          }
          // Policies will already be shown for policy-based victories.
          // If the game was won via election, show the votes.

          // Divide fascist and liberal players.
          const fascistPlayers: string[] = [];
          const liberalPlayers: string[] = [];
          const communistPlayers: string[] = [];
          newState.playerOrder.forEach((player) => {
            const role = newState.players[player].id;
            if (role === Role.FASCIST || role === Role.HITLER) {
              fascistPlayers.push(player);
            } else if(role === Role.COMMUNIST || role === Role.ANARCHIST){
              communistPlayers.push(player);
            } else {
              liberalPlayers.push(player);
            }
          });

          let victoryMessage: string,
            messageClass: string,
            headerImage: string,
            headerAlt: string;
          let players: string[] = [];
          let state = newState.state;
          let fascistVictoryPolicy = state === STATE_FASCIST_VICTORY_POLICY;
          let fascistVictoryElection = state === STATE_FASCIST_VICTORY_ELECTION;
          let liberalVictoryPolicy = state === STATE_LIBERAL_VICTORY_POLICY;
          let liberalVictoryExecution = state === STATE_LIBERAL_VICTORY_EXECUTION;
          let communistVictoryPolicy = state === STATE_COMMUNIST_VICTORY_POLICY;
          let communistVictoryExecution = state === STATE_COMMUNIST_VICTORY_EXECUTION;
          let playerID = newState.players[name].id;
          let playerWon =
            (playerID === Role.LIBERAL &&
              (liberalVictoryExecution || liberalVictoryPolicy)) ||
            ((playerID === Role.HITLER || playerID === Role.FASCIST) &&
              (fascistVictoryElection || fascistVictoryPolicy)) ||
            ((playerID === Role.ANARCHIST || playerID === Role.COMMUNIST) &&
              (communistVictoryExecution || communistVictoryExecution)) ||
            ((playerID === Role.MONARCHIST) && (communistVictoryExecution ||
              liberalVictoryExecution || fascistVictoryPolicy));

          // Register player victory/loss with analytics.
          // TODO: Only register if player is host, or if player is the only
          // non-bot player in the game.
          if (playerWon) {
            ReactGA.event({
              category: "Victory",
              action: playerID + " won the game.",
            });
          } else {
            ReactGA.event({
              category: "Loss",
              action: playerID + " lost the game.",
            });
          }

          if (fascistVictoryElection || fascistVictoryPolicy) {
            players = fascistPlayers.concat(liberalPlayers).concat(communistPlayers);
            headerImage = VictoryFascistHeader;
            headerAlt = "Fascist Victory, written in red with a skull icon.";
            messageClass = "highlight";
            if (fascistVictoryPolicy) {
              victoryMessage = "Fascists successfully passed six policies!";
            } else if (fascistVictoryElection) {
              victoryMessage =
                "Fascists successfully elected Hitler as chancellor!";
            }
          } else if(communistVictoryPolicy || communistVictoryExecution){
            players = communistPlayers.concat(liberalPlayers).concat(fascistPlayers);
            headerImage = VictoryHeaderCommunist;
            headerAlt = "Communist Victory, written in burgundy with a sickle icon.";
            messageClass = "highlight-burgundy";
            if (liberalVictoryPolicy) {
              victoryMessage = "Communists successfully passed six policies!";
            } else if (liberalVictoryExecution) {
              victoryMessage = "Communists successfully executed Hitler!";
            }
          } else {
            players = liberalPlayers.concat(fascistPlayers).concat(communistPlayers);
            headerImage = VictoryLiberalHeader;
            headerAlt = "Liberal Victory, written in blue with a dove icon.";
            messageClass = "highlight-blue";
            if (liberalVictoryPolicy) {
              victoryMessage = "Liberals successfully passed five policies!";
            } else if (liberalVictoryExecution) {
              victoryMessage = "Liberals successfully executed Hitler!";
            }
          }
          if (DEBUG) {
            console.log("Player ordering: " + players);
          }
          this.addAnimationToQueue(() => {
            this.setState({
              alertContent: (
                <ButtonPrompt
                  renderLabel={() => {
                    return (
                      <>
                        <img
                          src={headerImage}
                          alt={headerAlt}
                          id={"victory-header"}
                        />
                        <p
                          style={{ textAlign: "center" }}
                          className={messageClass}
                        >
                          {victoryMessage}
                        </p>
                      </>
                    );
                  }}
                  buttonText={"RETURN TO LOBBY"}
                  buttonOnClick={() => {
                    this.gameOver = false;
                    this.reconnectOnConnectionClosed = true;
                    this.tryOpenWebSocket(this.state.name, this.state.lobby);
                    this.hideAlertAndFinish();
                    this.setState({
                      page: PAGE.LOBBY,
                      gameState: DEFAULT_GAME_STATE,
                      liberalPolicies: 0,
                      fascistPolicies: 0,
                      electionTracker: 0,
                      drawDeckSize: 17,
                      discardDeckSize: 0,
                    });
                  }}
                >
                  <PlayerDisplay
                    players={players}
                    playerDisabledFilter={DISABLE_NONE}
                    showRoles={true}
                    showLabels={false}
                    useAsButtons={false}
                    user={this.state.name}
                    gameState={newState}
                  />
                </ButtonPrompt>
              ),
              showAlert: true,
            });
          });
          this.gameOver = true;
          this.reconnectOnConnectionClosed = false;
          this.websocket?.close();
          break;

        default:
        // Do nothing
      }
    }

    // Update the draw decks
    this.addAnimationToQueue(() => {
      this.setState({
        drawDeckSize: newState.drawSize,
        discardDeckSize: newState.discardSize,
      });
      this.onAnimationFinish();
    });
  }

  //// Animation Handling
  // <editor-fold desc="Animation Handling">

  /**
   * Plays the next animation in the queue if it exists.
   * @effects If {@code this.animationQueue} is not empty,
   *          removes the function at the front of the animation queue and calls it.
   */
  onAnimationFinish() {
    if (this.animationQueue.length > 0) {
      let func = this.animationQueue.shift();
      if (func !== undefined) {
        func(); //call the function.
      }
    } else {
      // the animation queue is empty, so we set a flag.
      this.allAnimationsFinished = true;
      this.setState({ allAnimationsFinished: true });
    }
  }

  /**
   * Clears the animation queue and ends any currently playing animations.
   */
  clearAnimationQueue() {
    this.allAnimationsFinished = true;
    this.setState({ allAnimationsFinished: true });
    this.animationQueue = [];
  }

  /**
   * Adds the specified animation to the end of the queue.
   * @param func {function} the function to add to the animation queue.
   * @effects Adds the function to the back of the animation queue. If no animations are currently playing,
   *          starts the specified animation.
   */
  addAnimationToQueue(func: () => void) {
    this.animationQueue.push(func);
    if (this.allAnimationsFinished) {
      this.allAnimationsFinished = false;
      this.setState({ allAnimationsFinished: false });
      let func = this.animationQueue.shift();
      if (func !== undefined) {
        func(); //call the function.
      }
    }
  }

  showVotes(newState: GameState) {
    this.setState({ statusBarText: "Tallying votes..." });
    setTimeout(() => {
      this.setState({ showVotes: true });
    }, 1000);
    // Calculate final result:

    let noVotes = 0;
    let yesVotes = 0;
    Object.values(newState.userVotes).forEach((value) => {
      if (value) {
        yesVotes++;
      } else {
        noVotes++;
      }
    });
    setTimeout(() => {
      if (yesVotes > noVotes) {
        this.setState({
          statusBarText: yesVotes + " - " + noVotes + ": Vote passed",
        });
      } else {
        this.setState({
          statusBarText: yesVotes + " - " + noVotes + ": Vote failed",
        });
      }
    }, 2000);
    setTimeout(
      () => this.setState({ showVotes: false, statusBarText: "" }),
      6000
    );
    setTimeout(() => {
      this.onAnimationFinish();
    }, 6500);
  }

  /**
   * Adds a listener to be called when the server returns an 'OK' status.
   * @param func The function to be called.
   * @effects adds the listener to the queue of functions. When the server returns an 'OK' status, all of the
   *          listeners will be called and then cleared from the queue.
   */
  addServerOKListener(func: () => void) {
    this.okMessageListeners.push(func);
  }

  /**
   * Hides the CustomAlert and marks this animation as finished.
   * @param delayExit {boolean} When true, delays advancing the animation queue until after the alert is hidden.
   * @effects: Sets {@code this.state.showAlert} to false and hides the CustomAlert.
   *           If delayExit is true, waits until the CustomAlert is done hiding before advancing the animation queue.
   *           Otherwise, immediately queues the next animation.
   */
  hideAlertAndFinish(delayExit = true) {
    this.setState({ showAlert: false });
    if (delayExit) {
      setTimeout(() => {
        this.setState({ alertContent: <div /> }); // reset the alert box contents
        this.onAnimationFinish();
      }, CUSTOM_ALERT_FADE_DURATION);
    } else {
      this.setState({ alertContent: <div /> });
      this.onAnimationFinish();
    }
  }

  /**
   * Shows the eventBar for a set period of time.
   * @param message {String} the message for the Event Bar to be fully visible.
   * @param duration {Number} the duration (in ms) for the Event Bar to be visible. (default is 3000 ms).
   * @effects Adds a function to the animation queue that, when called, shows the EventBar with the given message
   *          for {@code duration} ms, then advances to the next animation when finished.
   */
  queueEventUpdate(message: string, duration = 2000) {
    this.addAnimationToQueue(() => {
      this.setState({
        showEventBar: true,
        eventBarMessage: message,
      });
      setTimeout(() => {
        this.setState({ showEventBar: false });
      }, duration);
      setTimeout(() => {
        this.onAnimationFinish();
      }, duration + EVENT_BAR_FADE_OUT_DURATION);
    });
  }

  /**
   * Adds a CustomAlert to the animation queue.
   * @param content {html} the contents to be shown in the AlertBox.
   * @param closeOnOK {boolean} whether to close the alert when the server responds with an ok message. (default = true)
   * @effects Adds a new function to the animation queue that, when called, causes a CustomAlert with the
   *          given {@code content} to appear. If {@code closeOnOK} is true, once shown, the alert box will
   *          be closed when the server responds with an 'ok' to any command. (There will be a short delay before the
   *          animation queue advances if not waiting for a server response.)
   */
  queueAlert(content: React.JSX.Element, closeOnOK = true) {
    this.addAnimationToQueue(() => {
      this.setState({
        alertContent: content,
        showAlert: true,
      });
      if (closeOnOK) {
        // Remove the exit delay if waiting for the server response, because otherwise the player will lag
        // behind everyone else.
        this.addServerOKListener(() => this.hideAlertAndFinish(false));
      }
    });
  }

  /**
   * Adds an update to the status message to the animation queue.
   * @param message {String} the text for the status bar to display.
   * @effects Adds a new function to the animation queue that, when called, updates {@code this.state.statusBarText} to
   *          the message provided then instantly advances the animation queue.
   */
  queueStatusMessage(message: string) {
    this.addAnimationToQueue(() => {
      this.setState({ statusBarText: message });
      this.onAnimationFinish();
    });
  }

  // </editor-fold>

  /**
   * Renders the game page.
   */
  renderGamePage() {
    let fascistUneacted = 11 - this.state.gameState.fascistPolicies;
    let liberalUneacted = 6 - this.state.gameState.liberalPolicies;
    let communistUneacted = 8 - this.state.gameState.communistPolicies;
    let policyRemoved = this.state.gameState.policyRemoved;
    if(policyRemoved === PolicyType.COMMUNIST){
      communistUneacted--;
    } else if(policyRemoved === PolicyType.FASCIST){
      fascistUneacted--;
    } else if(policyRemoved === PolicyType.LIBERAL) {
      liberalUneacted--;
    }

    let president = this.state.gameState[PARAM_PRESIDENT];
    let isPresidentAlive = this.state.gameState.players[president].alive;
    /*if(this.state.gameState.targetUser === undefined){
      this.state.gameState.targetUser = this.state.name;
    }*/

    let disableEndTerm = !(this.state.gameState.state === STATE_POST_LEGISLATIVE && 
    ((this.state.name === president && isPresidentAlive) || 
    (!isPresidentAlive && this.state.name !== this.state.gameState.anarchist)));
  
    
    return (
      <div className="App" style={{ textAlign: "center" }}>
        <header className="App-header">SECRET-HITLER.ORG</header>

        <CustomAlert show={this.state.showAlert}>
          {this.state.alertContent}
        </CustomAlert>

        <EventBar
          show={this.state.showEventBar}
          message={this.state.eventBarMessage}
        />

        <div style={{ backgroundColor: "var(--backgroundDark)" }}>
          <PlayerDisplay
            gameState={this.state.gameState}
            user={this.state.name}
            showVotes={this.state.showVotes}
            showBusy={this.state.allAnimationsFinished} // Only show busy when there isn't an active animation.
            playerDisabledFilter={DISABLE_EXECUTED_PLAYERS}
          />
        </div>

        <StatusBar>{this.state.statusBarText}</StatusBar>

        <div style={{ display: "inline-block" }}>
          <div
            id={"Board Layout"}
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              margin: "10px auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: "15px",
              }}
            >
              <Deck cardCount={this.state.drawDeckSize} deckType={"DRAW"} />

              <div style={{ margin: "auto auto" }}>
                <button
                  disabled={disableEndTerm}
                  onClick={() => {
                    this.sendWSCommand({ command: WSCommandType.END_TERM });
                  }}
                >
                  {" "}
                  END TERM
                </button>
                {( this.state.gameState.isExpansionGame &&
                  <button
                    disabled={
                      this.state.gameState[PARAM_STATE] !==
                        STATE_POST_LEGISLATIVE ||
                      this.state.gameState.players[this.state.name].id 
                      !== Role.ANARCHIST || this.state.gameState.usedAnarchistPower
                    }
                    onClick={() => this.queueAlert(
                      <AcceptDenyPrompt
                        gameState={this.state.gameState}
                        sendWSCommand={this.sendWSCommand}
                        user={this.state.name}
                        targetName={this.state.name!}
                      />,
                    )}
                  >
                    {" "}
                    POWER
                  </button>
                )}
                <PlayerPolicyStatus
                  unenactedFascistPolicies={fascistUneacted}
                  unenactedLiberalPolicies={liberalUneacted}
                  unenactedCommunistPolicies={communistUneacted}
                  playerCount={this.state.gameState.playerOrder.length}
                  isExpansionGame={this.state.gameState.isExpansionGame}
                  numLiberalPlayers={this.state.gameState.numLiberal}
                  numCommunistPlayers={this.state.gameState.numCommunist}
                  numFascistPlayers={this.state.gameState.numFascist}
                  hasAnarchist={this.state.gameState.hasAnarchist}
                  hasMonarchist={this.state.gameState.hasMonarchist}
                />
              </div>

              <Deck
                cardCount={this.state.discardDeckSize}
                deckType={"DISCARD"}
              />
            </div>

            <Board
              numPlayers={this.state.gameState.playerOrder.length}
              numFascistPolicies={this.state.fascistPolicies}
              numLiberalPolicies={this.state.liberalPolicies}
              numCommunistPolicies={this.state.communistPolicies}
              isExpansionGame={this.state.gameState.isExpansionGame}
              electionTracker={this.state.electionTracker}
              antiPolicyPlace={this.state.gameState.antiPolicyPlace}
              policyRemovedPlace={this.state.gameState.policyRemovedPlace}
            />
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div id="snackbar">{this.state.snackbarMessage}</div>
        </div>
      </div>
    );
  }

  //</editor-fold>

  render() {
    // Check URL params. If joining from a lobby link, open the lobby with the given code.
    let url = window.location.search;
    let lobby = new URLSearchParams(url).get("lobby");
    if (lobby !== null && !this.state.lobbyFromURL) {
      ReactGA.event({
        category: "Lobby Link",
        action: "User is using a lobby link.",
      });
      this.setState({
        joinLobby: lobby.toUpperCase().substr(0, 4),
        lobbyFromURL: true,
      });
    }

    let page_render;
    switch (this.state.page) {
      case PAGE.LOBBY:
        page_render = this.renderLobbyPage();
        break;
      case PAGE.GAME:
        page_render = this.renderGamePage();
        break;
      case PAGE.LOGIN: // login is default
      default:
        page_render = this.renderLoginPage();
    }
    return (
      <>
        <HelmetMetaData />
        {page_render}
      </>
    );
  }
}

export default App;
