import {
  LoginPayload,
  LoginResponse,
  LoginValidatePayload,
  ForgotPasswordValidatePayload,
  NewPasswordPayload,
} from "@/types/auth";
import { useMutation, gql } from "@apollo/client";
import { useErrorMessage } from ".";

const MUTATION_LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      id
      email
      name
      role
      token
      createdAt
      updatedAt
    }
  }
`;

const MUTATION_VALIDATE = gql`
  mutation validateOTP($email: String!, $password: String!, $otpCode: String!) {
    validateOTP(
      validateOtpInput: {
        email: $email
        password: $password
        otpCode: $otpCode
      }
    ) {
      id
      email
      name
      token
      role
      createdAt
      updatedAt
      permissions {
        name
        type
      }
    }
  }
`;

const MUTATION_RESET_PASSWORD = gql`
  mutation forgetPassword($email: String!) {
    forgetPassword(forgetPasswordInput: { email: $email }) {
      success
    }
  }
`;

const MUTATION_CHANGE_PASSWORD = gql`
  mutation changePassword($token: String!, $password: String!) {
    changePassword(
      changePasswordInput: { token: $token, newPassword: $password }
    ) {
      success
    }
  }
`;

interface ResponseLoginMutation {
  login: LoginResponse;
}
interface ResponseValidateMutation {
  validateOTP: LoginResponse;
}

export const useLoginSubmit = () => {
  const [loginSubmit, { data: responseLogin, error, loading }] = useMutation<
    ResponseLoginMutation,
    LoginPayload
  >(MUTATION_LOGIN);

  useErrorMessage(error);

  return {
    loginSubmit,
    responseLogin,
    loading,
  };
};

export const useValidateSubmit = () => {
  const [validateSubmit, { data: response, error, loading }] = useMutation<
    ResponseValidateMutation,
    LoginValidatePayload
  >(MUTATION_VALIDATE);

  useErrorMessage(error);

  return {
    validateSubmit,
    response,
    loading,
  };
};

export const useForgotPasswordSubmit = () => {
  const [emailSubmit, { data: response, error, loading }] = useMutation<
    ResponseValidateMutation,
    ForgotPasswordValidatePayload
  >(MUTATION_RESET_PASSWORD);

  useErrorMessage(error);

  return {
    emailSubmit,
    response,
    loading,
  };
};

export const useNewPasswordSubmit = () => {
  const [newPasswordSubmit, { data: responseNewPassword, error, loading }] =
    useMutation<ResponseLoginMutation, NewPasswordPayload>(
      MUTATION_CHANGE_PASSWORD
    );

  useErrorMessage(error);

  return {
    newPasswordSubmit,
    responseNewPassword,
    loading,
  };
};
