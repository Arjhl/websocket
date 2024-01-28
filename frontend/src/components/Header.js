import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const userid = localStorage.getItem("id");
  const [userData, setUserData] = useState();
  const navigate = useNavigate();

  const fetchData = async () => {
    const url = `http://localhost:8080/user?userid=${userid}`;
    const response = await fetch(url, {
      method: "get",
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    setUserData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logoutHandler = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      navigate("/login");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className=" bg-slate-200 font-bold text-xl flex justify-between items-center px-5">
      <h1>{userData?.username}</h1>
      <Button variant="unstyled" onClick={logoutHandler}>
        Logout
      </Button>
    </div>
  );
};

export default Header;
