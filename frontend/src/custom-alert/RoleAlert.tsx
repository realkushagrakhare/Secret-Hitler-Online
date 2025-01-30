import React, { Component } from "react";
import RoleHitler from "../assets/role-hitler.png";
import RoleLiberal1 from "../assets/role-liberal-1.png";
import RoleLiberal2 from "../assets/role-liberal-2.png";
import RoleLiberal3 from "../assets/role-liberal-3.png";
import RoleLiberal4 from "../assets/role-liberal-4.png";
import RoleLiberal5 from "../assets/role-liberal-5.png";
import RoleLiberal6 from "../assets/role-liberal-6.png";
import RoleFascist1 from "../assets/role-fascist-1.png";
import RoleFascist2 from "../assets/role-fascist-2.png";
import RoleFascist3 from "../assets/role-fascist-3.png";
import RoleCommunist from "../assets/role-communist.png";
import RoleAnarchist from "../assets/role-anarchist.png";
import RoleMonarchist from "../assets/role-monarchist.png";

import "./RoleAlert.css";
import { GameState, Role } from "../types";

const LiberalImages = [
  RoleLiberal1,
  RoleLiberal2,
  RoleLiberal3,
  RoleLiberal4,
  RoleLiberal5,
  RoleLiberal6,
];
const LiberalImagesAltText = [
  "Your secret role is LIBERAL. The card shows a bespectacled man with a pipe giving a side-eye.",
  "Your secret role is LIBERAL. The card shows an elegant woman with curly hair and pearls.",
  "Your secret role is LIBERAL. The card shows a round-chinned man in a pilgrim-esque hat gazing quizzically at the camera.",
  "Your secret role is LIBERAL. The card shows a sharp-suited man sporting a fedora and a neatly-trimmed mustache.",
  "Your secret role is LIBERAL. The card shows an elderly woman with comically large glasses holding a chihuahua.",
  "Your secret role is LIBERAL. The card shows a woman with a large sun hat and shoulder-length bob smirking.",
];

const HitlerImages = [RoleHitler];
const HitlerImagesAltText = [
  "Your secret role is HITLER. The card shows a crocodile in a suit and WW2 German military hat glaring at the camera.",
];
const FascistImages = [RoleFascist1, RoleFascist2, RoleFascist3];
const FascistImagesAltText = [
  "Your secret role is FASCIST. The card shows a snake emerging from a suit covered in military medals.",
  "Your secret role is FASCIST. The card shows an iguana in a German military hat and suit with fangs bared.",
  "Your secret role is FASCIST. The card shows an iguana in a German military hat and suit with fangs bared.",
];
const MonarchistImages = [RoleMonarchist];
const MonarchistImagesAltText = [
  "Your secret role is MONARCHIST. The card shows a hawk wearing miltary helmet and suit, planning something devious.",
]

const CommunistImages = [RoleCommunist];
const CommunistImagesAltText = [
  "Your secret role is COMMUNIST. The card shows a bear wearing a communist hat, looking unfazed."
]
const AnarchistImages = [RoleAnarchist];
const AnarchistImagesAltText = [
  "Your secret role is ANARCHIST. The card shows a devlish cat wearing a suit and waiting for the moment to strike."
]


