import { useContext } from "react";
import { UserContext } from "../context/UserContext"; // 👈 correct path

const useUser = () => {
  return useContext(UserContext);
};

export default useUser;
