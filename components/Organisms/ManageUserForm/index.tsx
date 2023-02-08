import PasswordInput from "@/components/Atoms/PasswordInput";
import Select from "@/components/Atoms/Select";
import TextInput from "@/components/Atoms/TextInput";
import Panel from "@/components/Molecules/Panel";
import { BG_GRADIENT } from "@/constants/ui";
import {
  requiredBoolean,
  requiredEmail,
  requiredString,
} from "@/constants/validationSchema";
import {
  useManageUserInsert,
  useManageUsersPageGetById,
  useManageUserUpdate,
} from "@/hooks/manageusers";
import { Switch as ChakraSwitch } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import {
  TManageUsersForm,
  TManageUsersResponse,
  TManageUsersSubmit,
} from "@/types/manageusers";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { Flex, HStack, Stack, Text, VStack } from "@chakra-ui/layout";
import { FieldArray, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { object } from "yup";

const manageUserFormInitialValues: TManageUsersResponse = {
  email: "",
  isActive: false,
  name: "",
  role: "",
  password: "",
  permissions: {},
};

const validationSchemaInsert = object({
  email: requiredEmail,
  name: requiredString,
  role: requiredString,
  password: requiredString,
});

const validationSchemaUpdate = object({
  email: requiredEmail,
  name: requiredString,
  role: requiredString,
});

const features1 = [
  {
    text: "What's Up",
    key: "WHATS_UP",
    index: 0,
  },
  {
    text: "In Profile",
    key: "IN_PROFILE",
    index: 1,
  },
  {
    text: "Congratulations",
    key: "CONGRATS",
    index: 2,
  },
  {
    text: "Happy Birthday",
    key: "HAPPY_BIRTHDAY",
    index: 3,
  },
  {
    text: "X Marks The Spot",
    key: "X_MARK",
    index: 4,
  },
  {
    text: "Announcements",
    key: "ANNOUNCEMENT",
    index: 5,
  },
  {
    text: "Spotlight",
    key: "SPOTLIGHT",
    index: 6,
  },
];

const features2 = [
  {
    text: "TechXchange",
    key: "TECHXCHANGE",
    index: 7,
  },
  {
    text: "Event Highlights",
    key: "EVENT_HIGHLIGHTS",
    index: 8,
  },
  {
    text: "HLS Committee",
    key: "HLS_COMMITTEE",
    index: 9,
  },
  {
    text: "HTX Houses",
    key: "HTX_HOUSES",
    index: 10,
  },
  {
    text: "TechXplain",
    key: "TECHXPLAIN",
    index: 11,
  },
];

interface ManageUserFormArgs {
  breadcrumbItem: (item: string) => void;
}

export const ManageUserForm: FC<ManageUserFormArgs> = ({ breadcrumbItem }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [initialValues, setInitialValues] = useState<TManageUsersResponse>(
    manageUserFormInitialValues
  );

  const { mutationAddManageUsers } = useManageUserInsert();
  const { mutationEditUser } = useManageUserUpdate();
  const { fetchUserById, data: userById } = useManageUsersPageGetById(
    slug as string
  );

  useEffect(() => {
    if (slug !== undefined && (slug as string) !== "new") {
      fetchUserById();
    }
  }, [fetchUserById, slug]);

  useEffect(() => {
    if (slug !== undefined && slug === "new") {
      breadcrumbItem("New");
      setInitialValues(manageUserFormInitialValues);
    } else if (userById !== undefined) {
      breadcrumbItem(userById.detailUser.email);
      const permissions: any = {};
      userById.detailUser.permissions.map((x) => {
        permissions[x.name] = x.name;
      });
      setInitialValues({
        email: userById.detailUser.email,
        isActive: userById.detailUser.isActive,
        name: userById.detailUser.name,
        role: userById.detailUser.role,
        permissions: permissions,
      });
    }
  }, [slug, fetchUserById, userById, breadcrumbItem]);

  const submitForm = useCallback(
    async (values: TManageUsersResponse) => {
      if (slug !== undefined && slug === "new") {
        const tempPermissions = values.permissions;
        const permission: any = [];
        if (tempPermissions !== undefined) {
          Object.keys(tempPermissions).map((x) => {
            if (tempPermissions[x] !== null) {
              permission.push({ name: tempPermissions[x] });
            }
          });
        }
        const properValues: TManageUsersSubmit = {
          email: values.email,
          name: values.name,
          role: values.role,
          password: values.password,
          setPermission: permission,
        };
        // console.log({ properValues });
        await mutationAddManageUsers({
          variables: { createUserInput: properValues },
        });
      } else {
        const tempPermissions = values.permissions;
        const permission: any = [];
        if (tempPermissions !== undefined) {
          Object.keys(tempPermissions).map((x) => {
            if (tempPermissions[x] !== null) {
              permission.push({ name: tempPermissions[x] });
            }
          });
        }
        const properValues: TManageUsersSubmit = {
          id: slug as string,
          email: values.email,
          name: values.name,
          role: values.role,
          password:
            values.password !== "" ? values.password : initialValues.password,
          setPermission: permission,
        };
        // console.log({ properValues });
        await mutationEditUser({
          variables: {
            updateUserInput: properValues,
          },
        });
      }
    },
    [slug, mutationAddManageUsers, mutationEditUser, initialValues.password]
  );

  const onchangeTrigger = useCallback(
    (values: any, setFieldValue: any, index: number, key: string) => {
      if (values[key] === undefined || values[key] === null) {
        setFieldValue(`permissions.${key}`, key);
      } else {
        setFieldValue(`permissions.${key}`, null);
      }
    },
    []
  );

  return (
    <Formik
      enableReinitialize
      validationSchema={
        slug !== undefined && slug === "new"
          ? validationSchemaInsert
          : validationSchemaUpdate
      }
      initialValues={initialValues}
      onSubmit={async (values) => {
        await submitForm(values);
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form style={{ width: "50%" }}>
          <Stack
            direction={["column", "row"]}
            align="flex-start"
            spacing="10"
            mb="1rem"
          >
            <VStack spacing="6" w="50%">
              <TextInput
                name="email"
                label="Email"
                id="email"
                placeholder="Email"
              />
              <PasswordInput
                name="password"
                label="Password"
                id="password"
                placeholder="Password"
              />
            </VStack>
            <VStack spacing="6" w="50%">
              <TextInput
                name="name"
                label="NAME"
                id="name"
                placeholder="Name"
              />
              <Select
                id="role"
                placeholder="Select Role"
                name="role"
                label="Role"
                marginRight="1rem"
                isCustomField
                onChange={(e: any) => {}}
                data={[
                  { label: "ADMIN", value: "ADMIN" },
                  { label: "SUPER_ADMIN", value: "SUPER_ADMIN" },
                ]}
              />
            </VStack>
          </Stack>
          <Panel label="CMS TOGGLING PERMISSION" stackProps={{ w: "100%" }}>
            <Flex w="100%">
              <VStack w="50%" p="1rem">
                {features1.map((item) => {
                  return (
                    <FormControl
                      key={item.key}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      borderBottom="1px"
                      borderColor="#D7D7D7"
                      pb="0.8rem"
                    >
                      <FormLabel
                        htmlFor="email-alerts"
                        mb="0"
                        fontWeight="bold"
                      >
                        {item.text}
                      </FormLabel>
                      <ChakraSwitch
                        color="#00CCFF"
                        id={item.key}
                        name={`permissions.${item.key}`}
                        display="flex"
                        alignItems="center"
                        onChange={(e) =>
                          onchangeTrigger(
                            values.permissions,
                            setFieldValue,
                            item.index,
                            item.key
                          )
                        }
                        isChecked={
                          values.permissions !== undefined &&
                          values.permissions[item.key] === item.key
                            ? true
                            : false
                        }
                      />
                    </FormControl>
                  );
                })}
              </VStack>
              <VStack w="50%" p="1rem" alignItems="flex-start">
                {features2.map((item) => {
                  return (
                    <FormControl
                      key={item.key}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      borderBottom="1px"
                      borderColor="#D7D7D7"
                      pb="0.8rem"
                    >
                      <FormLabel
                        htmlFor="email-alerts"
                        mb="0"
                        fontWeight="bold"
                      >
                        {item.text}
                      </FormLabel>
                      <ChakraSwitch
                        color="#00CCFF"
                        id={item.key}
                        name={`permissions.${item.key}`}
                        display="flex"
                        alignItems="center"
                        onChange={(e) =>
                          onchangeTrigger(
                            values.permissions,
                            setFieldValue,
                            item.index,
                            item.key
                          )
                        }
                        isChecked={
                          values.permissions !== undefined &&
                          values.permissions[item.key] === item.key
                            ? true
                            : false
                        }
                      />
                    </FormControl>
                  );
                })}
              </VStack>
            </Flex>
          </Panel>
          <ButtonGroup mt="8">
            <Button
              bgImage={BG_GRADIENT}
              color="white"
              isLoading={isSubmitting}
              type="submit"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              color="gray.500"
              bg="white"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      )}
    </Formik>
  );
};
export default ManageUserForm;
