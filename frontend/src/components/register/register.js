import React, { Component } from "react";
import _ from "lodash";
import Button from "components/button/button";
import { register } from "redux/actions/auth";

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            name: "",
            password: "",
            emailError: false,
            nameError: false,
            passwordError: false,
            registered: false
        };

        this.handleSubmit = _.debounce(this.handleSubmit.bind(this), 500);
    }

    handleSubmit = e => {
        const { email, name, password, emailError, nameError, passwordError, registered } = this.state;

        if (registered) {
            alert("Oops! It looks like you have already registered.");
        } else if (emailError) {
            alert("Please enter a valid email.");
        } else if (nameError) {
            alert("Please enter a valid name.");
        } else if (passwordError) {
            alert("Please enter a valid password that contains at least 8 characters including 1 special character.");
        } else if (email && password && name) {
            register(email, password, name);
            this.setState({ registered: true });
            alert("Great! You have successfully registered to become a member of Hoplite.");
        }
    }

    handleKeyPress = e => {
        if (e.key === "Enter") {
            this.handleSubmit();
        }
    }

    handleEmailChange = e => {
        let emailInput = e.target.value.toLowerCase();
        this.setState({ email: emailInput }, () => { this.validateEmail() });
    }

    handleNameChange = e => {
        let nameInput = e.target.value;
        this.setState({ name: nameInput }, () => { this.validateName() });
    }

    handlePasswordChange = e => {
        let passwordInput = e.target.value;
        this.setState({ password: passwordInput }, () => { this.validatePassword() });
    }

    validateName = () => {
        const { name } = this.state;
        this.setState({ nameError: name.length < 1 ? true : false });
    }

    validateEmail = () => {
        const { email } = this.state;
        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.setState({ emailError: !regex.test(email) ? true : false });
    }

    validatePassword = () => {
        const { password } = this.state;
        let regex = /^[a-zA-Z0-9]*$/;
        this.setState({ passwordError: (password.length < 8 || regex.test(password)) ? true : false });
    }

    render() {
        return (
            <div className="container check-in">
                <p>Interested in becoming a member of Hoplite? Register now!</p>
                <br />
                <div className="field">
                    <div className="control">
                        <label>Please enter SJSU email</label>
                        <input
                            name="email"
                            className="input is-rounded is-medium"
                            type="text"
                            placeholder="SJSU Email"
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                            onKeyPress={this.handleKeyPress}
                            onBlur={this.validateEmail}
                            onFocus={this.scrollView}
                            autoComplete="off"
                        />
                    </div>
                    <div className="control">
                        <label>Please enter name</label>
                        <input
                            name="name"
                            className="input is-rounded is-medium"
                            type="text"
                            placeholder="Enter Name"
                            value={this.state.name}
                            onChange={this.handleNameChange}
                            onKeyPress={this.handleKeyPress}
                            onBlur={this.validateName}
                            autoComplete="off"
                        />
                    </div>
                    <div className="control">
                        <label>Please enter password</label>
                        <input
                            name="password"
                            className="input is-rounded is-medium"
                            type="password"
                            placeholder="Enter Password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            onKeyPress={this.handleKeyPress}
                            onBlur={this.validatePassword}
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
