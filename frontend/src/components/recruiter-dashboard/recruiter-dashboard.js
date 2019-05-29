import React, { Component } from 'react';
import axios from 'axios';

const tableStyle = {
    margin: 'auto',
    width: '95%',
    border: '1px solid black',
    borderCollape: 'collapse'
}

const divStyle = {
    textAlign: 'center'
}

const imgStyle = {
    width: '25px',
    height: '25px',
    border: '0'
}

class RecruiterDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
            queriedMembers: [],
            searchType: 'Name',
            searchValue: ''
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount = () => {
        axios
            .get('http://localhost:8080/retrieve/members')
            .then(response => {
                this.setState({
                    members: response.data,
                    queriedMembers: response.data
                });
                console.log(this.state.members);
            })
            .catch(error => {
                console.log('Error retrieving members from database.');
                console.log(error);
            });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            queriedMembers: this.state.members
        });
    }

    searchUsers() {
        const { members, searchValue, searchType } = this.state;

        if (searchType === 'Name') {
            const filteredUsersByName = members.filter(member => {
                return member.name.toLowerCase().includes(searchValue.toLowerCase());
            });
            this.setState({ queriedMembers: filteredUsersByName });
        }
        else if (searchType === 'Email') {
            const filteredUsersByEmail = members.filter(member => {
                return member.email.toLowerCase().includes(searchValue.toLowerCase());
            });
            this.setState({ queriedMembers: filteredUsersByEmail });
        }
        else if (searchType === 'Major') {
            const filteredUsersByMajor = members.filter(member => {
                return member.major.toLowerCase().includes(searchValue.toLowerCase());
            });
            this.setState({ queriedMembers: filteredUsersByMajor });
        }
        else if (searchType === 'Graduation Date') {
            const filteredUsersByGraduationDate = members.filter(member => {
                return member.expectedGraduation.toLowerCase().includes(searchValue.toLowerCase());
            });
            this.setState({ queriedMembers: filteredUsersByGraduationDate });
        }
    }

    listUsers = () => {
        return (
            this.state.queriedMembers.map((member, i) => (
                <tr key={i}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.major}</td>
                    <td>{member.expectedGraduation}</td>
                    <td>
                        <a href={member.githubURL}>
                            <img src="github.png" alt="GitHub" style={imgStyle}></img>
                        </a>
                    </td>
                    <td>
                        <a href={member.linkedInURL}>
                            <img src="linkedIn.png" alt="LinkedIn" style={imgStyle}></img>
                        </a>
                    </td>
                </tr >
            ))
        )
    }

    tableHeaders() {
        return (
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Major</th>
                <th>Graduation Date</th>
                <th>GitHub</th>
                <th>LinkedIn</th>
            </tr>
        )
    }

    render() {
        return (
            <div style={divStyle}>
                <br />
                <br />

                <input type='search' name='searchValue' onChange={this.handleChange} />

                <select name='searchType' value={this.state.searchType} onChange={this.handleChange}>
                    <option>Name</option>
                    <option>Email</option>
                    <option>Major</option>
                    <option>GraduationDate</option>
                </select>

                <button onClick={() => this.searchUsers()}>Search</button>

                <br />
                <br />

                <table style={tableStyle}>
                    <tbody>
                        {this.tableHeaders()}
                        {this.listUsers()}
                    </tbody>
                </table>

                <br />
                <br />
            </div>
        )
    }
}

export default RecruiterDashboard;
