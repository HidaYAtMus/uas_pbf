let currentID = 0;

export function addContact(contact) {
  const { name, phone, email } = contact;
  currentID += 1;

  return {
    type: "ADD_CONTACT",
    id: currentID,
    name,
    phone,
    email
  };
}

export function removeContact(id) {
  return {
    type: "REMOVE_CONTACT",
    id
  };
}