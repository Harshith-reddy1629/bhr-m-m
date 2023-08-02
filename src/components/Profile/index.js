import { Component } from "react";

import { Navigate } from "react-router-dom";

import Cookies from "js-cookie";

import Navbar from "../Navbar";

import Sidebar from "../Sidebar";

import "./index.css";
import FailedView from "../FailedView";
import LoaderView from "../LoaderView";

const statusOfPage = {
  Loading: " LOADING",
  Success: "SUCCESS",
  Failed: "FAILED",
};

class Profile extends Component {
  state = { userDetails: {}, status: "LOADING", userCreds: {} };

  componentDidMount() {
    const userCreds = Cookies.get("secret_token");

    const parsedObject =
      userCreds !== undefined ? JSON.parse(userCreds) : undefined;

    userCreds !== undefined &&
      this.setState({ userCreds: parsedObject }, this.fetchAccountDetails);
  }

  tryAgain = () => {
    this.fetchAccountDetails();
  };

  fetchAccountDetails = async () => {
    this.setState({ status: statusOfPage.Loading });

    const { userCreds } = this.state;

    const { userId } = userCreds;

    const ReqUrl = "https://bursting-gelding-24.hasura.app/api/rest/profile";

    var myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");
    myHeaders.append(
      "x-hasura-admin-secret",
      "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF"
    );
    myHeaders.append("x-hasura-role", "user");
    myHeaders.append("x-hasura-user-id", `${userId}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(ReqUrl, requestOptions);

      const result = await response.json();
      console.log("llr", result.users);

      const user = {
        city: result.users[0].city,
        country: result.users[0].country,
        dateOfBirth: result.users[0].date_of_birth,
        email: result.users[0].email,
        id: result.users[0].id,
        name: result.users[0].name,
        permanentAddress: result.users[0].permanent_address,
        postalCode: result.users[0].postal_code,
        presentAddress: result.users[0].present_address,
      };

      this.setState({ userDetails: user, status: statusOfPage.Success });
    } catch (error) {
      this.setState({ status: statusOfPage.Failed });
    }
  };

  SuccessView = () => {
    const { userDetails } = this.state;

    return (
      <div className="profile-card">
        <img
          src="https://p.kindpng.com/picc/s/24-248325_profile-picture-circle-png-transparent-png.png"
          alt="profile"
          className="profile-image"
        />

        <ul className="bio-container">
          <li className="user-bio-li-items">
            <label htmlFor="name" className="bio-labels">
              Your Name
            </label>
            <input
              value={userDetails.name}
              className="input-element"
              id="name"
              type="text"
              onChange={() => {}}
            />
          </li>
          <li className="user-bio-li-items">
            <label htmlFor="UserName" className="bio-labels">
              User Name
            </label>
            <input
              className="input-element"
              id="UserName"
              type="text"
              //   placeholder="user name"
              value={userDetails.name}
              onChange={() => {}}
            />
          </li>
          <li className="user-bio-li-items">
            <label htmlFor="Email" className="bio-labels">
              Email
            </label>
            <input
              className="input-element"
              id="Email"
              type="email"
              //   placeholder="email"
              value={userDetails.email}
              onChange={() => {}}
            />
          </li>
          <li className="user-bio-li-items">
            <label htmlFor="password" className="bio-labels">
              Password
            </label>
            <input
              className="input-element"
              id="password"
              type="password"
              //   placeholder="**********"
              value="**********"
              onChange={() => {}}
            />
          </li>
          <li className="user-bio-li-items">
            <label htmlFor="DOB" className="bio-labels">
              Date of Birth
            </label>
            <select className="input-element" id="DOB" name="dob">
              <option className="option-el" value="Dob">
                {userDetails.dateOfBirth}
              </option>
            </select>
          </li>
          <li className="user-bio-li-items">
            <label htmlFor="presentAddress" className="bio-labels">
              Present Address
            </label>
            <input
              className="input-element"
              id="presentAddress"
              type="text"
              placeholder="Present Address"
              value={userDetails.presentAddress}
              onChange={() => {}}
            />
          </li>
          <li className="user-bio-li-items">
            <label htmlFor="permanentAddress" className="bio-labels">
              Permanent Address
            </label>
            <input
              className="input-element"
              id="permanentAddress"
              type="text"
              placeholder="Permanent Address"
              value={userDetails.permanentAddress}
              onChange={() => {}}
            />
          </li>
          <li className="user-bio-li-items">
            <label htmlFor="city" className="bio-labels">
              City
            </label>
            <input
              className="input-element"
              id="city"
              type="text"
              placeholder="City"
              value={userDetails.city}
              onChange={() => {}}
            />
          </li>
          <li className="user-bio-li-items">
            <label htmlFor="postalCode" className="bio-labels">
              Postal Code
            </label>
            <input
              className="input-element"
              id="postal Code"
              type="text"
              placeholder="Postal Code"
              value={userDetails.postalCode}
              onChange={() => {}}
            />
          </li>
          <li className="user-bio-li-items">
            <label htmlFor="country" className="bio-labels">
              Country
            </label>
            <input
              className="input-element"
              id="country"
              type="text"
              placeholder="Country"
              value="Country"
              onChange={() => {}}
            />
          </li>
        </ul>
      </div>
    );
  };

  loadingView = () => (
    <div>
      <LoaderView />
    </div>
  );

  failedView = () => (
    <div>
      <FailedView tryAgain={this.tryAgain} />
    </div>
  );

  displayView = () => {
    const { status } = this.state;
    switch (status) {
      case statusOfPage.Success:
        return this.SuccessView();
      case statusOfPage.Loading:
        return this.loadingView();
      case statusOfPage.Failed:
        return this.failedView();

      default:
        return null;
    }
  };

  render() {
    const userCreds = Cookies.get("secret_token");

    return userCreds === undefined ? (
      <Navigate to="/login" replace={true} />
    ) : (
      <div className="container">
        <Sidebar />
        <div className="txn-container">
          <Navbar>Profile</Navbar>
          <div className="profile-container">{this.displayView()}</div>
        </div>
      </div>
    );
  }
}

export default Profile;
