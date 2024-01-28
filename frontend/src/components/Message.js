const Message = (props) => {
  const msgtime = new Date(props.message.timeStamp);
  console.log("message", props);
  let messageClass;
  let textalign;
  if (props.message.sender_id === localStorage.getItem("id")) {
    messageClass = " my-1 self-end p-3 rounded-md ";
    textalign = "text-right text-gray-500";
  } else {
    messageClass = " my-1 self-start p-3 rounded-md";
    textalign = "text-left text-gray-500";
  }
  return (
    <div className={messageClass}>
      <p className={textalign}>{props.message.sender}</p>
      <h1 className="bg-blue-100 p-2 rounded">{props.message.message}</h1>
      <p className={textalign}>
        {msgtime.getHours() + ":" + msgtime.getMinutes()}
      </p>
    </div>
  );
};

export default Message;
