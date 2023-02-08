import { FC, useState, useEffect } from "react";
import { Box, Button, Text, SimpleGrid, ButtonGroup } from "@chakra-ui/react";
import { Formik, Form, FieldArray, ErrorMessage } from "formik";
import { object } from "yup";

import MediaUpload from "@/components/Atoms/MediaUpload";
import AddAnother from "@/components/Atoms/AddAnother";

import { BG_GRADIENT } from "@/constants/ui";
import { arrayOfImageFeed } from "@/constants/validationSchema";
import { TCarouselInitialValues, TGetEventGallery } from "@/types/feed";
import { isEmpty } from "@/utils";
import isNil from "lodash/isNil";
import { MediaFolderType } from "@/types/upload";
import {
  useFeedGallery,
  useUpsertMultipleFile,
  useDeleteGallery,
} from "@/hooks/feed";
interface Tparam {
  file: File | string;
  folder: MediaFolderType;
  imageId: string;
}

const validationSchema = object({
  feedCarousel: arrayOfImageFeed,
});

const _initialValues: TCarouselInitialValues = {
  feedCarousel: [],
};

const processRetrievedValues = (
  values: TGetEventGallery
): TCarouselInitialValues => {
  const { feedCarousel } = values.getFeedGallery;
  const initialValues: TCarouselInitialValues = {
    feedCarousel: feedCarousel.map(({ url, id, folder }) => ({
      imageId: id,
      file: url,
      folder: folder,
      // sequence: s.generate(),
    })),
  };
  return initialValues;
};

const CarouselImages: FC = () => {
  const [initialValues, setInitialValues] = useState(_initialValues);

  const {
    fetchFeed,
    loading: isFetchingCarouselFeed,
    data: FeedCarousels,
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
      !isEmpty(FeedCarousels?.getFeedGallery.feedCarousel) &&
      !isEmpty(FeedCarousels) &&
      !isNil(FeedCarousels) &&
      !isNil(FeedCarousels.getFeedGallery.feedCarousel)
    ) {
      setInitialValues(
        processRetrievedValues(FeedCarousels as TGetEventGallery)
      );
    }
  }, [FeedCarousels]);
  // console.log("initail", FeedCarousels);

  return (
    <Box flex="1">
      <Text fontSize="md" fontWeight="bold">
        CAROUSEL IMAGE
      </Text>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const newFeedCarousel: Tparam[] = [];
          values.feedCarousel.map((data) => {
            if (data.file instanceof File) {
              newFeedCarousel.push(data);
            }
          });
          await upsertMultipleFile({
            variables: { param: newFeedCarousel },
          });

          // console.log("data", values.feedCarousel);
          // console.log("initial", initialValues.feedCarousel);
          const arrayImageId: string[] = [];
          const finalArrayImageId: string[] = [];
          values.feedCarousel.map((dataValues) => {
            arrayImageId.push(dataValues.imageId);
          });
          initialValues.feedCarousel.map((data) => {
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
                  name="feedCarousel"
                  render={({ push, remove }) => {
                    return (
                      <>
                        {values.feedCarousel.map(({ imageId }, index) => (
                          <MediaUpload
                            name={`feedCarousel.${index}.file`}
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
                              folder: MediaFolderType.FEED_CAROUSEL,
                              // sequence: s.generate(),
                            })
                          }
                        />
                      </>
                    );
                  }}
                />
              </SimpleGrid>
              {values.feedCarousel.length === 0 && (
                <ErrorMessage
                  name="feedCarousel"
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
                  type="submit"
                  isLoading={isFetchingCarouselFeed || isUploadingMultipleFile}
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
                  isLoading={isFetchingCarouselFeed || isUploadingMultipleFile}
                  color="gray.500"
                  bg="white"
                  onClick={() => {
                    setFieldValue("carouselImages", initialValues.feedCarousel);
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

export default CarouselImages;
