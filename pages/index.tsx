import React, { FC, ReactElement, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  Image,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { object } from "yup";

import Meta from "@/components/Atoms/Meta";
import TextInput from "@/components/Atoms/TextInput";
import { default as ButtonForm } from "@/components/Atoms/Button";
import PasswordInput from "@/components/Atoms/PasswordInput";

import { requiredEmail, requiredString } from "@/constants/validationSchema";
import { BG_GRADIENT_LANDING } from "@/constants/ui";

import { actions as authActions } from "@/states/auth/slice";

import { getAccessToken, storeAccessToken, userRole } from "@/utils";

import { useAppDispatch } from "@/hooks";
import {
  useLoginSubmit,
  useValidateSubmit,
  useForgotPasswordSubmit,
} from "@/hooks/auth";
import LogoHTX from "assets/images/login-logo.png";
import { OTPInput } from "chakra-otp-input";
import { Span } from "next/dist/telemetry/trace";

const LoginPage: FC = (): ReactElement => {
  return (
    <div>
      <Head>
        <title>HTX CMS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Meta />
      <Login />
    </div>
  );
};

const logo = "https://picsum.photos/200";

const initialValues = {
  email: "",
  password: "",
  otpCode: "",
};

const initialValuesForgotPassword = {
  email: "",
};

const validationSchemaForgotPassword = object({
  email: requiredEmail,
});

const validationSchema = object({
  email: requiredEmail,
  password: requiredString,
});

const Login: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const router = useRouter();
  const [isLoggedIn, setLoginStatus] = useState(false);
  const [isResetPassword, setResetPassword] = useState(false);
  const [isValidate, setValidateStatus] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingLoginStatus, setLoginCheckingStatus] = useState(true);
  const [redirect, setRedirect] = useState("/whats-up");
  const {
    loginSubmit,
    responseLogin,
    loading: loadingLogin,
  } = useLoginSubmit();
  const { validateSubmit, response, loading } = useValidateSubmit();
  const {
    emailSubmit,
    response: responseForgotPassword,
    loading: loadingForgotPassword,
  } = useForgotPasswordSubmit();

  // get response login
  useEffect(() => {
    if (response) {
      if (response.validateOTP.token !== null) {
        storeAccessToken(response.validateOTP.token);
        setValidateStatus(true);
        dispatch(authActions.setUser(response.validateOTP));
        if (response.validateOTP.role === userRole.SUPER_ADMIN) {
          setRedirect("/manage-users");
        }
      } else {
        setLoginStatus(true);
      }
    } else if (responseLogin) {
      setLoginStatus(true);
    }
  }, [response, responseLogin, dispatch]);

  // check and set status is already login
  useEffect(() => {
    const token = getAccessToken();

    if (token.length > 0) {
      setValidateStatus(true);
    } else {
      setLoginCheckingStatus(false);
    }
  }, []);

  // redirect if already login
  useEffect(() => {
    if (isValidate) {
      window.location.href = redirect;
    }
  }, [isValidate, redirect]);

  if (isCheckingLoginStatus) {
    return <Center h="100vh">Loading ......</Center>;
  }

  return (
    <Stack
      background={BG_GRADIENT_LANDING}
      justifyContent="center"
      alignItems="center"
      h="100vh"
      position="relative"
    >
      <Box>
        <Image src={LogoHTX.src} boxSize="95%" alt="Zodiac Live" />
      </Box>
      <Center>
        <Box
          bg="white"
          width="55vh"
          backdropFilter="blur(40px)"
          borderRadius="1rem"
          p="3rem"
          m="0 auto"
          position="relative"
        >
          {!isLoggedIn && !isValidate && !isResetPassword ? (
            <>
              <Box p={4}>
                <Center mb={4} flexDir="column">
                  <Heading
                    as="h1"
                    fontSize="2.6rem"
                    color="#5C068C"
                    textAlign="center"
                  >
                    conneXus
                  </Heading>
                </Center>
              </Box>
              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  setEmail(values.email);
                  setPassword(values.password);
                  await loginSubmit({
                    variables: {
                      email: values.email,
                      password: values.password,
                    },
                  });
                }}
              >
                {() => {
                  return (
                    <Form>
                      <TextInput id="email" name="email" label="EMAIL" />
                      <PasswordInput
                        id="password"
                        name="password"
                        label="PASSWORD"
                        mb={10}
                        mt={4}
                      />
                      <FormControl>
                        <ButtonForm
                          label="Login"
                          type="submit"
                          className="login"
                          isLarge={true}
                          isLoading={loadingLogin}
                        />
                      </FormControl>
                      <Text
                        pt="3"
                        float="right"
                        color="#7D7D7D"
                        cursor="pointer"
                        onClick={() => setResetPassword(true)}
                      >
                        Forgot Password?
                      </Text>
                    </Form>
                  );
                }}
              </Formik>
            </>
          ) : isLoggedIn ? (
            <>
              <Formik
                enableReinitialize
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={async (values) => {
                  await validateSubmit({
                    variables: {
                      email: email,
                      password: password,
                      otpCode: otp,
                    },
                  });
                }}
              >
                {() => {
                  return (
                    <Form>
                      <Center mb={4}>
                        <OTPInput
                          noInputs={4}
                          onChange={(value) => setOtp(value)}
                          isNumeric={true}
                          // isError={isError}
                          isDisabled={false}
                          isPrivate={false}
                          isPasteDisabled={false}
                          spacing={`10px`}
                        />
                      </Center>
                      <Center mb={2}>
                        <Box>
                          <Heading
                            as="h1"
                            fontSize="1.6rem"
                            color="#5C068C"
                            textAlign="center"
                          >
                            OTP
                          </Heading>
                        </Box>
                      </Center>
                      <Center mb={4}>
                        <Box>
                          <Text
                            as="h1"
                            fontSize="0.7rem"
                            color="#363636"
                            textAlign="center"
                          >
                            Enter the 4-digit OTP sent to your email
                            <br />
                            on the space above to login.
                          </Text>
                        </Box>
                      </Center>
                      <Center mb={4}>
                        <Box>
                          <Text
                            as="h1"
                            fontSize="0.7rem"
                            color="#7D7D7D"
                            textAlign="center"
                          >
                            Didn’t receive an email? &nbsp;
                            <Button
                              variant="link"
                              paddingTop="1px"
                              fontSize="0.7rem"
                              onClick={async () => {
                                await loginSubmit({
                                  variables: {
                                    email,
                                    password,
                                  },
                                });
                              }}
                            >
                              Resend
                            </Button>
                          </Text>
                        </Box>
                      </Center>
                      <FormControl>
                        <ButtonForm
                          label="Login"
                          type="submit"
                          className="login"
                          isLarge={true}
                          isLoading={loading}
                        />
                      </FormControl>
                      <Center>
                        <Button
                          colorScheme="#5C068C"
                          variant="outline"
                          paddingTop="1px"
                          fontSize="1rem"
                          width="100%"
                          marginTop="1rem"
                          color="#5C068C"
                          onClick={async () => {
                            setLoginStatus(false);
                          }}
                        >
                          Back
                        </Button>
                      </Center>
                    </Form>
                  );
                }}
              </Formik>
            </>
          ) : null}
          {isResetPassword && (
            <>
              <Box p={4}>
                <Center mt="10">
                  <Heading
                    as="h1"
                    fontSize="2rem"
                    color="#5C068C"
                    textAlign="center"
                  >
                    Forgot Password
                  </Heading>
                </Center>
                <Center mt="10">
                  <Text
                    as="h1"
                    fontSize="20px"
                    color="#363636"
                    textAlign="center"
                  >
                    Enter your email to get
                  </Text>
                </Center>
                <Center>
                  <Text
                    as="h1"
                    fontSize="20px"
                    color="#363636"
                    textAlign="center"
                  >
                    a reset password link.
                  </Text>
                </Center>
              </Box>
              <Formik
                enableReinitialize
                initialValues={initialValuesForgotPassword}
                validationSchema={validationSchemaForgotPassword}
                onSubmit={async (values) => {
                  try {
                    await emailSubmit({
                      variables: {
                        email: values.email,
                      },
                    });
                    toast({
                      title: "Please check email to reset password",
                      position: "bottom",
                      isClosable: true,
                      status: "success",
                    });
                    setResetPassword(false);
                  } catch (error: any) {
                    toast({
                      title: error.message,
                      position: "bottom",
                      isClosable: true,
                      status: "error",
                    });
                  }
                }}
              >
                {() => {
                  return (
                    <Form>
                      <TextInput
                        id="email"
                        name="email"
                        label="EMAIL"
                        mb="10"
                        placeholder="email@domain.com"
                      />
                      <FormControl>
                        <ButtonForm
                          label="Send Reset Password Link"
                          type="submit"
                          className="login"
                          isLarge={true}
                          isLoading={loadingForgotPassword}
                        />
                      </FormControl>
                    </Form>
                  );
                }}
              </Formik>
            </>
          )}
        </Box>
      </Center>
    </Stack>
  );
};

export default LoginPage;
