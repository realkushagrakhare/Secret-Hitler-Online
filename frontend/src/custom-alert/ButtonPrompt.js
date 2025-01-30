import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * A template set of contents for the CustomAlert class that holds a series of selectable options.
 */
class ButtonPrompt extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selection: undefined
        }
    }

    render() {
        return (
            <div>
                {this.props.renderLabel(this)}
                {this.props.renderHeader(this)}
                {this.props.children}
                {this.props.renderFooter(this)}
                {this.props.renderButton(this)}
                {this.props.secondButtonExists && this.props.renderSecondButton(this)}
            </div>
        );
    }
}

// noinspection JSUnusedGlobalSymbols
ButtonPrompt.defaultProps = {
    label: "LABEL GOES HERE",
    renderLabel: (obj) => {
        return (<h2 id={"prompt-label"} className={"left-align"}>{obj.props.label}</h2>);
    },

    headerText: "",
    renderHeader: (obj) => {
        return (
            <p id={"prompt-header"} className={"left-align"}>{obj.props.headerText}</p>
        );
    },

    footerText: "",
    renderFooter: (obj) => {
        return (
            <p id={"prompt-header"} className={"left-align"}>{obj.props.footerText}</p>
        );
    },

    buttonText: "CONFIRM",
    buttonOnClick: () => {console.log("Button clicked.")},
    buttonDisabled: false,
    renderButton: (obj) => {
        return (
            <button id={"prompt-button"} disabled={obj.props.buttonDisabled} onClick={obj.props.buttonOnClick}>
                {obj.props.buttonText}
            </button>
        );
    },

    secondButtonText: "CANCEL",
    secondButtonExists: false,
    secondButtonDisabled: false,
    secondButtonOnClick: () => {console.log("Second Button clicked.")},
    renderSecondButton: (obj) => {
        if (obj.props.secondButtonExists && obj.props.secondButtonOnClick) {
            return (
                <button
                    id={"prompt-second-button"}
                    disabled={obj.props.secondButtonDisabled}
                    onClick={obj.props.secondButtonOnClick}
                >
                    {obj.props.secondButtonText}
                </button>
            );
        }
        return null; // Render nothing if second button props are not provided
    },

};

ButtonPrompt.propTypes = {
    label: PropTypes.string,
    renderLabel: PropTypes.func,
    headerText: PropTypes.string,
    renderHeader: PropTypes.func,

    onOptionSelected: PropTypes.func,
    renderOptions: PropTypes.func,

    footerText: PropTypes.string,
    renderFooter: PropTypes.func,

    buttonText: PropTypes.string,
    buttonOnClick: PropTypes.func,
    buttonDisabled: PropTypes.bool,
    renderButton: PropTypes.func,

    secondButtonText: PropTypes.string,
    secondButtonOnClick: PropTypes.func,
    secondButtonDisabled: PropTypes.bool,
    renderSecondButton: PropTypes.func,
    secondButtonExists: PropTypes.bool,
};


export default ButtonPrompt;