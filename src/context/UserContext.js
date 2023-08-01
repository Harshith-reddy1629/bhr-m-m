import { createContext } from "react";

const userContext = createContext({
  username: "",
  userId: "",
  asAdmin: "",
  updateContext: () => {},
});

export default userContext;
