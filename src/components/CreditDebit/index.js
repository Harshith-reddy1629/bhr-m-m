import { Component } from "react";

import Cookies from "js-cookie";

import DebitBox from "../DebitBox";
import CreditBox from "../CreditBox";

import "./index.css";
import FailedView from "../FailedView";
import LoaderView from "../LoaderView";

const creditDebitStatus = {
  Loading: "LOADING",
  Succcess: "SUCCESS",
  Failed: "FAILED",
};

class CreditDebit extends Component {
  state = {
    status: "LOADING",
    CreditAmountData: [],
    DebitAmountData: [],
    userCreds: {},
  };

  componentDidMount() {
    const userCreds = Cookies.get("secret_token");

    console.log(userCreds);

    const parsedObject = JSON.parse(userCreds);

    userCreds !== undefined &&
      this.setState({ userCreds: parsedObject }, this.fetchCDData);
  }

  tryAgain = () => {
    this.fetchCDData();
  };

  fetchCDData = async () => {
    this.setState({ status: creditDebitStatus.Loading });

    const { userCreds } = this.state;

    const { userId, isAdmin } = userCreds;

    const role = isAdmin ? "admin" : "user";

    const ReqUrl =
      "https://bursting-gelding-24.hasura.app/api/rest/credit-debit-totals";

    const options = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret":
          "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        "x-hasura-role": role,
        "x-hasura-user-id": `${userId}`,
      },
    };

    try {
      const response = await fetch(ReqUrl, options);

      const result = await response.json();

      const data = result.totals_credit_debit_transactions;

      const creditAmount = data.find((each) => each.type === "credit");
      const debitAmount = data.find((each) => each.type === "debit");

      this.setState({
        status: creditDebitStatus.Succcess,
        CreditAmountData:
          creditAmount !== undefined ? creditAmount : { sum: 0 },
        DebitAmountData: debitAmount !== undefined ? debitAmount : { sum: 0 },
      });
    } catch (error) {
      this.setState({ status: creditDebitStatus.Failed });
    }
  };

  successView = () => {
    const { DebitAmountData, CreditAmountData } = this.state;

    return (
      <div className="creditdebit-container">
        <CreditBox Creditdata={CreditAmountData} />
        <DebitBox Debitdata={DebitAmountData} />
      </div>
    );
  };

  failedView = () => (
    <div>
      <FailedView tryAgain={this.tryAgain} />
    </div>
  );

  render() {
    const { status } = this.state;

    switch (status) {
      case creditDebitStatus.Loading:
        return (
          <div className="loader">
            <LoaderView />
          </div>
        );
      case creditDebitStatus.Succcess:
        return this.successView();

      case creditDebitStatus.Failed:
        return this.failedView();

      default:
        return null;
    }
  }
}

export default CreditDebit;
