import "./index.css";

import { TailSpin } from "react-loader-spinner";

const LoaderView = () => (
  <div className="loader-container">
    <TailSpin color="#0b69ff" height="50" width="50" />{" "}
  </div>
);

export default LoaderView;
