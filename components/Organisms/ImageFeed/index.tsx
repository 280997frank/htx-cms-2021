import { FC } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import CarouselImages from "../../Molecules/CarouselImages";
import AdsImages from "../../Molecules/AdsImages";

const ImageFeed: FC = () => {
  return (
    <SimpleGrid columns={2} spacing={5}>
      <CarouselImages />
      <AdsImages />
    </SimpleGrid>
  );
};

export default ImageFeed;
