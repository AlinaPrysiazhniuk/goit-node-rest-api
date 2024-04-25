import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";
import Joi from "joi";

const addShema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    if (!contacts.length) {
      throw HttpError(404, "Contacts not found");
    }
    res.status(200).json({
      status: "success",
      code: 200,
      data: { contacts },
    });
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.removeContact(id);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = addShema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { name, email, phone } = req.body;
    const contact = await contactsService.addContact(name, email, phone);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = (req, res) => {};
