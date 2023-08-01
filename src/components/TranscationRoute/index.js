import TransactionRouteList from "../TransactionRouteList";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const TransactionRoute = () => {
  const userCreds = Cookies.get("secret_token");

  return userCreds !== undefined ? (
    <div className="container">
      <Sidebar />
      <div className="txn-container">
        <Navbar>Transactions</Navbar>

        <TransactionRouteList />
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace={true} />
  );
};

export default TransactionRoute;
