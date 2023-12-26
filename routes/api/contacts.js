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
const {
  validateBody,
  isValidId,
  isEmpty,
  authenticate,
} = require("../../middlewares");
const router = express.Router();

router.get("/", authenticate, getAllContacts);

router.get("/:id", authenticate, isValidId, getById);

router.post("/", authenticate, validateBody(schema), addContact);

router.delete("/:id", authenticate, isValidId, deleteById);

router.put(
  "/:id",
  authenticate,
  isValidId,
  isEmpty.isEmptyBody,
  validateBody(schema),
  update
);

router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  isEmpty.isEmptyFavorite,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);

module.exports = router;
