import React from "react";

import { typerLogic } from "./typer-logic";

class Typer extends React.Component {
  state = {
    tagLines: [
      "Master the coding interview.",
      "Connect with industry professionals.",
      "Club sponsored events and workshops.",
      "Build projects over the semester."
    ]
  };

  componentDidMount() {
    window.onload = typerLogic();
  }

  componentWillUnmount() {
    window.onload = null;
  }

  render() {
    const { tagLines } = this.state;

    return (
      <React.Fragment>
        <span className="txt-rotate" data-rotate={JSON.stringify(tagLines)} />
        <div
          id="cursor"
          style={{
            display: "inline",
            border: "2px solid rgba(255,255,255,0.75)"
          }}
        />
      </React.Fragment>
    );
  }
}

export default Typer;
