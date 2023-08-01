import Cookies from "js-cookie";
import AddTxnPopUp from "../AddTxnPopUp";
import "./index.css";

const Navbar = (props) => {
  const userCreds = Cookies.get("secret_token");

  const parsedObject = JSON.parse(userCreds);

  const { isAdmin } = parsedObject;

  const admin = !isAdmin;
  return (
    <nav className="nav-container">
      <h1>{props.children}</h1>
      {admin && <AddTxnPopUp />}
    </nav>
  );
};

export default Navbar;
