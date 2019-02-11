/* eslint no-useless-escape: 0 */

import React, { Component } from "react";
import Button from "components/button/button";
import LoadingIcon from "components/animations/loading-icon/loading-icon";

import axios from "axios";
import _ from "lodash";

class EmailSub extends Component {
  constructor(props) {
    super();

    this.state = {
      showInput: false,
      invalidEmail: false,
      errSubmitEmail: false,
      loading: false,
      deviceType: "desktop"
    };

    //So user can't spam enter when submitting an email.
    this.submitEmail = _.debounce(this.submitEmail.bind(this), 500);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.deviceType !== state.deviceType) {
      return { deviceType: props.deviceType };
    }

    return null;
  }

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  submitEmail = async () => {
    if (this.validateEmail(this.emailInput.value)) {
      this.setState({ loading: true });
      let res;
      try {
        if (process.env.NODE_ENV === "production") {
          res = await axios.post(
            process.env.REACT_APP_BACKEND +
              "/api/subscribe/" +
              this.emailInput.value.toLowerCase()
          );
        } else {
          res = await axios.post(
            "http://localhost:8080/api/subscribe/" +
              this.emailInput.value.toLowerCase()
          );
        }
      } catch (err) {
        console.log(err);
      }

      if (res && res.data) {
        this.setState({
          errSubmitEmail: false,
          invalidEmail: false,
          loading: false,
          success: true
        });
        this.emailInput.value = "";
        this.emailInput.placeholder = `Success!`;

        setTimeout(() => {
          this.setState({
            success: false
          });
          this.emailInput.placeholder = `Please enter your email here!`;
        }, 2500);
      } else {
        this.setState({
          errSubmitEmail: true,
          invalidEmail: false,
          loading: false
        });
        this.emailInput.value = "";
        this.emailInput.placeholder = `Error: please try again or send us an email.`;
      }
    } else {
      this.setState({ errSubmitEmail: false, invalidEmail: true });
      let badEmail = this.emailInput.value;
      this.emailInput.value = "";
      this.emailInput.placeholder = `Please try again, invalid email: "${badEmail}"`;
    }
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.submitEmail();
    }
  };

  handleSubClick = () => {
    this.setState({ showInput: true });
    this.emailInput.focus();

    if (this.state.deviceType === "mobile") {
      let top = this.emailInput.getBoundingClientRect().top + window.scrollY;
      window.scroll({
        top: top - 200,
        behavior: "smooth"
      });
    }
  };

  render() {
    const {
      showInput,
      invalidEmail,
      errSubmitEmail,
      loading,
      success,
      deviceType
    } = this.state;

    let isHidden = showInput ? "show" : "hide";
    let invalid = invalidEmail ? "invalid-email" : "";
    let error = errSubmitEmail ? "error-email" : "";

    return (
      <div className={`container ${deviceType}`} id="email-sub">
        <div className="container" id="input-container">
          <div
            className={`container for-animation ${isHidden} ${deviceType} ${invalid} ${error}`}
            ref={node => (this.inputContainer = node)}
          >
            <input
              className={`input ${deviceType}`}
              id="email-input"
              placeholder="Please enter your email here!"
              type="email"
              onKeyPress={this.handleKeyPress}
              ref={node => {
                this.emailInput = node;
              }}
              autoComplete="off"
            />

            {loading && <LoadingIcon />}
            {success && (
              <span
                className={`icon ${showInput ? "show" : "hide"}`}
                id="success-check"
              >
                <i class="fas fa-check" />
              </span>
            )}
            {!loading && !success && (
              <span
                className={`icon ${showInput ? "show" : "hide"}`}
                onClick={this.submitEmail}
                id="arrow-submit"
              >
                <i className="fas fa-arrow-right" />
              </span>
            )}
            <span
              className={`icon ${showInput ? "show" : "hide"} ${
                success ? "success" : "default"
              }`}
              id="email-icon"
            >
              <i className="fas fa-envelope" />
            </span>
          </div>
        </div>
        {!showInput && (
          <Button
            label="Subscribe!"
            styles={{ position: showInput ? "relative" : "absolute" }}
            clicked={this.handleSubClick}
            animated
          />
        )}
      </div>
    );
  }
}

export default EmailSub;
