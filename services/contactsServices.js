import path from "node:path";
import * as fs from "node:fs/promises";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

async function writeContacts(contacts) {
  const data = await fs.writeFile(
    contactsPath,
    JSON.stringify(contacts, null, 2)
  );
  return data;
}

async function listContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function getContactById(id) {
  const contacts = await listContacts();
  const contact = contacts.find((item) => item.id === id);
  if (typeof contact === "undefined") {
    return null;
  }
  return contact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }

  const removeContact = contacts[index];
  contacts.splice(index, 1);
  await writeContacts(contacts);
  return removeContact;
}

async function updateContact(id, name, email, phone) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  if (name !== undefined) {
    contacts[index].name = name;
  }
  if (email !== undefined) {
    contacts[index].email = email;
  }
  if (phone !== undefined) {
    contacts[index].phone = phone;
  }

  await writeContacts(contacts);
  return contacts[index];
}

export default {
  getContactById,
  removeContact,
  addContact,
  listContacts,
  updateContact,
};