const LiberalText = [
  "You win if the board fills with liberal policies, or if Hitler is executed.",
  "You lose if the board fills with fascist policies, or if Hitler is elected chancellor after 3 fascist policies are passed.",
  "Keep your eyes open and look for suspicious actions. Suss out Hitler, and remember that anyone might be lying!",
];
const FascistText = [
  "You win if Hitler is successfully elected chancellor once 3 fascist policies are on the board, or if the board fills with fascist policies.",
  "You lose if the board fills with liberal policies or if Hitler is executed.",
  "Keep suspicion off of Hitler and look for ways to throw confusion into the game.",
];
const HitlerText = [
  "You win if you are successfully elected chancellor once 3 fascist policies are on the board, or if the board fills with fascist policies.",
  "You lose if the board fills with liberal policies or if you are executed.",
  "Try to gain trust and rely on the other fascists to open opportunities for you.",
];
const MonarchistText = [
  "You win if the board fills with fascist policies, or if Hitler is executed.",
  "You lose if board fills with liberal policies, or if Hitler is elected chancellor once 3 fascist policies are on the board.",
  "Once per game, you can reveal your secret role to everyone and call for a special election. You become the president and pick a chancellor candidate. At the same time, the president, under which the 3rd fascist policy was enacted, also picks a candidate. One of the two candidates become the chancellor depending upon the votes."
]
const AnarchistText = [
  "You win if the communists win.",
  "You lose if board fills with liberal policies, or if Hitler is elected chancellor once 3 fascist policies are on the board.",
  "Once per game, you can reveal your secret role to everyone and execute a player."
]
const CommunistText = [
  "You win if the board fills with communists policies, or if Hitler is executed.",
  "You lose if the board fills with fascist policies, or if Hitler is elected chancellor after 3 fascist policies are passed.",
  "Keep your eyes open and look for suspicious actions. Suss out Hitler, and remember that you can double cross others!",
]


type RoleAlertProps = {
  role?: Role;
  name: string;
  gameState: GameState;
  onClick: () => void;
};

/**
 * CustomAlert content that shows the player's current role and a quick guide on how to play
 * the game.
 * Parameters:
 *      - {@code role} [String]: The role of the player. Should be either LIBERAL, FASCIST, or HITLER.
 *      - {@code roleID} [int]: The integer roleID of the player. This is used to show unique role cards.
 *          The roleID can range from [1, 6] for LIBERALS, [1, 3] for FASCISTS, and [1] for HITLER. If out of bounds,
 *          the value is set to 1 (default).
 *      - {@code onClick} [()]: The callback function for when confirmation button ("OKAY") is pressed.
 */
class RoleAlert extends Component<RoleAlertProps> {
  getRoleImageAndAlt(): { image: string; alt: string } {
    let images: string[];
    let imageAlts: string[];
    switch (this.props.role) {
      case Role.LIBERAL:
        images = LiberalImages;
        imageAlts = LiberalImagesAltText;
        break;
      case Role.FASCIST:
        images = FascistImages;
        imageAlts = FascistImagesAltText;
        break;
      case Role.COMMUNIST:
        images = CommunistImages;
        imageAlts = CommunistImagesAltText;
        break;
      case Role.ANARCHIST:
        images = AnarchistImages;
        imageAlts = AnarchistImagesAltText;
        break;
      case Role.MONARCHIST:
        images = MonarchistImages;
        imageAlts = MonarchistImagesAltText;
        break;
      case Role.HITLER:
      default: // Hitler
        images = HitlerImages;
        imageAlts = HitlerImagesAltText;
    }
    const playerIndex = this.props.gameState.playerOrder.indexOf(
      this.props.name
    );
    const roleId = playerIndex % images.length;

    return {
      image: images[roleId],
      alt: imageAlts[roleId],
    };
  }

  render() {
    let roleText = HitlerText;
    if (this.props.role === Role.FASCIST) {
      roleText = FascistText;
    } else if (this.props.role === Role.LIBERAL) {
      roleText = LiberalText;
    } else if (this.props.role === Role.COMMUNIST) {
      roleText = CommunistText;
    } else if (this.props.role === Role.ANARCHIST) {
      roleText = AnarchistText;
    } else if (this.props.role === Role.MONARCHIST) {
      roleText = MonarchistText;
    }

    const { image, alt } = this.getRoleImageAndAlt();

    return (
      <div>
        <div>
          <h2 id="alert-header" className={"left-align"}>
            YOU ARE: {this.props.role}
          </h2>
          <img id="role" src={image} alt={alt} />

          <p className={"left-align"}>{roleText[0]}</p>
          <p className={"left-align"}>{roleText[1]}</p>
          <p className="highlight left-align">{roleText[2]}</p>
        </div>

        <button onClick={this.props.onClick}>OKAY</button>
      </div>
    );
  }
}

export default RoleAlert;
