import { string, mixed, date, boolean, array, object, number, ref } from "yup";

export const requiredString = string().required("Required");
export const requiredUrl = string().url("Invalid URL").required("Required");
export const optionalUrl = string().url("Invalid URL");
export const requiredBoolean = boolean().required("Required");
export const requiredDate = date().required("Required");
export const requiredTiming = string()
  .required("Required")
  .matches(
    /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/,
    "Timing format invalid"
  );
export const requiredArrayOfStrings = array().of(string()).min(1, "Required");
export const requiredNumber = number()
  .integer("Not an integer number")
  .required("Required");

export const requiredEmail = string()
  .email("Invalid email address")
  .required("Required");

export const requiredFile = mixed()
  .required("Required")
  .test("arrayBuffer", "Invalid file/URL", (value) => {
    if (typeof value === "string" && value.length > 0) {
      return true;
    }

    if (value !== undefined) {
      return value instanceof window.File;
    }

    return false;
  });

export const requiredFilesObject = mixed()
  .required("Required")
  .test("arrayBuffer", "Invalid file/URL", (value) => {
    if (typeof value.url === "string" && value.url.length > 0) {
      return true;
    }

    if (value.url !== undefined) {
      return value.url instanceof window.File;
    }

    return false;
  });

export const decimalNumber = number().test(
  "maxDigitsAfterDecimal",
  "number field must have 2 digits after decimal or less",
  (number: any) => /^\d+(\.\d{1,2})?$/.test(number)
);

export const optionalFile = mixed().test(
  "arrayBuffer",
  "Invalid file/URL",
  (value) => {
    if (typeof value === "string" || typeof value === "undefined") {
      return true;
    }

    if (value !== undefined) {
      return value instanceof window.File;
    }

    return false;
  }
);

export const arrayOfRequiredFiles = array().of(requiredFile).min(1, "Required");
export const arrayOfRequiredFilesObject = array()
  .of(requiredFilesObject)
  .min(1, "Required");

export const arrayOfCaptionedImages = array()
  .of(
    object().shape({
      body: requiredString,
      image: requiredFile,
    })
  )
  .min(1, "Required");

export const arrayOfPressMedia = array()
  .of(
    object().shape({
      body: requiredString,
      image: requiredFile,
      description: requiredString,
    })
  )
  .min(1, "Required");

export const arrayOfReviews = array()
  .of(
    object().shape({
      text: requiredString,
      description: requiredString,
    })
  )
  .min(1, "Required");

export const arrayOfThumbnails = array()
  .of(
    object().shape({
      image: requiredFile,
    })
  )
  .min(1, "Required");

export const arrayOfEpisodeGuide = array()
  .of(
    object().shape({
      image: requiredFile,
      label: requiredString,
      thumbnail: requiredFile,
    })
  )
  .min(1, "Required");

export const arrayOfMain = array()
  .of(
    object().shape({
      image: requiredFile,
    })
  )
  .min(1, "Required");

export const arrayOfImageFeed = array()
  .of(
    object().shape({
      file: requiredFile,
    })
  )
  .min(1, "Required");

export const arrayOfAnswers = array()
  .of(
    object().shape({
      option: requiredString,
    })
  )
  .min(1, "Required");

export const requiredTitleInProfile = string().max(30).required("Required");
export const requiredDescriptionInProfile = mixed()
  .test(
    "maxDescriptionCharacter",
    "Description must not be longer 45 words",
    (value) => {
      const content =
        new DOMParser()
          .parseFromString(value, "text/html")
          ?.body.textContent?.trim() ?? "";
      const count = content.match(/\w+/g)?.length;
      if (count && count < 45) {
        return true;
      }
      return false;
    }
  )
  .test("minDescriptionCharacter", "Required", (value) => {
    const content =
      new DOMParser()
        .parseFromString(value, "text/html")
        ?.body.textContent?.trim() ?? "";
    if (content.length > 0) {
      return true;
    }
    return false;
  });
export const requiredDescriptionSpotlight = mixed()
  .test(
    "maxDescriptionCharacterSpotlight",
    "You have exceeded the maximum of 100 words in this field",
    (value) => {
      const content =
        new DOMParser()
          .parseFromString(value, "text/html")
          ?.body.textContent?.trim() ?? "";
      const count = content.match(/\w+/g)?.length;
      if (count && count <= 100) {
        return true;
      }
      return false;
    }
  )
  .test("minDescriptionCharacterSpotlight", "Required", (value) => {
    const content =
      new DOMParser()
        .parseFromString(value, "text/html")
        ?.body.textContent?.trim() ?? "";
    const count = content.match(/\w+/g)?.length;
    if (count && count > 0) {
      return true;
    }
    return false;
  });

export const requiredConfirmPassword = string()
  .required("Required")
  .when("password", {
    is: (val: string) => !!(typeof val === "string" && val.length > 0),
    then: string().oneOf(
      [ref("password")],
      "Both password need to be the same"
    ),
  });
