import Message from "./Message";
import { soc } from "./Dashboard";
import { useRef } from "react";
import { useEffect, useState } from "react";

const MessageBox = (props) => {
  const [messages, setMessages] = useState(props.messages);
  console.log(messages);
  const scrollref = useRef();
  const msgTimeZero =
    props.messages.length > 0
      ? new Date(props.messages[0]?.timeStamp)
      : undefined;
  let flag;
  if (msgTimeZero) {
    flag =
      msgTimeZero.getDay() +
      "/" +
      `${msgTimeZero.getMonth() + 1}` +
      "/" +
      msgTimeZero.getFullYear();
  }

  const readUpdate = async (messageid, sender_id) => {
    // send ws readstatus here
    if (messageid && sender_id !== localStorage.getItem("id")) {
      const obj = {
        messageId: messageid,
        msgid: props.msgObjId,
        sender_id: sender_id,
        receiver_id: localStorage.getItem("id"),
        status: true,
      };
      soc.sendReadStatus(obj);
    }
  };

  //websocket listener
  soc.ws.addEventListener("message", function (message) {
    if (soc.ws.OPEN) {
      // const msg = JSON.parse(message.data);
      // messageHandler(message);
      if (message.data) {
        console.log(message.data);
        messageHandler(JSON.parse(message?.data));
      }
    }
  });
  const scrollToBottom = () => {
    scrollref.current.scrollIntoView({ behavior: "smooth" });
  };

  const messageHandler = async (data) => {
    const temp = messages;
    temp.push(data);
    setMessages([...temp]);
    scrollToBottom();
  };

  useEffect(() => {
    setMessages(props.messages);
  }, [props.messages]);

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <div className="h-full flex flex-col overflow-scroll scrollBarNone ">
      <div className=" flex-auto"></div>
      {messages.length > 0 &&
        messages.map((msg, i) => {
          // if (!msg) return;
          // if (msg?.read === false && msg.messageid) {
          //   readUpdate(msg?.messageid, msg.sender_id);
          // }
          const msgtime = new Date(msg?.timeStamp);
          const lastTime =
            msgtime.getDay() +
            "/" +
            `${msgtime.getMonth() + 1}` +
            "/" +
            msgtime.getFullYear();

          return (
            <>
              {(flag !== lastTime || i === 0) && (
                <p className="text-center">{lastTime}</p>
              )}
              <Message message={msg} />
            </>
          );
        })}
      <div ref={scrollref} className="h-2 bg-red-400"></div>
    </div>
  );
};

export default MessageBox;
