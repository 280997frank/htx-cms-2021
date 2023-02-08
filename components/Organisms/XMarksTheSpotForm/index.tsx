import TextInput from "@/components/Atoms/TextInput";
import Panel from "@/components/Molecules/Panel";
import { BG_GRADIENT, PRIMARY_COLOR } from "@/constants/ui";
import { arrayOfAnswers, requiredString } from "@/constants/validationSchema";
import {
  useXmarksDetail,
  useXmarksInsert,
  useXmarksUpdate,
} from "@/hooks/xmarksthespot";
import { TXMarksTheSpotForm } from "@/types/xmarksthespot";
import { Button, ButtonGroup } from "@chakra-ui/button";
import {
  Box,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { FieldArray, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { object } from "yup";

const XMarksTheSpotFormInitialValues: TXMarksTheSpotForm = {
  id: "",
  question: "",
  answer: [
    {
      id: "",
      option: "",
      count: "",
      percentage: "",
    },
  ],
};

const validationSchema = object({
  question: requiredString,
  answer: arrayOfAnswers,
});

interface XMarksTheSpotFormArgs {
  breadcrumbItem: (item: string) => void;
}

interface TAnswer {
  id: string;
  option: string;
  count: string;
  percentage: string;
}

export const XMarksTheSpotForm: FC<XMarksTheSpotFormArgs> = ({
  breadcrumbItem,
}) => {
  const router = useRouter();
  const { slug } = router.query;

  const [initialValues, setInitialValues] = useState<TXMarksTheSpotForm>(
    XMarksTheSpotFormInitialValues
  );

  const { mutationInsertXmarks } = useXmarksInsert();
  const { mutationUpdateXmarks } = useXmarksUpdate();
  const { mutationDetailXmarks, data: getById } = useXmarksDetail(
    slug as string
  );

  useEffect(() => {
    if (slug !== undefined && slug !== "new") {
      mutationDetailXmarks();
    }
  }, [slug, mutationDetailXmarks]);

  useEffect(() => {
    if (slug !== undefined && slug === "new") {
      breadcrumbItem("New");
      setInitialValues(XMarksTheSpotFormInitialValues);
    } else {
      if (getById !== undefined && getById !== null) {
        breadcrumbItem(getById.detailXmark.question);
        setInitialValues({
          id: getById.detailXmark.id,
          question: getById.detailXmark.question,
          answer: getById.detailXmark.answers,
        });
      }
    }
  }, [slug, getById, breadcrumbItem]);

  const submitForm = useCallback(
    async (values: TXMarksTheSpotForm) => {
      if (slug !== undefined && slug === "new") {
        const properValues = {
          createXmarkInput: {
            question: values.question,
            answer: values.answer.map((item) => {
              return item.option;
            }),
          },
        };

        // console.log(properValues);
        mutationInsertXmarks({
          variables: properValues,
        });
      } else {
        if (getById !== undefined && getById !== null) {
          const answers: TAnswer[] = [];
          values.answer.map((item, index) => {
            answers.push({
              id: item.id || index.toString(),
              option: item.option,
              count: item.count || "0",
              percentage: item.percentage || "0",
            });
          });

          const properValues = {
            updateXmarkInput: {
              id: slug as string,
              question: values.question,
              isActive: getById.detailXmark.isActive === 1 || false,
              answer: answers,
            },
          };

          // console.log(properValues);
          mutationUpdateXmarks({
            variables: properValues,
          });
        }
      }
    },
    [mutationInsertXmarks, mutationUpdateXmarks, getById, slug]
  );

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={async (values) => {
        await submitForm(values);
      }}
    >
      {({ values, isSubmitting, resetForm }) => (
        <Form style={{ width: "100%" }}>
          <Stack direction={["column", "row"]} align="flex-start" spacing="10">
            <VStack spacing="6" w={["100%", "50%"]}>
              <Panel label="QUESTION">
                <TextInput
                  name="question"
                  label=""
                  id="question"
                  placeholder="Question"
                />
              </Panel>
              <Panel label="ANSWER">
                <FieldArray name="answer">
                  {({ remove, push }) => (
                    <>
                      <SimpleGrid columns={2} spacing={5}>
                        {/* <TextInput
                          name={`answer.0.option`}
                          label=""
                          id={s.generate()}
                          placeholder="Answer"
                        />
                        <TextInput
                          name={`answer.1.option`}
                          label=""
                          id={s.generate()}
                          placeholder="Answer"
                        />
                        <TextInput
                          name={`answer.2.option`}
                          label=""
                          id={s.generate()}
                          placeholder="Answer"
                        /> */}
                        {values.answer.map((_, index) => (
                          <TextInput
                            key={index}
                            name={`answer.${index}.option`}
                            label=""
                            id={index.toString()}
                            placeholder="Answer"
                          />
                        ))}
                      </SimpleGrid>
                      <Button
                        border="0.2rem"
                        bgColor="white"
                        borderStyle="dashed"
                        borderColor={PRIMARY_COLOR}
                        color={PRIMARY_COLOR}
                        isFullWidth
                        onClick={() => {
                          push({
                            id: null,
                            value: "",
                          });
                        }}
                      >
                        + Add Option
                      </Button>
                    </>
                  )}
                </FieldArray>
              </Panel>
            </VStack>
            <VStack w={["100%", "50%"]}>
              {slug !== undefined && slug !== "new" && (
                <Panel label="RESULT">
                  <SimpleGrid columns={2} spacing={3} w="100%">
                    {getById !== undefined &&
                      getById !== null &&
                      getById.detailXmark.answers.map((item, index) => (
                        <Box
                          key={index}
                          border="2px"
                          borderColor="blackAlpha.300"
                          p="1rem"
                          borderRadius="0.5rem"
                        >
                          <Text color="grey" mb="0.5rem">
                            Answered {item.option}
                          </Text>
                          <Heading>
                            {item.count} ({item.percentage}%)
                          </Heading>
                        </Box>
                      ))}
                  </SimpleGrid>
                </Panel>
              )}
            </VStack>
          </Stack>
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
export default XMarksTheSpotForm;
