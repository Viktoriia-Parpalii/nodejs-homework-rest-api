const Contact = require("../models/contactModel");

const listContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};
const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};
const createContact = async (body) => {
  const newContact = await Contact.create(body);
  return newContact;
};
const removeContact = async (id) => {
  const delatedContact = await Contact.findByIdAndDelete(id);
  return delatedContact;
};
const updateContact = async (id, body) => {
  const updatedContact = await Contact.findByIdAndUpdate(id, body, {
    new: true,
  });
  return updatedContact;
};

const updateFavorite = async (id, body) => {
  const updatedContact = await Contact.findByIdAndUpdate(id, body, {
    new: true,
  });
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
  updateFavorite,
};
