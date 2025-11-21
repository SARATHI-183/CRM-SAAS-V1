const yup = require("yup");
const { validate: isUuid } = require("uuid");

// -------------------------
// CREATE USER VALIDATION
// -------------------------
const createUserSchema = yup.object().shape({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role_id: yup
    .string()
    .required("Role ID is required")
    .test("is-uuid", "Invalid role_id", (value) => isUuid(value)),
  tenant_id: yup
    .string()
    .nullable()
    .test("is-uuid", "Invalid tenant_id", (value) => !value || isUuid(value)),
});

// -------------------------
// UPDATE USER VALIDATION
// -------------------------
const updateUserSchema = yup.object().shape({
  full_name: yup.string().optional(),
  email: yup.string().email("Invalid email").optional(),
  phone: yup.string().optional(),
  is_active: yup.boolean().optional(),
  role_id: yup
    .string()
    .optional()
    .test("is-uuid", "Invalid role_id", (value) => !value || isUuid(value)),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};
