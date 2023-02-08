import HappyBirthdayForm from "@/components/Organisms/HappyBirthdayForm";
import { requiredString } from "@/constants/validationSchema";
import { BirthdayInput } from "@/types/happy-birthday";
import withAuth from "@/utils/withAuth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/breadcrumb";
import { Box, Heading, VStack } from "@chakra-ui/layout";
import Layout from "components/Templates/Layout";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Formik } from "formik";
import {
  useBirthdayGetById,
  useBirthdayInsert,
  useBirthdayUpdate,
} from "hooks/happy-birthday";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useEffect, useMemo } from "react";
import { BsChevronRight } from "react-icons/bs";
import { object } from "yup";

const emptyValues: BirthdayInput = {
  firstName: "",
  lastName: "",
  designation: "",
  birthday: "",
};

const validationSchema = object({
  firstName: requiredString,
  lastName: requiredString,
  designation: requiredString,
});

const HappyBirthdayDetail: FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  ///GRAPHQL ADD DATA
  const { mutationAddBirthday, loading: addLoading } = useBirthdayInsert();

  ///GRAPHQL GET DETAILS
  const {
    fetchBirthdayById,
    data: dataDetail,
    loading: fetchLoading,
  } = useBirthdayGetById(slug as string);

  //GRAPHQL UPDATE DATA
  const { mutationEditInProfile, loading } = useBirthdayUpdate();

  //SUBMIT FUNCTION
  const handleSubmit = async (values: BirthdayInput) => {
    dayjs.extend(customParseFormat);
    if (slug === "new") {
      const newDate = dayjs(values.birthday, "DD/MM/YYYY").format("YYYY-MM-DD");
      const newValue = {
        ...values,
        birthday: newDate,
      };

      mutationAddBirthday({
        variables: {
          createBirthdayInput: {
            ...newValue,
          },
        },
      });
    } else {
      let newDate;
      const formattedDate = dayjs(dataDetail?.detailBirthday.birthday).format(
        "YYYY-MM-DD"
      );

      if (values.birthday === formattedDate) {
        newDate = formattedDate;
      } else {
        const temp = dayjs(values.birthday, "DD-MM-YYYY").format("YYYY-MM-DD");
        newDate = temp;
      }

      const editValue = {
        id: slug,
        firstName: values.firstName,
        lastName: values.lastName,
        designation: values.designation,
        birthday: newDate,
      };

      mutationEditInProfile({
        variables: {
          updateBirthdayInput: {
            ...editValue,
          },
        },
      });
    }
  };

  //SET INITIAL VALUE
  const initialValues: any = useMemo(() => {
    if (slug !== "new" && dataDetail) {
      const date = dayjs(dataDetail.detailBirthday.birthday).format(
        "YYYY-MM-DD"
      );
      console.log(
        typeof dataDetail.detailBirthday.birthday,
        "dataDetail.detailBirthday"
      );
      const detail: any = { ...dataDetail.detailBirthday, birthday: date };
      return detail;
    } else {
      return emptyValues;
    }
  }, [slug, dataDetail]);

  useEffect(() => {
    if (slug !== "new") {
      fetchBirthdayById();
    }
  }, [slug, fetchBirthdayById]);

  return (
    <Layout title="Happy Birthday">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Breadcrumb
          separator={
            <Box marginBottom="8" fontSize="md">
              <BsChevronRight />
            </Box>
          }
        >
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/event-highlights" passHref>
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Happy Birthday
                </Heading>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Heading as="h1" size="xl" marginBottom="8">
              {slug === "new" ? "New" : "Details"}
            </Heading>
          </BreadcrumbItem>
        </Breadcrumb>

        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
        >
          <HappyBirthdayForm loading={addLoading} />
        </Formik>
      </VStack>
    </Layout>
  );
};

export default withAuth(HappyBirthdayDetail);
