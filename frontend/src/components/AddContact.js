import { Button, Input } from "@chakra-ui/react";
import { useRef } from "react";

const AddContact = (props) => {
  const inputRef = useRef("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);
    props.addContact(inputRef.current.value);
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex gap-3 absolute bottom-4 w-4/5"
    >
      <Input type="text" placeholder="Add Contact" ref={inputRef} />
      <Button type="submit" className="text-sm">
        ✉️
      </Button>
    </form>
  );
};

export default AddContact;
