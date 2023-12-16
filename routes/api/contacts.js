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
const { validateBody, isValidId, isEmptyBody } = require("../../middlewares");
const router = express.Router();

router.get("/", getAllContacts);

router.get("/:id", isValidId, getById);

router.post("/", validateBody(schema), addContact);

router.delete("/:id", isValidId, deleteById);

router.put("/:id", isValidId, isEmptyBody, validateBody(schema), update);

router.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);

module.exports = router;
