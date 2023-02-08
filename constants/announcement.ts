import { object } from "yup";
import { requiredString, requiredUrl, requiredFile } from "./validationSchema";

export const dataPerPage = 10;

export const announcementInitialValues = {
  text: "",
  active: true,
};

export const announcementValidationSchema = object({
  text: requiredString,
});
