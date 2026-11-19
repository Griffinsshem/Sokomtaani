import * as Yup from "yup";

// Must match backend/app/utils/validation.py (PASSWORD_RE, PHONE_RE).
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;
export const PASSWORD_HINT = "At least 8 characters with an uppercase letter, a lowercase letter, a number and a symbol.";
export const PHONE_REGEX = /^\+?[0-9]{9,14}$/;

export const passwordRule = Yup.string()
  .matches(PASSWORD_REGEX, PASSWORD_HINT)
  .required("Password is required");

export const confirmRule = (field = "password") =>
  Yup.string()
    .oneOf([Yup.ref(field)], "Passwords must match")
    .required("Please confirm your password");
