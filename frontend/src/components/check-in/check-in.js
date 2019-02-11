import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";

import Button from "components/button/button";

export default class CheckIn extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleSubmit = _.debounce(this.handleSubmit.bind(this), 500);
  }

  handleSubmit = () => {
    let path;
    if (process.env.NODE_ENV === "production") {
      path = process.env.REACT_APP_BACKEND;
    } else {
      path = "http://localhost:8080";
    }
    axios
      .post(path + "/api/checkin/update", {
        email: this.emailInput.value.toLowerCase(),
        code: this.codeInput.value.toLowerCase()
      })
      .then(res => {
        if (res.data.success) {
          alert("Success! You are checked in, thanks.");
          window.location.href = "http://www.sjsuhoplite.org";
        }
      })
      .catch(err => {
        if (
          err.response &&
          err.response.data.msg !== undefined &&
          err.response.data.msg
        )
          alert(err.response.data.msg);
        else alert("Check your form information, and try again");
      });
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.handleSubmit();
    }
  };

  render() {
    return (
      <div className="container check-in">
        <p>
          Attend our meeting today? Please enter your information below! Thanks
        </p>
        <br />
        <div className="field">
          <div className="control">
            <label>Please enter SJSU email</label>
            <input
              name="email"
              className="input is-rounded is-medium"
              type="text"
              placeholder="SJSU Email"
              onKeyPress={this.handleKeyPress}
              ref={node => (this.emailInput = node)}
              autoComplete="off"
              onFocus={this.scrollView}
            />
          </div>
          <div className="control">
            <label>Please enter unique code</label>
            <input
              name="code"
              className="input is-rounded is-medium"
              type="text"
              placeholder="Enter Code"
              maxLength="7"
              onKeyPress={this.handleKeyPress}
              ref={node => (this.codeInput = node)}
              autoComplete="off"
            />
          </div>
          <div className="container is-flex actions">
            <Button
              className="submit-button"
              label="Submit"
              clicked={this.handleSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}
