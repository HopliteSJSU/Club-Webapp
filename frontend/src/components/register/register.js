import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";

import Button from "components/button/button";

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.handleSubmit = _.debounce(this.handleSubmit.bind(this), 500);
    }

    handleSubmit = () => {
        let email = this.emailInput.value.toLocaleLowerCase();
        let name = this.nameInput.value;
        let password = this.passwordInput.value;
    };

    handleKeyPress = e => {
        if (e.key === "Enter") {
            this.handleSubmit();
        }
    };

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
                            onKeyPress={this.handleKeyPress}
                            ref={node => (this.emailInput = node)}
                            autoComplete="off"
                            onFocus={this.scrollView}
                        />
                    </div>
                    <div className="control">
                        <label>Please enter name</label>
                        <input
                            name="name"
                            className="input is-rounded is-medium"
                            type="text"
                            placeholder="Enter Name"
                            onKeyPress={this.handleKeyPress}
                            ref={node => (this.nameInput = node)}
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
                            onKeyPress={this.handleKeyPress}
                            ref={node => (this.passwordInput = node)}
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
