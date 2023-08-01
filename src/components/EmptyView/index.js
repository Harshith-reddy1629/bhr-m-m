import "./index.css";

const EmptyView = () => (
  <div className="empty-view">
    <img
      src="https://res.cloudinary.com/reddyimgs/image/upload/v1690897144/028b8248-8b62-44e0-95ca-aa1b651c0d68_akbfvr.png"
      alt="empty view"
      className="empty-view-image"
    />

    <h1 className="no-txns-text">No Transactions Found</h1>
  </div>
);

export default EmptyView;
