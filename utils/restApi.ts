import axios from "axios";

import { getAccessToken, checkErrorResponse } from "utils/index";
import { MediaFolderType } from "@/types/upload";

export interface TUploadSingleFilePayload {
  file: File | string;
  folder: MediaFolderType;
}
export interface TUploadMultiFilePayload {
  files: File[] | string[];
  folder: MediaFolderType;
}
export interface TUploadFilePDFPayload {
  file: File | string;
  folder: MediaFolderType;
  width: string;
  height: string;
}
export interface TExportAnalytics {
  startDate: string;
  endDate: string;
}

export interface TExportFeedbacks {
  startDate: string;
  endDate: string;
}

interface TDataSingleResponse {
  message: string;
  data: string;
}
interface TDataMultiFileResponse {
  message: string;
  data: string[];
}
interface UnknownPayload {
  [s: string]: unknown;
}
type TStoryDetailImage = {
  url: string;
  caption: string;
};

export interface TUploadFileCSVPayload {
  file: File | string;
}

const URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

const isStoryDetailImage = (
  toBeDetermined: unknown
): toBeDetermined is TStoryDetailImage => {
  if (typeof (toBeDetermined as TStoryDetailImage).url === "string") {
    return true;
  }

  return false;
};

const setOptions = (restOptions: UnknownPayload) => ({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  },
  ...restOptions,
});

const setFormData = (
  payload:
    | TUploadSingleFilePayload
    | TUploadMultiFilePayload
    | TExportAnalytics
    | TUploadFileCSVPayload
) => {
  const formData = new window.FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val: string | Blob | TStoryDetailImage) => {
        if (!isStoryDetailImage(val)) {
          formData.append(key, val);
        }
      });
    } else if (typeof value === "boolean") {
      if (value) {
        formData.append(key, "true");
      } else {
        formData.append(key, "false");
      }
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};

export const PostSingleFile = async (
  payload: TUploadSingleFilePayload
): Promise<TDataSingleResponse> => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: setFormData(payload),
  };

  const response = await window.fetch(
    `${URL}/uploads/uploadFile`,
    setOptions(options)
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = await response.json();
  return json;
};

export const PostMultiFile = async (
  payload: TUploadMultiFilePayload
): Promise<TDataMultiFileResponse> => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: setFormData(payload),
  };

  const response = await window.fetch(
    `${URL}/uploads/uploadFiles`,
    setOptions(options)
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = await response.json();
  return json;
};

export const PostFilePDF = async (
  payload: TUploadFilePDFPayload
): Promise<TDataMultiFileResponse> => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: setFormData(payload),
  };

  const response = await window.fetch(
    `${URL}/uploads/uploadPdf`,
    setOptions(options)
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = await response.json();
  return json;
};

export const ExportAnalytics = async (payload: TExportAnalytics) => {
  axios({
    url: `${URL}/analytics/generateReport`,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    method: "POST",
    data: JSON.stringify(payload),
    responseType: "blob",
  }).then((response: any) => {
    const url = window.URL.createObjectURL(new window.Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Analytics.xlsx");
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  });
};

export const ExportFeedbacks = async (payload: TExportAnalytics) => {
  axios({
    url: `${URL}/feedback/generateReport`,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    method: "POST",
    data: JSON.stringify(payload),
    responseType: "blob",
  }).then((response: any) => {
    const url = window.URL.createObjectURL(new window.Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "feedbacks.xlsx");
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  });
};

export const PostUploadCsv = async (
  payload: TUploadFileCSVPayload
): Promise<TDataSingleResponse> => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: setFormData(payload),
  };

  const response = await window.fetch(
    `${URL}/birthday/uploadCsv`,
    setOptions(options)
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = await response.json();
  return json;
};

export const PostUploadXlsx = async (
  payload: TUploadFileCSVPayload
): Promise<TDataSingleResponse> => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: setFormData(payload),
  };

  const response = await window.fetch(
    `${URL}/birthday/uploadXlsx`,
    setOptions(options)
  );
  const errorMessage = await checkErrorResponse(response.clone());

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const json = await response.json();
  return json;
};
