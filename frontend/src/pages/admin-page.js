import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import axios from "axios";

import GenerateCode from "components/generate-code/generate-code";
import Button from "components/button/button";

class AdminPage extends Component {
  state = {
    invalidKeyError: false,
    code: null
  };

  isValidKey = key => {
    if (key === process.env.REACT_APP_TECHLEAD_KEY) return true;
    else return false;
  };

  handleBtnClick = () => {
    if (this.isValidKey(this.props.match.params.key)) {
      this.generateCode();
    } else {
      this.setState({ invalidKeyError: true });
    }
  };

  generateCode = () => {
    let path;
    if (process.env.NODE_ENV === "production") {
      path = process.env.REACT_APP_BACKEND;
    } else {
      path = "http://localhost:8080";
    }

    axios
      .get(path + "/api/checkin/generate")
      .then(res => {
        console.log(res);
        this.setState({ code: res.data.code, showCode: true });
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: err });
      });
  };

  render() {
    const { invalidKeyError, code } = this.state;

    if (invalidKeyError)
      return (
        <div className="title is-1">
          Invalid Key Entered. Try again, sucker.
        </div>
      );

    return (
      <div className="container">
        <div
          className="container has-text-centered"
          style={{ minHeight: "200px" }}
        >
          <GenerateCode code={code} />
        </div>
        <div className="container is-flex" style={{ justifyContent: "center" }}>
          <Button label="Generate Code" clicked={this.handleBtnClick} />
        </div>
      </div>
    );
  }
}

export default withRouter(AdminPage);
