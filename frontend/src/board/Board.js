import React, {Component} from 'react';
import LiberalBoard from "../assets/board-liberal.png";
import ElectionTracker from "../assets/board-tracker.png";
import FascistBoard_5_6 from "../assets/board-fascist-5-6.png";
import FascistBoard_7_8 from "../assets/board-fascist-7-8.png";
import FascistBoard_9_10 from "../assets/board-fascist-9-10.png";
import CommunistBoard from "../assets/board-communist.png"
import PolicyLiberal from "../assets/board-policy-liberal.png";
import PolicyFascist from "../assets/board-policy-fascist.png";
import PolicyCommunist from "../assets/board-policy-communist.png";
import PolicySocioDemocratic from "../assets/board-policy-socio-democratic.png";
import PolicyAntiFascist from "../assets/board-policy-anti-fascist.png";
import PolicyAntiCommunist from "../assets/board-policy-anti-communist.png";

import "./Board.css";

class Board extends Component {


    /**
     * Returns the correct board image based on the number of players in the game.
     * @requires this.props.numPlayers must in range [5, 10], inclusive.
     * @return {image} The Fascist board corresponding to the number of players.
     *         >= 6: FascistBoard_5_6
     *         7-8: FascistBoard_7_8
     *         9-10: FascistBoard_9_10
     */
    getFascistBoard() {
        if(this.props.numPlayers <= 6) {
            return FascistBoard_5_6;
        } else if (this.props.numPlayers <= 8) {
            return FascistBoard_7_8;
        } else {
            return FascistBoard_9_10;
        }
    }

    /**
     * Places a series of repeating images.
     * @param count {number} the count of currently visible images.
     * @param totalCount {number} the total number of images to place.
     * @param src {Image} the image source to use for the tiles.
     * @param id {String} the HTML id to apply.
     * @param offset {String} the offset from the left of the first tile (given as a %)
     * @param spacing {String} the horizontal offset between each image (given as %)
     * @returns {<img>[]} an array of {@literal <img>} tags of length {@code totalCount}. Each image has the given
     *          {@code id} identity, {@code src} as an image source. There will be {@code spacing} between each image, and
     *          all images will be offset by {@code offset}.
     *          The first {@code count} images from the left will be given the class-name "show", the remaining will be given
     *          the class-name "hide".
     */
    placeRepeating(count, totalCount, src, id, offset, spacing, antiSrc, antiIndex, policyRemovedIndex) {
        let images = [];
        let index = 0;
        for(index; index < totalCount; index++) {
            let className = "hide";
            if (index < count) {
                className = "show";
            } else if(index === policyRemovedIndex) {
                className = "remove";
            }
            let imgSrc = index === antiIndex ? antiSrc : src;
            images[index] = (
                <img src={imgSrc}
                    id={id}
                    style={{position: "absolute", left:"calc(" + offset + " + " + index.toString() + "*" + spacing +")"}}
                    alt={""}
                    className={className}
                    key={index}
                    onAnimationEnd={(e) => {
                        if(e.target.classList.contains("remove")){
                            e.target.classList.add("hide");
                            e.target.classList.remove("remove");
                        }
                    }}
                />
            );
        }
        return images;
    }

    render() {
        return (
            <div id="board-container" style={{display:"flex", flexDirection:"column"}}>
                <div id="board-group" style ={{margin:"4px 10px", position:"relative"}}>
                    <img id="board"
                         src={LiberalBoard}
                         alt={this.props.numLiberalPolicies + " liberal policies have been passed."}
                    />
                    <img id="election-tracker"
                         src={ElectionTracker}
                         style={{position:"absolute",
                                 top:"74%", left:"calc(34.2% + " + this.props.electionTracker+"*9.16%)",
                                 width:"3.2%"}}
                         alt={"Election tracker at position " + this.props.electionTracker + " out of 3."}
                    />
                    {this.placeRepeating(this.props.numLiberalPolicies, 5, PolicyLiberal, "policy", "18.2%", "13.54%", PolicySocioDemocratic, this.props.antiPolicyPlace[0])}
                </div>

                <div id="board-group" style={{margin:"4px 10px", position:"relative"}}>
                    <img
                      id="board"
                      src={this.getFascistBoard()}
                      alt={this.props.numFascistPolicies + " fascist policies have been passed."}
                    />
                    {this.placeRepeating(this.props.numFascistPolicies, 6, PolicyFascist, "policy", "11%", "13.6%", PolicyAntiFascist, this.props.antiPolicyPlace[1])}
                </div>

                {this.props.isExpansionGame && (
                <>
                    <div id="board-group" style={{margin:"4px 10px", position:"relative"}}>
                        <img
                        id="board"
                        src={CommunistBoard}
                        alt={this.props.numCommunistPolicies + " communist policies have been passed."}
                        />
                        {this.placeRepeating(this.props.numCommunistPolicies, 6, PolicyCommunist, "policy", "11%", "13.6%", PolicyAntiCommunist, this.props.antiPolicyPlace[2])}
                    </div>
                </>
                )}
            </div>
        );
    }

}

Board.defaultProps = {
    numFascistPolicies: 5,
    numLiberalPolicies: 6,
    numCommunistPolicies: 5,
    isExpansionGame: false,
    electionTracker: 0,
    numPlayers: 5,
    antiPolicyPlace: [-1, -1, -1],
    policyRemovedPlace: [-1, -1, -1],
};

export default Board;