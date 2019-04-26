import React, { Component } from "react";
import _ from "lodash";
import GoogleLogin from 'react-google-login';
import axios from 'axios';
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

  handleSubmit = (res) => {
    
    let path;
    if (process.env.NODE_ENV === "production") {
      path = process.env.REACT_APP_BACKEND;
    } else {
      path = "http://localhost:8080";
    }
    axios
      .post(path + "/auth/google", {
        access_token: res.accessToken
      })
      .then(res => {
        if (res.data.success) {
          alert("Success! You are Logged in, thanks.");
          localStorage.setItem('JWT_TOKEN', res.data.token)
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
      
  };
  
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
                  <GoogleLogin
    clientId="129086773964-42vg3lj1qos4j24nc31nv1mfj34s7m20.apps.googleusercontent.com"
    render={renderProps => (
      <button onClick={renderProps.onClick} disabled={renderProps.disabled}>Login with SJSU email</button>
    )}
    buttonText="Login"
    onSuccess={this.handleSubmit}
    onFailure={alert("Invalid Login, Please log in with an sjsu.edu email")}
    cookiePolicy={'single_host_origin'}
  />
                  
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
