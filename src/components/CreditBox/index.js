import { BsCurrencyDollar } from "react-icons/bs";

import "./index.css";

const CreditBox = (props) => {
  const { Creditdata } = props;

  const { sum } = Creditdata;

  return (
    <div className="credit-container">
      <div className="credit-amount-container">
        <h1 className="credit-amount-text">
          <BsCurrencyDollar />
          {sum}
        </h1>
        <p className="credit-text">Credit</p>
      </div>
      <img
        src="https://res.cloudinary.com/reddyimgs/image/upload/v1690551063/Group_fnu7wc.png"
        alt="credit"
        className="credit-image"
      />
    </div>
  );
};
export default CreditBox;
