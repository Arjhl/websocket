import { Heading } from "@chakra-ui/react";
import { soc } from "./Dashboard";
import { useEffect, useState } from "react";

const ContactList = (props) => {
  const [contacts, setContacts] = useState(props.contactList);
  const messageHandler = (id) => {
    props.setMessages(id);
  };

  function updateContacts(msg) {
    //TODO:the code can be refactored
    if (!msg.timeStamp) return;
    console.log(msg);
    const tempLastMessage = msg.message;
    const receiver_id = msg?.participants?.filter(
      (p) => p !== msg.sender_id
    )[0];
    const tempTimeStamp = msg.timeStamp;
    console.log(contacts);
    if (receiver_id === localStorage.getItem("id")) {
      // current user is the reciever
      const tempContact = contacts.filter(
        (contact) => contact.recieverId === msg.sender_id
      )[0];
      console.log(tempContact);
      if (!tempContact) return;
      tempContact.lastMessage = tempLastMessage;
      tempContact.timeStamp = tempTimeStamp;
      const filteredContacts = contacts?.filter(
        (contact) => contact.recieverId !== tempContact.recieverId
      );
      const sortedContacts = [...filteredContacts, tempContact].sort(function (
        x,
        y
      ) {
        return new Date(y.timeStamp) - new Date(x.timeStamp);
      });
      console.log(sortedContacts);
      setContacts(sortedContacts);
    }
    const tempContact = contacts.filter(
      (contact) => contact.recieverId === receiver_id
    )[0];
    console.log(tempContact);
    if (!tempContact) return;
    tempContact.lastMessage = tempLastMessage;
    tempContact.timeStamp = tempTimeStamp;
    const filteredContacts = contacts?.filter(
      (contact) => contact.recieverId !== receiver_id
    );
    const sortedContacts = [...filteredContacts, tempContact].sort(function (
      x,
      y
    ) {
      return new Date(y.timeStamp) - new Date(x.timeStamp);
    });
    console.log(sortedContacts);
    setContacts(sortedContacts);
  }

  soc.ws.addEventListener("message", function (message) {
    if (soc.ws.OPEN) {
      // const msg = JSON.parse(message.data);
      // messageHandler(message);
      if (message.data) {
        const data = JSON.parse(message.data);
        updateContacts(data);
        // setContacts(data.updateContactList);
      }
    }
  });

  useEffect(() => {
    setContacts(props.contactList);
  }, [props.contactList]);

  return (
    <div>
      {contacts?.map((contact) => {
        return (
          <div
            key={contact.msgObject_id}
            onClick={messageHandler.bind(this, contact.msgObject_id)}
            className=" border-b-2 border-blue-600 w-full p-2 hover:bg-slate-100 cursor-pointer"
          >
            <Heading size="sm">{contact.name}</Heading>
            <p className="p-0 m-0">{contact.lastMessage}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
