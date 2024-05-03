import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", isValidId, updateContact);

contactsRouter.patch("/:id/favorite", isValidId, updateStatusContact);

export default contactsRouter;
