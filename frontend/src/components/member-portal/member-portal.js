import React from "react";
import GoogleLogin from 'react-google-login'
import Button from "components/button/button";
import CheckIn from "components/check-in/check-in";
import Login from "components/log-in/log-in";
import UploadScreen from './upload';
import Cookies from 'universal-cookie';

let applyLink = "https://goo.gl/forms/1KcEXaY9r4dA2mGi1";

class MemberPortal extends React.Component {
  state = {
    showDefault: true,
    showCheckIn: false,
    showLogin: false,
    showUpload:false,
    name:null,
    email:null
  };
  responseGoogle = (res)=>{
    console.log(res)
  }
  handleLogin = () =>
    this.setState({ showLogin: true, showDefault: false });

  handleCheckIn = () =>
    this.setState({ showCheckIn: true, showDefault: false });

  handleLoginFail = () => 
    alert("Login failed, Make sure to login with sjsu.edu");

  handleLoginSuccess = (res) => {
    const email = res.profileObj.email
    this.setState({email:email})
    this.setState({name:res.profileObj.name}) 
    console.log(res)
    if(email.split("@").pop() === 'sjsu.edu'){
      const accessToken = res.accessToken;
      const cookies = new Cookies();
      // Removing existing access tokens
      cookies.remove('gToken')
      // Add access token to cookies for further use
      cookies.set('gToken', accessToken, { path: '/' });
      this.setState({showUpload:true})
    }else{
      alert("Invalid email, Only sjsu.edu emails supported")
    }
  }

  render() {
    const { showDefault, showCheckIn, showLogin } = this.state;

    return (
      <div className="modal is-active">
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Member Portal</p>
            <a href="/">Homepage</a>
          </header>
          <section className="modal-card-body">
            {showDefault && (
              <React.Fragment>
                <h3 className="subtitle has-text-centered has-text-black">
                  Welcome to the members portal!
                </h3>
                {(!this.state.showUpload) ? <div className="container is-flex actions">
                  <Button
                    label="Meeting Check-In"
                    clicked={this.handleCheckIn}
                  />
                  <GoogleLogin
    clientId="129086773964-42vg3lj1qos4j24nc31nv1mfj34s7m20.apps.googleusercontent.com"
    onSuccess={this.handleLoginSuccess}
    onFailure={this.handleLoginFail}
    cookiePolicy={'single_host_origin'}
    render={renderProps => (
      <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="button">Member-login</button>
    )}
  />
                </div> : <UploadScreen name={this.state.name} email={this.state.email}/>}
                
              </React.Fragment>
            )}
            {showCheckIn && <CheckIn />}
            {showLogin && <Login />}
          </section>
        </div>
      </div>
    );
  }
}

export default MemberPortal;
