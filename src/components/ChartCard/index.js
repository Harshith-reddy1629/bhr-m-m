import { Component } from "react";

import Cookies from "js-cookie";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./index.css";

import GetReqFormat from "../RecentTxnsDateConverter";
import FailedView from "../FailedView";
import LoaderView from "../LoaderView";

const statusOfPage = {
  Loading: " LOADING",
  Success: "SUCCESS",
  Failed: "FAILED",
};

class ChartCard extends Component {
  state = { Last7DaysTxns: [], status: "LOADING", userCreds: {} };

  componentDidMount() {
    const userCreds = Cookies.get("secret_token");

    console.log(userCreds);

    const parsedObject = JSON.parse(userCreds);

    userCreds !== undefined &&
      this.setState({ userCreds: parsedObject }, this.fetch7DaysData);
  }

  tryagain = () => {
    this.fetch7DaysData();
  };

  fetch7DaysData = async () => {
    this.setState({ status: statusOfPage.Loading });

    const { userCreds } = this.state;

    const { userId, isAdmin } = userCreds;

    const role = isAdmin ? "admin" : "user";

    const ReqUrl =
      "https://bursting-gelding-24.hasura.app/api/rest/daywise-totals-7-days";

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

      console.log(response);

      const result = await response.json();

      const sevenDaysTxn = result.last_7_days_transactions_credit_debit_totals;

      const inRequiredFormat = GetReqFormat(sevenDaysTxn);

      console.log(inRequiredFormat);

      this.setState({
        status: statusOfPage.Success,
        Last7DaysTxns: inRequiredFormat,
      });
    } catch (error) {
      this.setState({ status: statusOfPage.Failed });
    }
  };

  loadingView = () => (
    <div className="chart-loader">
      <LoaderView />
    </div>
  );

  successView = () => {
    const DataFormatter = (number) => {
      if (number > 1000) {
        return `${(number / 1000).toString()}k`;
      }
      return number.toString();
    };

    const { Last7DaysTxns } = this.state;

    return (
      <ResponsiveContainer
        className="responsive-container"
        width="100%"
        height={400}
      >
        <BarChart
          className="bar"
          data={Last7DaysTxns}
          margin={{
            top: 5,
          }}
        >
          <XAxis
            dataKey="day"
            tick={{
              stroke: "gray",
              strokeWidth: 1,
            }}
          />

          <YAxis
            tickFormatter={DataFormatter}
            tick={{
              stroke: "gray",
              strokeWidth: 0,
            }}
          />
          <Legend
            wrapperStyle={{
              padding: 20,
              borderRadius: "15px",
            }}
          />

          <Bar dataKey="debit" name="Debit" fill="#1f77b4" barSize="10%" />
          <Bar dataKey="credit" name="Credit" fill="#fd7f0e" barSize="10%" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  failedView = () => (
    <div>
      <FailedView tryAgain={this.tryagain} />{" "}
    </div>
  );

  ChartCardView = () => {
    const { status } = this.state;
    switch (status) {
      case statusOfPage.Success:
        return this.successView();
      case statusOfPage.Loading:
        return this.loadingView();
      case statusOfPage.Failed:
        return this.failedView();
      default:
        break;
    }
  };

  render() {
    return (
      <>
        <h1 className="debit-credit-overview">Debit & Credit Overview</h1>
        {this.ChartCardView()}
      </>
    );
  }
}

export default ChartCard;
