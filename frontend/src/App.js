import { Button } from "@chakra-ui/react";
import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const nav = useNavigate();
  return (
    <div className="flex h-screen w-screen  justify-center items-center gap-8">
      <Button
        width={100}
        onClick={() => {
          nav("/signup");
        }}
      >
        Signup
      </Button>
      <Button
        width={100}
        onClick={() => {
          nav("/login");
        }}
      >
        Login
      </Button>
    </div>
  );
}

export default App;
