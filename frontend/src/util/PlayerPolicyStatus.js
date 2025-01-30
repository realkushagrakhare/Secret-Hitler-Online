import React, {Component} from "react";
import PropTypes from "prop-types";
import IconFascist from "../assets/player-icon-fascist.png";
import IconHitler from "../assets/player-icon-hitler.png";
import IconLiberal from "../assets/player-icon-liberal.png";
import IconCommunist from "../assets/player-icon-communist.png";
import IconMonarchist from "../assets/player-icon-monarchist.png";
import IconAnarchist from "../assets/player-icon-anarchist.png";

import './PlayerPolicyStatus.css';

class PlayerPolicyStatus extends  Component {

    render() {
        let props = this.props;
        let numMonarchist = props.hasMonarchist ? 1 : 0;
        let numAnarchist = props.hasAnarchist ? 1 : 0;
        return (
            <div id={"pps-container"}>
                <p id={"pps-text"}>
                    Players:
                </p>
                <div id={"pps-icon-container"}>
                    <img id="pps-icon" src={IconLiberal} alt={"Liberal"}/>
                    <p id={"pps-icon-number"} className={"highlight-blue"}>{props.numLiberalPlayers}</p>
                    <img id="pps-icon" src={IconFascist} alt={"Fascist"}/>
                    <p id={"pps-icon-number"} className={"highlight"}>{props.numFascistPlayers}</p>
                    <img id="pps-icon" src={IconHitler} alt={"Hitler"}/>
                    <p id={"pps-icon-number"}  className={"highlight"}>{1}</p>
                    {props.isExpansionGame && (
                    <>
                        <img id="pps-icon" src={IconMonarchist} alt={"Monarchist"}/>
                        <p id={"pps-icon-number"} className={"highlight"}>{numMonarchist}</p>
                        <img id="pps-icon" src={IconCommunist} alt={"Communist"} />
                        <p id={"pps-icon-number"} className={"highlight-burgundy"}>{props.numCommunistPlayers}</p>
                        <img id="pps-icon" src={IconAnarchist} alt={"Anarchist"} />
                        <p id={"pps-icon-number"} className={"highlight-burgundy"}>{numAnarchist}</p>
                    </>
                    )}
                </div>

                <p id={"pps-text"}>
                    Unenacted Policies:
                </p>
                <div id={"pps-icon-container"}>
                    <img id="pps-icon" className={"highlight-blue"} src={IconLiberal} alt={"Liberal"}/>
                    <p id={"pps-icon-number"} className={"highlight-blue"}>{props.unenactedLiberalPolicies}</p>
                    <img id="pps-icon" className={"highlight"} src={IconFascist} alt={"Fascist"}/>
                    <p id={"pps-icon-number"} className={"highlight"}>{props.unenactedFascistPolicies}</p>
                    {props.isExpansionGame && (
                    <>
                        <img id="pps-icon" className={"highlight-burgundy"} src={IconCommunist} alt={"Communist"} />
                        <p id={"pps-icon-number"} className={"highlight-burgundy"}>{this.props.unenactedCommunistPolicies}</p>
                    </>
                    )}
                </div>
            </div>
        )
    }
}

PlayerPolicyStatus.propTypes = {
    unenactedFascistPolicies: PropTypes.number.isRequired,
    unenactedLiberalPolicies: PropTypes.number.isRequired,
    unenactedCommunistPolicies: PropTypes.number.isRequired,
    playerCount: PropTypes.number.isRequired,
    numFascistPlayers: PropTypes.number.isRequired,
    numCommunistPlayers: PropTypes.number.isRequired,
    numLiberalPlayers: PropTypes.number.isRequired,
    hasAnarchist: PropTypes.bool.isRequired,
    hasMonarchist: PropTypes.bool.isRequired,
    isExpansionGame: PropTypes.bool.isRequired,
};

export default PlayerPolicyStatus;