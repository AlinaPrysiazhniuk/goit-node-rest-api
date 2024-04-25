import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";
import controllerDecorator from "../helpers/controllerDecorator.js";

export const getAllContacts = controllerDecorator(async (req, res) => {
  const contacts = await contactsService.listContacts();
  if (!contacts.length) {
    throw HttpError(404, "Contacts not found");
  }
  res.status(200).json({
    status: "success",
    code: 200,
    data: { contacts },
  });
});

export const getOneContact = controllerDecorator(async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({
    status: "success",
    code: 200,
    data: contact,
  });
});

export const deleteContact = controllerDecorator(async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.removeContact(id);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(contact);
});

export const createContact = controllerDecorator(async (req, res) => {
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { name, email, phone } = req.body;
  const contact = await contactsService.addContact(name, email, phone);
  res.status(201).json(contact);
});

// export const updateContact = controllerDecorator(async (req, res) => {
//   const { error } = createContactSchema.validate(req.body);
//   if (error) {
//     throw HttpError(400, error.message);
//   }

//   const { id } = req.params;
//   const { name, email, phone } = req.body;
//   if (!req.body) {
//     throw HttpError(400, "Body must have at least one field");
//   }
//   const updatedContact = await contactsService.updateContact(
//     id,
//     name,
//     email,
//     phone
//   );
//   if (!updatedContact) {
//     return res.status(404).json({ message: "Contact not found" });
//   }
//   res.status(201).json(updatedContact);
// });
