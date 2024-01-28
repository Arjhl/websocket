import { create } from "zustand";

const useContactStore = create((set) => ({
  contactList: [],
  addContact: (contact) =>
    set((state) => ({
      contactList: [...state.contactList, contact],
    })),
  updateContact: (contactList) => set(() => ({ contactList: contactList })),
}));

export default useContactStore;
