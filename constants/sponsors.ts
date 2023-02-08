import { object } from "yup";
import { requiredString, requiredUrl, requiredFile } from "./validationSchema";

export const dataPerPage = 10;

export const sponsorsInitialValues = {
  name: "",
  url: "",
  logo: "",
};

export const sponsorsValidationSchema = object({
  name: requiredString,
  url: requiredUrl,
  logo: requiredFile,
});
