import { Component } from "react";

import Popup from "reactjs-popup";

import { MdOutlineModeEditOutline } from "react-icons/md";

import "reactjs-popup/dist/index.css";

import Cookies from "js-cookie";

import "react-notifications/lib/notifications.css";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import "./index.css";

const TxnDetails = {
  transactionName: "",
  type: "credit",
  category: "Food",
  amount: "",
  date: "2023-07-31",
};

class UpdateTxnPopup extends Component {
  state = { txnDetails: TxnDetails };

  componentDidMount() {
    const { item } = this.props;

    this.setState({ txnDetails: item });
  }

  onTypingName = (event) => {
    const { txnDetails } = this.state;

    const newValue = event.target.value;

    const updatedOb = { ...txnDetails, transactionName: newValue };

    this.setState({ txnDetails: updatedOb });
  };

  onTypingAmount = (event) => {
    const { txnDetails } = this.state;

    const newValue = event.target.value;

    const updatedOb = { ...txnDetails, amount: newValue };
    this.setState({ txnDetails: updatedOb });
  };

  onTxnType = (event) => {
    const { txnDetails } = this.state;

    const newValue = event.target.value;

    const updatedOb = { ...txnDetails, type: newValue };
    this.setState({ txnDetails: updatedOb });
  };

  onChangingDate = (event) => {
    const { txnDetails } = this.state;

    const newValue = event.target.value;

    const updatedOb = { ...txnDetails, date: newValue };
    this.setState({ txnDetails: updatedOb });
  };

  onCategorySelection = (event) => {
    const { txnDetails } = this.state;

    const newValue = event.target.value;

    const updatedOb = { ...txnDetails, category: newValue };
    this.setState({ txnDetails: updatedOb });
  };

  onAddingTxn = (event) => {
    event.preventDefault();

    const { txnDetails } = this.state;

    const { amount, transactionName } = txnDetails;

    const amountValidation = !isNaN(amount) && amount !== "";

    console.log(transactionName);

    const txnValidation =
      transactionName.length > 30 || transactionName.trim() === ""
        ? alert(
            "transaction name shuold be below 30 charecters and cannot be empty"
          )
        : true;

    const isEveryFieldOkay = amountValidation && txnValidation;

    console.log(isEveryFieldOkay);

    if (isEveryFieldOkay === true) {
      this.AddTxn();
    } else {
      NotificationManager.error("Enter valid Input");
      return;
    }
  };

  AddTxn = async () => {
    const userCreds = Cookies.get("secret_token");

    const parsedObject = JSON.parse(userCreds);

    const { userId } = parsedObject;

    const { txnDetails } = this.state;

    const { id, transactionName, type, category, date, amount } = txnDetails;

    var raw = {
      id: id,
      name: transactionName,
      type: type,
      category: category,
      amount: amount,
      date: new Date(date),
    };

    const reqUrl =
      "https://bursting-gelding-24.hasura.app/api/rest/update-transaction";

    var myHeaders = new Headers();

    myHeaders.append("content-type", "application/json");

    myHeaders.append(
      "x-hasura-admin-secret",
      "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF"
    );

    myHeaders.append("x-hasura-role", "user");

    myHeaders.append("x-hasura-user-id", `${userId}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    };
    fetch(reqUrl, requestOptions)
      .then(
        NotificationManager.success(
          "Page will be reloaded to update in portal",
          "Updated Successfully"
        )
      )
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        alert("Something went Wrong");
        return;
      });
  };

  render() {
    const { txnDetails } = this.state;

    const { transactionName, category, amount, type, date } = txnDetails;

    const D = date.slice(0, 10);

    return (
      <div className="popup-container">
        <Popup
          modal
          trigger={
            <button type="button" className="edit-btn">
              <MdOutlineModeEditOutline size={25} />
            </button>
          }
        >
          {(close) => (
            <div className="add-txn-popup-container">
              <h1 className="add-txn-heading-text">Update Transaction</h1>

              <p className="add-txn-para-text">Update a Transaction</p>

              <form className="add-txn-form" onSubmit={this.onAddingTxn}>
                <div className="input-container">
                  <label htmlFor="transactionName" className="add-txn-label">
                    Transaction Name<span className="span-el">*</span>
                  </label>
                  <input
                    id="transactionName"
                    type="text"
                    placeholder="Enter Name"
                    className="add-txn-input"
                    value={transactionName}
                    onChange={this.onTypingName}
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="txnType" className="add-txn-label">
                    Transaction Type<span className="span-el">*</span>
                  </label>
                  <select
                    id="txnType"
                    placeholder="Select Transaction Type"
                    className="add-txn-input"
                    value={type}
                    onChange={this.onTxnType}
                  >
                    <option value="credit">credit</option>
                    <option value="debit">debit</option>
                  </select>
                </div>
                <div className="input-container">
                  <label htmlFor="txnCategory" className="add-txn-label">
                    Category<span className="span-el">*</span>
                  </label>
                  <select
                    id="txnCategory"
                    placeholder="Select Transaction Type"
                    className="add-txn-input"
                    value={category}
                    onChange={this.onCategorySelection}
                  >
                    <option value="Food">Food</option>

                    <option value="Shopping">Shopping</option>

                    <option value="Materials">Materials</option>

                    <option value="Books">Books</option>

                    <option value="Grocery">Grocery</option>

                    <option value="Transfer">Transfer</option>
                  </select>
                </div>
                <div className="input-container">
                  <label htmlFor="amount" className="add-txn-label">
                    Amount<span className="span-el">*</span>
                  </label>
                  <input
                    id="amount"
                    type="text"
                    placeholder="Enter Your Amount"
                    className="add-txn-input"
                    value={amount}
                    onChange={this.onTypingAmount}
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="date" className="add-txn-label">
                    Date<span className="span-el">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={D}
                    placeholder="Enter Name"
                    className="add-txn-input"
                    onChange={this.onChangingDate}
                  />
                </div>
                <div>
                  <button className="submit-btn" type="submit">
                    Update Transaction
                  </button>
                </div>
              </form>
              <NotificationContainer />
            </div>
          )}
        </Popup>
      </div>
    );
  }
}

export default UpdateTxnPopup;
