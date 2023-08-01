import Cookies from "js-cookie";

import LogoutBtn from "../LogoutBtn";

import "./index.css";
import UserList from "../UserList";

const ProfileBox = () => {
  const userCreds = Cookies.get("secret_token");

  const parsedObject = JSON.parse(userCreds);

  const { userId } = parsedObject;

  const userO = UserList.find((each) => each.id === userId);

  const { name, email } = userO;

  return (
    <div className="user-profile">
      <div className="profile-box">
        <img
          src="https://res.cloudinary.com/reddyimgs/image/upload/v1687011162/Avatar_zhzj4v.png"
          alt="profile"
        />

        <div className="user-info">
          <h1 className="user-text">{name}</h1>

          <p>{email}</p>
        </div>
      </div>

      <LogoutBtn className="logout" />
    </div>
  );
};

export default ProfileBox;
