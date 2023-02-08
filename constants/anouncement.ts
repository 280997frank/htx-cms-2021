import { object } from "yup";
import { requiredString, requiredUrl, requiredFile } from "./validationSchema";

export const dataPerPage = 10;

export const announcementInitialValues = {
  name: "",
  url: "",
  logo: "",
};

export const announcementValidationSchema = object({
  name: requiredString,
  url: requiredUrl,
  logo: requiredFile,
});
