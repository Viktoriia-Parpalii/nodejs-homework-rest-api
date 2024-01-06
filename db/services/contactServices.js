const Contact = require("../models/contactModel");

const listContacts = async (query, pagination) => {
  const contacts = await Contact.find(query, "", pagination).populate(
    "owner",
    "email"
  );
  return contacts;
};
const getContactById = async (id, owner) => {
  const contact = await Contact.findOne({ _id: id, owner });
  return contact;
};
const createContact = async (body) => {
  const newContact = await Contact.create(body);
  return newContact;
};
const removeContact = async (id, owner) => {
  const delatedContact = await Contact.findOneAndDelete({ _id: id, owner });
  return delatedContact;
};
const updateContact = async (id, owner, body) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, owner },
    body,
    {
      new: true,
    }
  );
  return updatedContact;
};

const updateFavorite = async (id, owner, body) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, owner },
    body,
    {
      new: true,
    }
  );
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
