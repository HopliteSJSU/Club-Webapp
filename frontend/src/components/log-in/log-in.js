import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";

import Button from "components/button/button";
import Register from "components/register/register";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDefault: true,
      showRegister: false
    };

    this.handleSubmit = _.debounce(this.handleSubmit.bind(this), 500);
  }

  handleRegister = () => {
    this.setState({
      showRegister: true,
      showDefault: false
    });
  }

  handleSubmit = () => {
    //Update the login endpoint and redirect component
    /*
    let path;
    if (process.env.NODE_ENV === "production") {
      path = process.env.REACT_APP_BACKEND;
    } else {
      path = "http://localhost:8080";
    }
    axios
      .post(path + "xyz", {
        email: this.emailInput.value.toLowerCase(),
        code: this.passwordInput.value.toLowerCase()
      })
      .then(res => {
        if (res.data.success) {
          alert("Success! You are Logged in, thanks.");
          window.location.href = "";
        }
      })
      .catch(err => {
        if (
          err.response &&
          err.response.data.msg !== undefined &&
          err.response.data.msg
        )
          alert(err.response.data.msg);
        else alert("Check your login information, and try again");
      });
      */
  };
  handleForgotPassword = () => {
    // add a call to forgot password endpoint
  }
  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.handleSubmit();
    }
  };

  render() {
    const { showDefault, showRegister } = this.state;

    return (
      <div className="container check-in">
        <br />
        <div className="field">
          <div className="control">
            <section className="modal-card-body">
              {showDefault && (
                <React.Fragment>
                  <label>Please enter SJSU email</label>
                  <input
                    name="email"
                    className="input is-rounded is-medium"
                    type="email"
                    placeholder="SJSU Email"
                    onKeyPress={this.handleKeyPress}
                    ref={node => (this.emailInput = node)}
                    autoComplete="off"
                    onFocus={this.scrollView}
                  />
                  <div className="control">
                    <label>Please enter your password</label>
                    <input
                      name="code"
                      className="input is-rounded is-medium"
                      type="password"
                      placeholder="Enter Code"
                      onKeyPress={this.handleKeyPress}
                      ref={node => (this.passwordInput = node)}
                      autoComplete="off"
                    />
                    <a onClick={this.handleForgotPassword}>Forgot Password?</a>
                  </div>
                  <div className="container is-flex actions">
                    <Button
                      className="submit-button"
                      label="Login"
                      clicked={this.handleSubmit}
                    />
                    <Button
                      label="Register"
                      clicked={this.handleRegister}
                    />
                  </div>
                </React.Fragment>
              )}
              {showRegister && <Register />}
            </section>
          </div>
        </div>
      </div>
    );
  }
}
