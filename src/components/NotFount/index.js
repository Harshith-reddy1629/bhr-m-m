import { Link } from "react-router-dom";

import "./index.css";

const NotFound = () => (
  <div className="notfound-container">
    <h1>404</h1>
    <p>Page Not Found</p>
    <Link to="/">
      <button className="NF-btn" type="button">
        Go To Home
      </button>
    </Link>
  </div>
);

export default NotFound;
