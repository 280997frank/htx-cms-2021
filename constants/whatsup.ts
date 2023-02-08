import { object } from "yup";
import {
  requiredEmail,
  requiredFile,
  requiredString,
} from "./validationSchema";

export const dataPerPage = 10;

export const offsetDateStart = 7;

export const whatsupInitialValues = {
  title: "",
  image: "",
  dDate: "",
  tDate: "",
  dRegisterBy: "",
  tRegisterBy: "",
  venueName: "",
  contactName: "",
  contactPhone: "",
  date: "",
  registerBy: "",
};

export const whatsupValidationSchema = object({
  title: requiredString,
  image: requiredFile,
  dDate: requiredString,
  tDate: requiredString,
  dRegisterBy: requiredString,
  tRegisterBy: requiredString,
  venueName: requiredString,
  contactName: requiredString,
  contactPhone: requiredEmail,
});
