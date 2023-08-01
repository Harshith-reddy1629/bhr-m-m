import { Component } from "react";

import { Navigate } from "react-router-dom";

import Cookies from "js-cookie";

import Popup from "reactjs-popup";

import { LuLogOut } from "react-icons/lu";

import "reactjs-popup/dist/index.css";

import "./index.css";

class LogoutBtn extends Component {
  state = { logout: false };

  onLogOut = () => {
    Cookies.remove("secret_token");

    <Navigate to="/login" replace={true} />;

    window.location.reload();
  };

  render() {
    return (
      <div className="popup-container">
        <Popup
          modal
          trigger={
            <button type="button" className="edit-btn">
              <LuLogOut size={25} />
            </button>
          }
        >
          {(close) => (
            <div className="logout-container">
              <LuLogOut color="#D97706" size={30} className="logout-logo" />
              <div>
                <p className="sure-text">Are you sure you want to Logout?</p>
                <p>If you click on Yes , you'll be logged out</p>
                <div>
                  <button className="logout-btn" onClick={this.onLogOut}>
                    Yes, Logout
                  </button>
                  <button className="cancel-btn" onClick={() => close()}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </Popup>
      </div>
    );
  }
}

export default LogoutBtn;
