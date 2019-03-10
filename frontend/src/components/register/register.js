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
            emailError: true,
            nameError: true,
            passwordError: true,
            registered: false
        };

        this.handleSubmit = _.debounce(this.handleSubmit.bind(this), 500);
    }

    handleSubmit = e => {
        const { email, name, password, emailError, nameError, passwordError, registered } = this.state;

        if (registered) {
            alert("Oops! It looks like you have already registered.");
        } else if (emailError) {
            alert("Please enter a valid SJSU email.");
        } else if (nameError) {
            alert("Please enter your name.");
        } else if (passwordError) {
            alert("Please enter a valid password that contains at least 8 characters including 1 special character.");
        } else if (email && password && name) {
            register(email, password, name);
            this.setState({
                registered: true
            });
            alert("Great! You have successfully registered to become a member of Hoplite.");
        }
    }

    handleKeyPress = e => {
        if (e.key === "Enter") {
            this.handleSubmit();
        }
    }

    handleEmailChange = e => {
        const emailInput = e.target.value.toLowerCase();
        const regex = /.+@sjsu.edu/;  // Email must end in @sjsu.edu
        this.setState({
            email: emailInput,
            emailError: regex.test(emailInput) ? false : true
        });
    }

    handleNameChange = e => {
        const nameInput = e.target.value;
        this.setState({
            name: nameInput,
            nameError: nameInput ? false : true
        });
    }

    handlePasswordChange = e => {
        const passwordInput = e.target.value;
        const regex = /^[a-zA-Z0-9]*$/;  // Only contains alphanumeric characters (no special characters)
        this.setState({
            password: passwordInput,
            passwordError: !regex.test(passwordInput) ? false : true
        });
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
                            type="email"
                            placeholder="SJSU Email"
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                            onKeyPress={this.handleKeyPress}
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
                            minLength="8"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            onKeyPress={this.handleKeyPress}
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
