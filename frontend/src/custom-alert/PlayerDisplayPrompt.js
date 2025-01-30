import React, {Component} from 'react';
import PlayerDisplay, {DISABLE_EXECUTED_PLAYERS} from "../player/PlayerDisplay";
import ButtonPrompt from "./ButtonPrompt";
import PropTypes from "prop-types";

/**
 * A PlayerPrompt is the content for an alert box. It has a header, text, and a PlayerList, as well
 * as an associated button.
 */
class PlayerDisplayPrompt extends Component{

    constructor(props) {
        super(props);
        this.state = {
            selection: undefined
        }
    }

    render() {
        let props = this.props;
        return (
            <ButtonPrompt
                label={props.label}
                headerText={props.headerText}
                renderHeader={props.renderHeader}
                footerText={props.footerText}
                
                buttonText={props.buttonText}
                buttonDisabled={this.state.selection === undefined || this.props.buttonDisabled}
                buttonOnClick={() => props.buttonOnClick(this.state.selection)}
                
                secondButtonText={props.secondButtonText}
                secondButtonDisabled={this.props.secondButtonDisabled}
                secondButtonOnClick={() => props.secondButtonOnClick(this.state.selection)}
                secondButtonExists={props.secondButtonExists}
            >
                <PlayerDisplay
                    gameState = {this.props.gameState}
                    user = {this.props.user}
                    includeUser={this.props.includeUser}
                    useAsButtons = {true}
                    playerDisabledFilter = {props.disabledFilter}
                    showLabels = {false}
                    selection = {this.state.selection}
                    onSelection = {(itemSelected) => {
                        this.setState({selection: itemSelected});
                    }}
                />
            </ButtonPrompt>

        )
    }
}

PlayerDisplayPrompt.defaultProps = {
    user: "",
    includeUser: false,
    disabledFilter: DISABLE_EXECUTED_PLAYERS,
    buttonText: "CONFIRM",
    buttonOnClick: (selectedItem) => {
        console.log("Button clicked with " + selectedItem + " selected.");
    },

    secondButtonText: "CANCEL",
    secondButtonOnClick: (selectedItem) => {
        console.log("Second Button clicked with " + selectedItem + " selected.");
    },
    secondButtonDisabled: false,
    secondButtonExists: false,

};

PlayerDisplayPrompt.propTypes = {
    user: PropTypes.string.isRequired,
    gameState: PropTypes.object.isRequired,
    includeUser:PropTypes.bool,
    disabledFilter: PropTypes.func.isRequired,

    label: PropTypes.string,
    headerText: PropTypes.string,
    footerText: PropTypes.string,

    buttonText: PropTypes.string,
    buttonOnClick: PropTypes.func,
    buttonDisabled: PropTypes.bool,

    secondButtonText: PropTypes.string,
    secondButtonOnClick: PropTypes.func,
    secondButtonDisabled: PropTypes.bool,
    secondButtonExists: PropTypes.bool,
};

export default PlayerDisplayPrompt;