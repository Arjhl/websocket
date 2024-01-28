import { Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      });
      navigate("/login");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col gap-5 h-screen justify-center items-center"
    >
      <Input
        placeholder="Enter Email"
        variant="unstyled"
        width={300}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <Input
        type="text"
        variant="unstyled"
        placeholder="Enter Username"
        width={300}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <Input
        type="password"
        variant="unstyled"
        placeholder="Enter Password"
        width={300}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Button type="submit" className=" w-auto m-2 p-0">
        Signup
      </Button>
    </form>
  );
};

export default Signup;
