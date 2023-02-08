import React, { FC, ReactElement } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Box,
  Center,
  FormControl,
  Heading,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { object } from "yup";

import Meta from "@/components/Atoms/Meta";
import { default as ButtonForm } from "@/components/Atoms/Button";
import PasswordInput from "@/components/Atoms/PasswordInput";

import {
  requiredString,
  requiredConfirmPassword,
} from "@/constants/validationSchema";
import { BG_GRADIENT_LANDING } from "@/constants/ui";
import { useNewPasswordSubmit } from "@/hooks/auth";
import LogoHTX from "assets/images/login-logo.png";

const ChangePasswordPage: FC = (): ReactElement => {
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

const initialValues = {
  password: "",
  confirmpassword: "",
};

const validationSchema = object({
  password: requiredString,
  confirmpassword: requiredConfirmPassword,
});

const Login: FC = (): ReactElement => {
  const router = useRouter();
  const toast = useToast();
  const { token } = router?.query;
  const { newPasswordSubmit, responseNewPassword, loading } =
    useNewPasswordSubmit();

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
          flexGrow={0}
          bg="white"
          width="55vh"
          backdropFilter="blur(40px)"
          borderRadius="1rem"
          p="3rem"
          m="0 auto"
          position="relative"
        >
          <>
            <Box p={4}>
              <Center mt="10">
                <Heading
                  as="h1"
                  fontSize="2rem"
                  color="#5C068C"
                  textAlign="center"
                >
                  New Password
                </Heading>
              </Center>
              <Center mt="10">
                <Text
                  as="h1"
                  fontSize="20px"
                  color="#363636"
                  textAlign="center"
                >
                  Your password has been reset.
                </Text>
              </Center>
              <Center>
                <Text
                  as="h1"
                  fontSize="20px"
                  color="#363636"
                  textAlign="center"
                >
                  You can now create a new password.
                </Text>
              </Center>
            </Box>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  await newPasswordSubmit({
                    variables: {
                      token: token as string,
                      password: values.password,
                    },
                  });
                  toast({
                    title: "Your password has been reset",
                    position: "bottom",
                    isClosable: true,
                    status: "success",
                  });

                  router.push("/");
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
                    <PasswordInput
                      id="password"
                      name="password"
                      label="New Password"
                      mb={10}
                      mt={4}
                    />
                    <PasswordInput
                      id="password"
                      name="confirmpassword"
                      label="Confirm New Password"
                      mb={10}
                      mt={4}
                    />
                    <FormControl>
                      <ButtonForm
                        label="Save New Password"
                        type="submit"
                        className="login"
                        isLarge={true}
                        isLoading={loading}
                      />
                    </FormControl>
                  </Form>
                );
              }}
            </Formik>
          </>
        </Box>
      </Center>
    </Stack>
  );
};

export default ChangePasswordPage;
