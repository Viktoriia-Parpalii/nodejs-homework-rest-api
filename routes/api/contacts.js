const express = require("express");
const {
  getAllContacts,
  getById,
  addContact,
  deleteById,
  update,
  updateStatusContact,
} = require("../../controllers/contacts");

const { schema, updateFavoriteSchema } = require("../../schema/schema");
const { validateBody, isValidId, isEmpty } = require("../../middlewares");
const router = express.Router();

router.get("/", getAllContacts);

router.get("/:id", isValidId, getById);

router.post("/", validateBody(schema), addContact);

router.delete("/:id", isValidId, deleteById);

router.put(
  "/:id",
  isValidId,
  isEmpty.isEmptyBody,
  validateBody(schema),
  update
);

router.patch(
  "/:id/favorite",
  isValidId,
  isEmpty.isEmptyFavorite,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);

module.exports = router;
