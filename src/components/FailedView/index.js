import { LuAlertTriangle } from "react-icons/lu";

import "./index.css";

const FailedView = (props) => {
  const onTryAgain = () => {
    const { tryAgain } = props;
    tryAgain();
  };

  return (
    <div className="failed-container">
      <LuAlertTriangle size={35} />
      <button className="failed-btn" type="button" onClick={onTryAgain}>
        Try Again
      </button>
    </div>
  );
};

export default FailedView;
