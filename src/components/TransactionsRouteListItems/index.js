import {
  BsCurrencyDollar,
  BsArrowUpCircle,
  BsArrowDownCircle,
} from "react-icons/bs";

import Cookies from "js-cookie";

import UpdateTxnPopup from "../UpdateTxnPopup";

import "./index.css";
import DeletePopup from "../DeletePopUp";
import DateConverter from "../DateConverter";
import UserList from "../UserList";

const TransactionsRouteListItems = (props) => {
  const { item } = props;

  const { id, transactionName, type, category, date, amount, userId } = item;

  const UserO = UserList.find((each) => each.id === userId);

  const usersName = UserO.name;

  const reqItem =
    type === "credit" ? (
      <BsArrowUpCircle size={25} />
    ) : (
      <BsArrowDownCircle size={25} />
    );

  const classOfReqType =
    type === "credit" ? "credit-amount-text" : "debit-amount-text";
  const ReqSign = type === "credit" ? "+" : "-";

  const formattedDate = DateConverter(date);

  const userCreds = Cookies.get("secret_token");

  const parsedObject = JSON.parse(userCreds);

  const { isAdmin } = parsedObject;

  const admin = !isAdmin;

  return (
    <tr className="transaction-item-row">
      {isAdmin && (
        <td className="txnname">
          {reqItem} {usersName}
        </td>
      )}
      <td className={!isAdmin && "txnname"}>
        {!isAdmin && reqItem} {transactionName}
      </td>
      <td>{category}</td>
      <td>{formattedDate}</td>
      <td className={classOfReqType}>
        {ReqSign}
        <BsCurrencyDollar />
        {amount}
      </td>
      {admin && (
        <td>
          <UpdateTxnPopup item={item} />
        </td>
      )}
      {admin && (
        <td>
          <DeletePopup id={id} />
        </td>
      )}
    </tr>
  );
};

export default TransactionsRouteListItems;
