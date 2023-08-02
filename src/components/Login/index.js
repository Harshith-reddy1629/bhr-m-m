import { Component } from "react";

import { Navigate } from "react-router-dom";

import Cookies from "js-cookie";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import "./index.css";

class Login extends Component {
  state = {
    username: "",
    password: "",
    isAnyFieldEmpty: false,
    isAdminLogging: false,
  };

  getErrorMsg = () => {
    this.setState({ isAnyFieldEmpty: true });
  };

  submissionSuccess = (id) => {
    const Token =
      "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF";

    const { username, isAdminLogging } = this.state;

    const userDetails = {
      secretToken: Token,
      username: username,
      userId: id,
      isAdmin: isAdminLogging,
    };

    Cookies.set("secret_token", JSON.stringify(userDetails), {
      expires: 30,
      path: "/",
    });
    <Navigate to="/" replace={true} />;

    window.location.reload();
  };

  fetching = async () => {
    const { username, password, isAdminLogging } = this.state;

    var myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");
    myHeaders.append(
      "x-hasura-admin-secret",
      "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF"
    );
    var raw = JSON.stringify({
      email: username,
      password: password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://bursting-gelding-24.hasura.app/api/rest/get-user-id`,
        requestOptions
      );

      const result = await response.json();
      console.log(result.get_user_id[0].id, "res login");

      const user = result.get_user_id[0];

      if (user.id !== undefined) {
        if (isAdminLogging) {
          user.id === 3
            ? this.submissionSuccess(user.id)
            : NotificationContainer.error("User cannot login as Admin");
          return;
        } else {
          if (user.id === 3) {
            this.getErrorMsg();
            return;
          } else {
            this.submissionSuccess(user.id);
          }
        }
      } else {
        this.getErrorMsg();
      }
    } catch (error) {
      this.setState({ isAnyFieldEmpty: true });
      console.log(error);
    }
  };

  onSubmitForm = (event) => {
    event.preventDefault();

    const { username, password } = this.state;

    if (username.trim() === "") {
      NotificationManager.warning("Username cannot be empty");

      return;
    }
    if (password.trim() === "") {
      NotificationManager.warning("Enter Password");
      return;
    }

    this.fetching();
  };

  onAdmin = () => {
    this.setState({ isAdminLogging: true });
  };

  onUser = () => {
    this.setState({ isAdminLogging: false });
  };

  onTypingEmail = (event) => {
    this.setState({ username: event.target.value, isAnyFieldEmpty: false });
  };

  onTypingPassword = (event) => {
    this.setState({ password: event.target.value, isAnyFieldEmpty: false });
  };

  render() {
    const { isAnyFieldEmpty, isAdminLogging } = this.state;

    const userCreds = Cookies.get("secret_token");

    return userCreds === undefined ? (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/reddyimgs/image/upload/v1690551063/Frame_507_ogpjs9.png"
          alt="website logo"
          className="login-logo"
        />
        <div className="login-card-container">
          <div className="logger-btn-container">
            <button
              type="button"
              onClick={this.onUser}
              className={`logger-btn ${isAdminLogging && "inactive-logger"}`}
            >
              Login as User
            </button>
            <button
              type="button"
              onClick={this.onAdmin}
              className={`logger-btn ${!isAdminLogging && "inactive-logger"}`}
            >
              Login as Admin
            </button>
          </div>
          <form onSubmit={this.onSubmitForm}>
            <h1 className="login-heading">Login</h1>
            <div className="login-input-container">
              <label>USERNAME</label>
              <input
                className="login-input-element"
                type="email"
                placeholder="Enter mail"
                onChange={this.onTypingEmail}
              />
              <NotificationContainer />
            </div>
            <div className="login-input-container">
              <label>PASSWORD </label>
              <input
                className="login-input-element"
                type="password"
                placeholder="Password"
                onChange={this.onTypingPassword}
              />
            </div>
            {isAnyFieldEmpty && <p className="err-text">*Invalid Inputs</p>}
            <div className="submit-btn-container">
              <button type="submit" className="submit-btn">
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : (
      <Navigate to="/" replace={true} />
    );
  }
}

export default Login;
