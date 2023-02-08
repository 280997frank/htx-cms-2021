import React, { FC, useState, useEffect } from "react";
import { Box, Heading, VStack } from "@chakra-ui/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  Button,
  ButtonGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import Select from "components/Atoms/Select";
import { BsChevronRight } from "react-icons/bs";
import withAuth from "@/utils/withAuth";
import { Form, Formik } from "formik";
import { BG_GRADIENT } from "@/constants/ui";
import TextInput from "@/components/Atoms/TextInput";

import Layout from "@/components/Templates/Layout";
import "react-day-picker/lib/style.css";
import { requiredNumber, requiredString } from "@/constants/validationSchema";
import { object } from "yup";
import { useRouter } from "next/router";
import { useHtxHousesByID, useSetCustomizeHTXHouses } from "@/hooks/htxHouses";
import { isNil } from "lodash";
import { THTXHouses, TTypeHouse } from "@/types/htxHouses";
import Panel from "@/components/Molecules/Panel";

const selectDrop = [
  {
    label: "Add",
    value: "ADDITION",
  },
  {
    label: "Deduct",
    value: "REDUCTION",
  },
];
const validationSchema = object({
  type: requiredString,
  point: requiredNumber,
});
const FormInitialValue = {
  type: "",
  point: "",
};
const HtxHouses: FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [titleName, setTitleName] = useState("New");
  const [isSubmitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<THTXHouses>({
    id: "",
    name: "",
    point: 0,
    isActive: false,
  });

  const { fetchHtxHousesByID, responseHtxDetail } = useHtxHousesByID({
    id: slug as string,
  });
  useEffect(() => {
    if (slug !== "new" && slug !== undefined) {
      setTitleName(initialValues.name);
    }
  }, [slug, initialValues]);

  useEffect(() => {
    fetchHtxHousesByID();
  }, [fetchHtxHousesByID]);
  useEffect(() => {
    if (!isNil(responseHtxDetail)) {
      setInitialValues(responseHtxDetail.detailHtxHouse);
    }
  }, [responseHtxDetail]);

  const { fetchCustomizeHTXHouses, responseCustomizeHTXHouse, loading } =
    useSetCustomizeHTXHouses();

  useEffect(() => {
    if (!isNil(responseCustomizeHTXHouse)) {
      fetchHtxHousesByID();
    }
  }, [responseCustomizeHTXHouse, fetchHtxHousesByID]);

  // console.log("responseHtxDetail", responseHtxDetail?.detailHtxHouse);
  return (
    <Layout title="HTX HOUSES | HTX">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Flex width="100%" justifyContent="space-between">
          <Breadcrumb
            separator={
              <Box marginBottom="8" fontSize="md">
                <BsChevronRight />
              </Box>
            }
          >
            <BreadcrumbItem>
              <Heading as="h1" size="lg" marginBottom="8">
                <Text
                  color="gray.300"
                  as="span"
                  onClick={() => router.push("/htx-houses")}
                  _hover={{
                    color: "black",
                    cursor: "pointer",
                  }}
                >
                  HTX Houses
                </Text>
                {" > "}
                {titleName}
              </Heading>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={FormInitialValue}
          onSubmit={async (values) => {
            setSubmitting(true);
            const newPoint = values.point;
            await fetchCustomizeHTXHouses({
              variables: {
                customizeHtxHouseInput: {
                  id: slug as string,
                  point: parseFloat(newPoint),
                  type: values.type as TTypeHouse,
                },
              },
            });
            // console.log("values", values);
            // console.log("slug id", slug);
            setSubmitting(false);
          }}
        >
          {({ resetForm }) => (
            <Form style={{ width: "100%" }}>
              <Stack direction="row" align="flex-start" spacing="2" w="96">
                {/* <TextInput
                  id="currentPoint"
                  name="currentPoint"
                  label="CURRENT POINT"
                  placeholder="current Point"
                  value={initialValues.point}
                  w="full"
                  height="5.5rem"
                  fontSize="2xl"
                  isDisabled={true}
                /> */}
                <Panel label="CURRENT POINT">
                  <Stack
                    height="3.4rem"
                    alignItems="center"
                    justifyContent="center"
                    verticalAlign="middle"
                  >
                    <Text fontSize="2xl">{initialValues.point}</Text>
                  </Stack>
                </Panel>
                <Stack direction="column" align="flex-start" spacing="2" w="80">
                  <Select
                    isCustomField
                    id="type"
                    name="type"
                    placeholder="Add/Deduct"
                    label="CUSTOMIZE POINTS"
                    backgroundColor="white"
                    data={selectDrop.map((item) => ({
                      label: item.label,
                      value: item.value,
                    }))}
                  />
                  <TextInput id="point" name="point" type="number" />
                </Stack>
              </Stack>
              <ButtonGroup mt="8">
                <Button
                  bgImage={BG_GRADIENT}
                  color="white"
                  isLoading={isSubmitting || loading}
                  type="submit"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  isLoading={isSubmitting || loading}
                  color="gray.500"
                  bg="white"
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </Form>
          )}
        </Formik>
      </VStack>
    </Layout>
  );
};

export default withAuth(HtxHouses);
