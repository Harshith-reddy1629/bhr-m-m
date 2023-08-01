import "./index.css";
import TxnList from "../TxnList";

const TransactionsCard = () => {
  return (
    <div className="last-txn-card">
      <h1 className="last-txn">Last Transactions</h1>
      <TxnList />
    </div>
  );
};

export default TransactionsCard;
