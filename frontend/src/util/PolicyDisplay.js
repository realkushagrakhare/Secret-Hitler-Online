import React, { Component } from "react";
import PropTypes from "prop-types";
import "./PolicyDisplay.css";
import { LIBERAL, SOCIODEMOCRATIC, COMMUNIST, FASCIST, ANTICOMMUNIST, ANTIFASCIST } from "../constants";
import LiberalPolicy from "../assets/policy-liberal.png";
import FascistPolicy from "../assets/policy-fascist.png";
import CommunistPolicy from "../assets/policy-communist.png";
import SocioDemocraticPolicy from "../assets/policy-socio-democratic.png";
import AntiFascistPolicy from "../assets/policy-anti-fascist.png";
import AntiCommunistPolicy from "../assets/policy-anti-communist.png";

class PolicyDisplay extends Component {
	getPolicyDetails = (value) => {
		switch (value) {
		  case LIBERAL:
			return { name: "liberal", src: LiberalPolicy};
		  case SOCIODEMOCRATIC:
			return { name: "social democratic", src: SocioDemocraticPolicy};
		  case COMMUNIST:
			return { name: "communist", src: CommunistPolicy};
		  case ANTIFASCIST:
			return { name: "anti-fascist", src: AntiFascistPolicy};
		  case ANTICOMMUNIST:
			return { name: "anti-communist", src: AntiCommunistPolicy};
		  case FASCIST:
		  default:
			return { name: "fascist", src: FascistPolicy};
		}
	};

	render() {
		return (
			<div id={"legislative-policy-container"}>
				{this.props.policies.map((value, index) => {
					const { name, src } = this.getPolicyDetails(value);
					let policyName = name;
					return (
						<div key={index} className={"policy-item"}>
							<img
								id={"legislative-policy"}
								key={index}
								className={
									this.props.allowSelection
										? "selectable " +
										(index === this.props.selection ? " selected" : "")
										: ""
								}
								onClick={() => this.props.onClick(index)}
								disabled={!this.props.allowSelection}
								src={src} // Toggles policy
								alt={
									"A " +
									policyName +
									" policy." +
									(this.props.allowSelection ? " Click to select." : "")
								}
							/>
							<p className="{policy-name}">
								{this.props.names !== undefined ? this.props.names[index] : ""}
							</p>
						</div>
					);
				})}
			</div>
		);
	}
}

PolicyDisplay.propTypes = {
	policies: PropTypes.array.isRequired,
	onClick: PropTypes.func, // If undefined, the policies cannot be selected.
	selection: PropTypes.number,
	allowSelection: PropTypes.bool,
	names: PropTypes.any, 
};

export default PolicyDisplay;
