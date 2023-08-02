import { Component } from "react";

import Cookies from "js-cookie";

import TransactionsRouteListItems from "../TransactionsRouteListItems";

import "./index.css";
import FailedView from "../FailedView";
import LoaderView from "../LoaderView";
import EmptyView from "../EmptyView";

const TxnListStatus = {
  Loading: "LOADING",
  Succcess: "SUCCESS",
  Failed: "FAILED",
};

class TxnList extends Component {
  state = { status: "LOADING", ListOfTransactions: [], userCreds: {} };

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
    this.setState({ status: TxnListStatus.Loading });

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
        status: TxnListStatus.Succcess,
        ListOfTransactions: ListOfTxns,
      });
    } catch (error) {
      this.setState({ status: TxnListStatus.Failed });
      console.log(error);
    }
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

  SucccessView = () => {
    const { ListOfTransactions } = this.state;

    const threeTxns = ListOfTransactions.slice(0, 3);

    return threeTxns.length === 0 ? (
      <EmptyView />
    ) : (
      <div className="recent-txn-card">
        <table className="transactions-container">
          {threeTxns.map((each) => (
            <TransactionsRouteListItems key={each.id} item={each} />
          ))}
        </table>
      </div>
    );
  };

  render() {
    const { status } = this.state;

    switch (status) {
      case TxnListStatus.Loading:
        return this.loadingView();

      case TxnListStatus.Succcess:
        return this.SucccessView();

      case TxnListStatus.Failed:
        return this.failedView();

      default:
        return null;
    }
  }
}

export default TxnList;
