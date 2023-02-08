import { FC, useState, useEffect } from "react";
import { Box, Button, Text, SimpleGrid, ButtonGroup } from "@chakra-ui/react";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
// import s from "shortid";
import { object } from "yup";

import MediaUpload from "@/components/Atoms/MediaUpload";
import AddAnother from "@/components/Atoms/AddAnother";

import { BG_GRADIENT } from "@/constants/ui";
import { arrayOfImageFeed } from "@/constants/validationSchema";
import { isEmpty } from "@/utils";
import isNil from "lodash/isNil";
// import { useUploadMultipleFile } from "@/hooks/upload";
import { MediaFolderType } from "@/types/upload";
import {
  useFeedGallery,
  useUpsertMultipleFile,
  useDeleteGallery,
} from "@/hooks/feed";
import { TAdsImagesInitialValues, TGetEventGallery } from "@/types/feed";

interface Tparam {
  file: File | string;
  folder: MediaFolderType;
  imageId: string;
}

const validationSchema = object({
  feedAd: arrayOfImageFeed,
});

const _initialValues: TAdsImagesInitialValues = {
  feedAd: [],
};

const processRetrievedValues = (
  values: TGetEventGallery
): TAdsImagesInitialValues => {
  const { feedAd } = values.getFeedGallery;
  const initialValues: TAdsImagesInitialValues = {
    feedAd: feedAd.map(({ id, url, folder }) => ({
      imageId: id,
      file: url,
      folder: folder,
      // sequence: s.generate(),
    })),
  };
  return initialValues;
};

const AdsImages: FC = () => {
  const [initialValues, setInitialValues] = useState(_initialValues);

  const {
    fetchFeed,
    loading: isFetchingFeedAdd,
    data: FeedAdds,
  } = useFeedGallery();

  const {
    upsertMultipleFile,
    data: multipleUploadResponse,
    loading: isUploadingMultipleFile,
  } = useUpsertMultipleFile();

  const {
    fetchDeleteGallery,
    data: DeleteGalleryResponse,
    loading: isDeleteGallery,
  } = useDeleteGallery();

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  useEffect(() => {
    if (
      !isEmpty(FeedAdds?.getFeedGallery.feedAd) &&
      !isEmpty(FeedAdds) &&
      !isNil(FeedAdds) &&
      !isNil(FeedAdds.getFeedGallery.feedAd)
    ) {
      setInitialValues(processRetrievedValues(FeedAdds as TGetEventGallery));
    }
  }, [FeedAdds]);

  return (
    <Box flex="1">
      <Text fontSize="md" fontWeight="bold">
        ADS IMAGE
      </Text>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const newFeedAdd: Tparam[] = [];
          values.feedAd.map((data) => {
            if (data.file instanceof File) {
              newFeedAdd.push(data);
            }
          });
          await upsertMultipleFile({
            variables: { param: newFeedAdd },
          });

          // console.log("data", values.feedAd);
          // console.log("initial", initialValues.feedAd);
          const arrayImageId: string[] = [];
          const finalArrayImageId: string[] = [];
          values.feedAd.map((dataValues) => {
            arrayImageId.push(dataValues.imageId);
          });
          initialValues.feedAd.map((data) => {
            if (!arrayImageId.includes(data.imageId)) {
              finalArrayImageId.push(data.imageId);
            }
          });
          if (finalArrayImageId.length !== 0) {
            await fetchDeleteGallery({
              variables: {
                imageIds: finalArrayImageId,
              },
            });
          }
          // console.log("arrayImageId", arrayImageId);
          // console.log("finalArrayImageId", finalArrayImageId);
        }}
      >
        {({ values, setFieldValue }) => {
          // console.log("values", values);
          return (
            <Form>
              <SimpleGrid
                columns={2}
                spacing={5}
                p="5"
                border="solid 1px "
                borderColor="gray.200"
                borderRadius="5"
              >
                <FieldArray
                  name="feedAd"
                  render={({ push, remove }) => {
                    return (
                      <>
                        {values.feedAd.map(({ imageId }, index) => (
                          <MediaUpload
                            name={`feedAd.${index}.file`}
                            type="image"
                            accept="image"
                            key={imageId}
                            onRemove={() => remove(index)}
                          />
                        ))}
                        <AddAnother
                          isVisible={false}
                          onClick={() =>
                            push({
                              file: "",
                              folder: MediaFolderType.FEED_ADD,
                              // sequence: s.generate(),
                            })
                          }
                        />
                      </>
                    );
                  }}
                />
              </SimpleGrid>
              {values.feedAd.length === 0 && (
                <ErrorMessage
                  name="feedAd"
                  render={(msg: string) => {
                    return (
                      <Text fontSize="12px" color="red" mt={1}>
                        {msg}
                      </Text>
                    );
                  }}
                />
              )}
              <ButtonGroup mt="8">
                <Button
                  isLoading={
                    isFetchingFeedAdd ||
                    isUploadingMultipleFile ||
                    isDeleteGallery
                  }
                  type="submit"
                  bg={BG_GRADIENT}
                  color="white"
                  _hover={{
                    background: { BG_GRADIENT },
                  }}
                >
                  Save Images
                </Button>
                <Button
                  variant="outline"
                  isLoading={
                    isFetchingFeedAdd ||
                    isUploadingMultipleFile ||
                    isDeleteGallery
                  }
                  color="gray.500"
                  bg="white"
                  onClick={() => {
                    setFieldValue("feedAd", initialValues.feedAd);
                  }}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default AdsImages;
