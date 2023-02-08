import {
  Box,
  Flex,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Grid,
  Text,
  Skeleton,
  HStack,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import Layout from "@/components/Templates/Layout";
import { CgChevronRight } from "react-icons/cg";
// import Link from "next/link";
import { getDetailReq, getReqFirebase } from "@/hooks/groupBuy";
import { GetStaticProps } from "next";
import { IGroupBuy } from "@/types/groupBuy";
import { useRouter } from "next/router";
// import dayjs from "dayjs";
import withAuth from "@/utils/withAuth";

interface IBoxCard {
  headingText: string;
  text: string | number;
  isLoading: boolean;
}

const Detail = (props: IGroupBuy) => {
  const router = useRouter();
  return (
    <Layout title="Detail Group Buy">
      <Box h="100vh" padding={["7", "10"]}>
        <Flex flexDir="column">
          <Heading size="xl" mb="8">
            <Breadcrumb separator={<CgChevronRight color="gray.500" />}>
              <BreadcrumbItem>
                <BreadcrumbLink color="#d7d7d7" href="/group-buy">
                  Group Buy
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage={true}>
                <BreadcrumbLink pointerEvents="none" href="#">
                  {props.Category}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Heading>
          <Grid
            w="100%"
            templateRows="min-content"
            templateColumns="repeat(2, 1fr)"
            gap={6}
            mt="25px"
          >
            <Box>
              <Flex flexDirection="column" gridGap="20px">
                <BoxCard
                  headingText="Category"
                  text={props.Category}
                  isLoading={router.isFallback}
                />
                <Flex justifyContent="space-between" gridGap="20px">
                  <BoxCard
                    headingText="product"
                    text={props.Item}
                    isLoading={router.isFallback}
                  />
                  <BoxCard
                    headingText="Brand"
                    text={props.Brand}
                    isLoading={router.isFallback}
                  />
                </Flex>
                <BoxCard
                  headingText="DETAILS"
                  text={props.Details}
                  isLoading={router.isFallback}
                />
              </Flex>
            </Box>
            <Box>
              <Heading size="sm" fontWeight="semibold" mb="10px">
                CONTACT DETAILS
              </Heading>
              <HStack
                justifyContent="space-between"
                borderRadius="8px"
                border="1px solid #d7d7d7"
                p="8px"
              >
                <BoxCard
                  headingText="Contact Person"
                  text={props.ContactPerson}
                  isLoading={router.isFallback}
                />
                <BoxCard
                  headingText="Telegram Username"
                  text={props.TelegramUsername}
                  isLoading={router.isFallback}
                />
              </HStack>
              <Heading size="sm" fontWeight="semibold" m="40px 0 10px 0">
                ORDER DETAILS
              </Heading>
              <VStack
                justifyContent="space-between"
                borderRadius="8px"
                border="1px solid #d7d7d7"
                p="8px"
              >
                <HStack width="100%" mb="10px">
                  <BoxCard
                    headingText="Order By"
                    text={props.OrderClosing}
                    isLoading={router.isFallback}
                  />
                  <BoxCard
                    headingText="Delivery Date"
                    text={props.ExpectedDelivery}
                    isLoading={router.isFallback}
                  />
                </HStack>
                <BoxCard
                  headingText="Pick-up Location"
                  text={props.PickupLocation}
                  isLoading={router.isFallback}
                />
              </VStack>
            </Box>
          </Grid>
        </Flex>
      </Box>
    </Layout>
  );
};

const BoxCard = ({ headingText, text, isLoading }: IBoxCard) => {
  return (
    <Box w="100%">
      <Heading
        textTransform="uppercase"
        size="sm"
        fontWeight="semibold"
        mb="5px"
      >
        {headingText}
      </Heading>
      {isLoading ? (
        <Skeleton height="15px" />
      ) : (
        <Text color="#7d7d7d" fontSize="14px">
          {text}
        </Text>
      )}
    </Box>
  );
};

export async function getStaticPaths() {
  const data = getReqFirebase();
  const paths = data.map((item: any) => ({
    params: { groupId: item.id },
  }));
  return { paths, fallback: true };
}

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const req = await getDetailReq(params.groupId);
  if (req === null) {
    return {
      notFound: true,
    };
  }
  return {
    props: { ...req },
    revalidate: 1,
  };
};

export default withAuth(Detail);
