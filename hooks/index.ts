import { useEffect, Ref, RefObject } from "react";
import { useDispatch } from "react-redux";
import { ApolloError } from "@apollo/client";
import { useToast } from "@chakra-ui/react";

import { AppDispatch } from "@/states/store";
import { useFormikContext } from "formik";
import { removeAccessToken } from "../utils";

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export const useErrorMessage = (error: ApolloError | Error | undefined) => {
  const toast = useToast();

  useEffect(() => {
    const errorToken = ["Failed to verify Token", "Token Expired"];

    if (
      error?.message ==
        `QueryFailedError: ER_WARN_DATA_OUT_OF_RANGE: Out of range value for column 'rank' at row 1` ||
      error?.message ==
        `QueryFailedError: ER_DATA_TOO_LONG: Data too long for column 'timing' at row 1`
    ) {
      toast({
        title: "please ensure you key in the correct value for Timing/Rank",
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    } else if (error?.message == `Error: Incorrect password`) {
      toast({
        title: "Incorrect Password",
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    } else if (error) {
      toast({
        title: error.message,
        position: "bottom",
        isClosable: true,
        status: "error",
      });

      // handle token error
      if (errorToken.includes(error.message)) {
        removeAccessToken();
        window.location.href = "/";
      }
    }
    // eslint-disable-next-line
  }, [error, toast]);
};

export const useErrorFocus = (
  fieldRef: RefObject<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >,
  name: string
) => {
  const { isSubmitting, isValid, errors } = useFormikContext();

  const firstErrorKey = Object.keys(errors)[0];

  useEffect(() => {
    if (!isSubmitting || isValid) return;
    if (!isValid && firstErrorKey === name) {
      fieldRef.current?.focus;
    }
  }, [isSubmitting, isValid, fieldRef, firstErrorKey, name]);
};
