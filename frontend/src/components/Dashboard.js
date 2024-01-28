import Header from "./Header";
import ContactList from "./ContactList";
import { useState, useEffect } from "react";
import MessageBox from "./MessageBox";
import MessageInput from "./MessageInput";
import Socket from "../websocket/websocket";
import AddContact from "./AddContact";
import { Heading } from "@chakra-ui/react";

export const soc = new Socket();
const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState({
    messagelist: [],
  });

  const getMessageData = async (messageObjId) => {
    const res = await fetch(
      `http://localhost:8080/message?messageId=${messageObjId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await res.json();
    console.log(data);
    setMessages(data);
  };

  const getContactData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/contact?userId=${localStorage.getItem("id")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log(data);
      const tempContact = data.contactList;

      const sortedContacts = tempContact.sort(function (x, y) {
        return new Date(y.timeStamp) - new Date(x.timeStamp);
      });
      console.log(sortedContacts);
      setContacts(sortedContacts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getContactData();
  }, []);

  const addContact = async (email) => {
    //get the contact details using email
    const url = `http://localhost:8080/user/email?emailId=${email}`;
    const response = await fetch(url, {
      method: "get",
      credentials: "include",
    });
    const receiverData = await response.json();
    console.log(receiverData);

    //add contact router and get the msgobjid , send it to contactlist
    const addContactResponse = await fetch(
      " http://localhost:8080/contact/add",
      {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderName: localStorage.getItem("username"),
          receiverName: receiverData.username,
          senderId: localStorage.getItem("id"),
          receiverId: receiverData._id,
        }),
      }
    );

    console.log(addContactResponse);
  };

  //listen to ws read status and change the state accordingly

  const sendmessageHandler = async (message, participants, messageId) => {
    soc.sendMessage(message, participants, messageId);
  };

  return (
    <div className=" w-full h-screen">
      <div className="text-bg">
        <Header />
      </div>
      <div className="flex gap-5 h-95 w-full">
        <div className="flex flex-col w-1/4 mx-2 my-5 rounded-md px-2 bg-slate-50 relative">
          <Heading className="my-2">Contacts</Heading>
          <ContactList setMessages={getMessageData} contactList={contacts} />
          <AddContact addContact={addContact} />
        </div>
        <div className="flex flex-col justify-between mx-2 my-5 rounded-md px-2 w-3/4 bg-red-50 scrollBarNone">
          <MessageBox
            messages={messages.messagelist}
            msgObjId={messages._id}
            key={messages}
          />
          <MessageInput
            messageHandler={sendmessageHandler}
            participants={messages.participants}
            messageId={messages._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
