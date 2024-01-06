const { httpError, tryCatch } = require("../helpers");

const {
  listContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
  updateFavorite,
} = require("../db/services/contactServices");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const allContacts = await listContacts({ owner });
  res.status(200).json(allContacts);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const contact = await getContactById(id, owner);
  if (!contact) {
    throw httpError(404, "Not found");
  }
  res.status(200).json(contact);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await createContact({ ...req.body, owner });
  res.status(201).json(newContact);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const deletedContact = await removeContact(id, owner);
  if (!deletedContact) {
    throw httpError(404, "Not found");
  }
  res.status(200).json({ massage: "contact deleted" });
};

const update = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const updatedContactById = await updateContact(id, owner, req.body);
  if (!updatedContactById) {
    throw httpError(404, "Not Found");
  }
  res.status(200).json(updatedContactById);
};
const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  if (!req.body) {
    throw httpError(400, "Missing field favorite");
  }
  const updatedContactById = await updateFavorite(id, owner, req.body);

  if (!updatedContactById) {
    throw httpError(404, "Not Found");
  }
  res.status(200).json(updatedContactById);
};

module.exports = {
  getAllContacts: tryCatch(getAllContacts),
  getById: tryCatch(getById),
  addContact: tryCatch(addContact),
  deleteById: tryCatch(deleteById),
  update: tryCatch(update),
  updateStatusContact: tryCatch(updateStatusContact),
};
