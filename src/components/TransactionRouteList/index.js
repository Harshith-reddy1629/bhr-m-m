import { Component } from "react";

import Cookies from "js-cookie";

import TransactionsRouteListItems from "../TransactionsRouteListItems";

import "./index.css";
import FailedView from "../FailedView";
import LoaderView from "../LoaderView";
import EmptyView from "../EmptyView";

const statusOfPage = {
  Loading: "LOADING",
  Succcess: "SUCCESS",
  Failed: "FAILED",
};

class TransactionRouteList extends Component {
  state = {
    status: statusOfPage.Loading,
    allTxnsList: [],
    filteredlist: [],
    userCreds: {},
  };

  componentDidMount() {
    const userCreds = Cookies.get("secret_token");

    console.log(userCreds);

    const parsedObject = JSON.parse(userCreds);

    userCreds !== undefined &&
      this.setState({ userCreds: parsedObject }, this.fetchTxnDetails);
  }

  tryAgain = () => {
    this.fetchTxnDetails();
  };

  fetchTxnDetails = async () => {
    this.setState({ status: statusOfPage.Loading });

    const { userCreds } = this.state;

    const { userId, isAdmin } = userCreds;

    const role = isAdmin ? "admin" : "user";

    const ReqUrl =
      "https://bursting-gelding-24.hasura.app/api/rest/all-transactions?limit=100&offset=0";

    var myHeaders = new Headers();
    myHeaders.append("content-type", "application/json");
    myHeaders.append(
      "x-hasura-admin-secret",
      "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF"
    );
    myHeaders.append("x-hasura-role", role);
    myHeaders.append("x-hasura-user-id", `${userId}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(ReqUrl, requestOptions);

      const result = await response.json();

      const txnData = result.transactions.map((each) => {
        return {
          amount: each.amount,
          id: each.id,
          transactionName: each.transaction_name,
          userId: each.user_id,
          date: each.date,
          type: each.type,
          category: each.category,
        };
      });
      console.log(txnData);

      const sortedData = txnData.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      const ListOfTxns = sortedData.reverse();

      this.setState({
        status: statusOfPage.Succcess,
        allTxnsList: ListOfTxns,
        filteredlist: ListOfTxns,
        activeBtn: "AllTxn",
      });
    } catch (error) {
      this.setState({ status: statusOfPage.Failed });
    }
  };

  onClickCredit = () => {
    const { allTxnsList } = this.state;

    const filteredData = allTxnsList.filter((each) => each.type === "credit");

    this.setState({ filteredlist: filteredData, activeBtn: "credit" });
  };

  onClickDebit = () => {
    const { allTxnsList } = this.state;

    const filteredData = allTxnsList.filter((each) => each.type === "debit");

    this.setState({ filteredlist: filteredData, activeBtn: "debit" });
  };

  onAllTxns = () => {
    const { allTxnsList } = this.state;
    this.setState({ filteredlist: allTxnsList, activeBtn: "AllTxn" });
  };

  successView = () => {
    const { filteredlist, activeBtn, userCreds } = this.state;
    const { isAdmin } = userCreds;
    const isAllTxnActive =
      "AllTxn" === activeBtn ? "txn-btn active-txn-btn" : "txn-btn";
    const isCreditActive =
      "credit" === activeBtn ? "txn-btn active-txn-btn" : "txn-btn";
    const isDebitActive =
      "debit" === activeBtn ? "txn-btn active-txn-btn" : "txn-btn";

    return (
      <div className="transactions-route-container">
        <div className="btns-container">
          <button
            type="button"
            className={isAllTxnActive}
            onClick={this.onAllTxns}
          >
            All Transactions
          </button>
          <button
            type="button"
            className={isDebitActive}
            onClick={this.onClickDebit}
          >
            Debit
          </button>
          <button
            type="button"
            className={isCreditActive}
            onClick={this.onClickCredit}
          >
            Credit
          </button>
        </div>
        {filteredlist.length === 0 ? (
          <div className="empty-view">
            <EmptyView />
          </div>
        ) : (
            <div className='txn-card'> 
          <table className="transactions-container">
            <tr>
              {isAdmin && (
                <th className="transaction-heading-text">User Name</th>
              )}
              <th className="transaction-heading-text">Transaction Name</th>
              <th className="transaction-heading-text">Category</th>
              <th className="transaction-heading-text">Date</th>
              <th className="transaction-heading-text">Amount</th>
              <th> </th>
              <th> </th>
            </tr>
            {filteredlist.map((each) => (
              <TransactionsRouteListItems key={each.id} item={each} />
            ))}
          </table>
            </div>
        )}
      </div>
    );
  };

  loadingView = () => (
    <div className="loader">
      <LoaderView />
    </div>
  );

  failedView = () => (
    <div>
      <FailedView tryAgain={this.tryAgain} />
    </div>
  );
  render() {
    const { status } = this.state;
    switch (status) {
      case statusOfPage.Loading:
        return this.loadingView();
      case statusOfPage.Succcess:
        return this.successView();
      case statusOfPage.Failed:
        return this.failedView();

      default:
        return null;
    }
  }
}

export default TransactionRouteList;
