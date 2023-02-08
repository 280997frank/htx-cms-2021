import { useMutation, gql } from "@apollo/client";

import { useErrorMessage } from "@/hooks";
import { MediaFolderType } from "@/types/upload";
import { useCallback, useState } from "react";
import {
  PostSingleFile,
  PostMultiFile,
  TUploadSingleFilePayload,
  TUploadMultiFilePayload,
  TUploadFilePDFPayload,
  PostFilePDF,
} from "@/utils/restApi";

interface FileUploadResponse {
  uploadFile: {
    url: string;
  };
}

export interface MultipleFileUploadResponse {
  uploadMultiFiles: {
    urls: string[];
  };
}

interface FileInput {
  uploadFilesInput: {
    file: File;
    folder: MediaFolderType;
  };
}

interface MultipleFileInput {
  uploadFilesInput: {
    files: File[];
    folder: MediaFolderType;
  };
}

const UPLOAD_FILE = gql`
  mutation uploadFile($uploadFilesInput: UploadFilesInput!) {
    uploadFile(uploadFilesInput: $uploadFilesInput) {
      url
    }
  }
`;

const UPLOAD_MULTIPLE_FILE = gql`
  mutation uploadMultiFiles($uploadFilesInput: UploadMultiFileInput!) {
    uploadMultiFiles(uploadFilesInput: $uploadFilesInput) {
      urls
    }
  }
`;

export const useUploadFile = () => {
  const [uploadFile, { loading, error, data }] = useMutation<
    FileUploadResponse,
    FileInput
  >(UPLOAD_FILE);

  useErrorMessage(error);

  return {
    uploadFile,
    loading,
    data,
  };
};

export const useUploadMultipleFile = () => {
  const [uploadMultipleFile, { loading, error, data }] = useMutation<
    MultipleFileUploadResponse,
    MultipleFileInput
  >(UPLOAD_MULTIPLE_FILE);

  useErrorMessage(error);
  return {
    uploadMultipleFile,
    loading,
    data,
  };
};

export const useUploadFileViaAPI = () => {
  const [loading, setLoading] = useState(false);
  const fetchUploadFile = useCallback(
    async (payload: TUploadSingleFilePayload) => {
      setLoading(true);
      const responseUploadFile = await PostSingleFile(payload);
      setLoading(false);
      return responseUploadFile;
    },
    []
  );
  return {
    loading,
    fetchUploadFile,
  };
};

export const useUploadMultiFileViaAPI = () => {
  const [loading, setLoading] = useState(false);
  const fetchUploadMultiFile = useCallback(
    async (payload: TUploadMultiFilePayload) => {
      setLoading(true);
      const responseUploadMultiFile = await PostMultiFile(payload);
      setLoading(false);
      return responseUploadMultiFile;
    },
    []
  );
  return {
    loading,
    fetchUploadMultiFile,
  };
};

export const useUploadFilePDFViaAPI = () => {
  const [loading, setLoading] = useState(false);
  const fetchUploadFilePDF = useCallback(
    async (payload: TUploadFilePDFPayload) => {
      setLoading(true);
      const responseUploadFilePDF = await PostFilePDF(payload);
      setLoading(false);
      return responseUploadFilePDF;
    },
    []
  );
  return {
    loading,
    fetchUploadFilePDF,
  };
};
