import React, { Component } from "react";
export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: "",
    };
  }
  componentDidMount() {
    const { token } = this.props;

    fetch("http://localhost:5000/userData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        this.setState({ userData: data.data });
      });
  }

  logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };
  render() {
    return (
      <div>
        <div>
          <h4>Name:{this.state.userData.fname}</h4>
          <h4>
            Email:
            <br />
            {this.state.userData.email}
          </h4>
          <br />
          <button onClick={this.logOut} className="btn btn-primary">
            Log Out
          </button>
        </div>
      </div>
    );
  }
}
