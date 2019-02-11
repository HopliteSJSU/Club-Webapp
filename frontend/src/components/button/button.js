import React from "react";
import PropTypes from "prop-types";

const Button = ({ label, classes, styles, clicked, animated }) => {
  let id = animated ? "animated-btn" : "";
  return (
    <React.Fragment>
      <button
        className={`button ${classes}`}
        style={{ ...styles }}
        onClick={clicked}
        id={id}
      >
        <span>{label}</span>
      </button>
    </React.Fragment>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired
};

Button.defaultProps = {
  classes: "",
  styles: {}
};

export default Button;
