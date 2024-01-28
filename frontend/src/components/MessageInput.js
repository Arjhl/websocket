import { Input, Button } from "@chakra-ui/react";
import { useRef } from "react";

const MessageInput = (props) => {
  const messageRef = useRef("");

  function messageHandler(e) {
    e.preventDefault();
    props.messageHandler(
      messageRef.current.value,
      props.participants,
      props.messageId
    );
    messageRef.current.value = "";
  }

  return (
    <form onSubmit={messageHandler} className="flex my-3 gap-2 p-2">
      <Input placeholder="Type a message" ref={messageRef} />
      <Button type="submit">Send</Button>
    </form>
  );
};

export default MessageInput;
