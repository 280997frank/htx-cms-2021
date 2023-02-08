import { NextPage } from "next";
import Link from "next/link";
import {
  Box,
  Stack,
  VStack,
  SimpleGrid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  FormControl,
  FormLabel,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  SkeletonText,
  // TODO: replace with next/image
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { BiChevronRight as BreadcrumbIcon } from "react-icons/bi";
import { AiOutlineSearch as SearchIcon } from "react-icons/ai";
import { DebounceInput } from "react-debounce-input";

import Layout from "components/Templates/Layout";
import Voting from "components/Molecules/Voting";
import FeedPost from "components/Molecules/FeedPost";
import ReportListModal from "components/Molecules/ReportListModal";
import CommentReview from "components/Atoms/CommentReview";
import ConfirmModal from "components/Atoms/ConfirmDialog";
import { useErrorMessage } from "hooks";
import useFeedDetails, { FeedStatus, FeedPostType } from "hooks/useFeedDetails";

const FeedDetailPage: NextPage = () => {
  const {
    feedDetails,
    comments,
    hasComments,
    pendingCommentDelete,
    confirmDeleteComment,
    deleteComment,
    isLoading,
    isUpdatingStatus,
    updateStatus,
    searchComment,
    isLoadComment,
    error,
  } = useFeedDetails();

  const {
    isOpen: isReportListOpen,
    onClose: onCancelReportList,
    onOpen,
  } = useDisclosure();

  useErrorMessage(error);

  return (
    <Layout title="Feed Details">
      <Box as="main" p={["7", "10"]}>
        <form>
          <SimpleGrid columns={2} gap={10}>
            <VStack spacing={7} align="flex-start">
              <Breadcrumb
                spacing={1}
                separator={<Icon as={BreadcrumbIcon} color="gray.800" />}
                fontSize="2rem"
                fontWeight="700"
              >
                <BreadcrumbItem color="#D7D7D7">
                  <BreadcrumbLink as={Link} href="/feed">
                    Feed
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                  <BreadcrumbLink href="#">{feedDetails.type}</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>

              <FormControl id="status">
                <FormLabel textTransform="uppercase" fontWeight="600">
                  Status
                </FormLabel>
                {isLoading && <Skeleton w="100%" h="35px" />}
                {!isLoading && (
                  <Select
                    name="status"
                    placeholder="Status"
                    bgColor="white"
                    value={feedDetails?.status}
                    isDisabled={isUpdatingStatus}
                    onChange={(event) =>
                      updateStatus(event.target.value as FeedStatus)
                    }
                  >
                    <option value={FeedStatus.UnderModeration}>
                      Under Moderation
                    </option>
                    <option value={FeedStatus.Approved}>Approved</option>
                    <option value={FeedStatus.Rejected}>Rejected</option>
                  </Select>
                )}
              </FormControl>

              <FormControl
                id="post"
                opacity={feedDetails.status === FeedStatus.Rejected ? 0.35 : 1}
              >
                <FormLabel textTransform="uppercase" fontWeight="600">
                  Post
                </FormLabel>
                <FeedPost
                  isLoading={isLoading}
                  profile={feedDetails.author}
                  status={feedDetails.post}
                  type={feedDetails.type}
                  timestamp={feedDetails.time}
                  likeCount={feedDetails.totalLikes}
                  commentCount={feedDetails.totalComments}
                >
                  {feedDetails.type === FeedPostType.Image && (
                    <Box borderRadius="8px" overflow="hidden">
                      <Image src={feedDetails.image} alt="" />
                    </Box>
                  )}

                  {console.log(feedDetails.type)}
                  {feedDetails.type === FeedPostType.Poll && (
                    <Box w="100%">
                      <Voting
                        // TODO: Replace total from API
                        total={1618}
                        items={
                          feedDetails?.polls?.map(
                            ({ option: label, percentage }) => ({
                              label,
                              percentage,
                            })
                          ) ?? []
                        }
                      />
                    </Box>
                  )}
                </FeedPost>
              </FormControl>
            </VStack>

            <FormControl id="comments">
              <FormLabel textTransform="uppercase" fontWeight="600">
                Comments
              </FormLabel>
              <VStack
                p={3}
                pt={6}
                spacing={4}
                borderWidth="1px"
                borderColor="gray.300"
                borderRadius="8px"
                bgColor="white"
                align="flex-start"
              >
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={SearchIcon} />
                  </InputLeftElement>
                  <Input
                    as={DebounceInput}
                    // @ts-ignore
                    debounceTimeout={500}
                    type="text"
                    placeholder="Search"
                    borderColor="gray.300"
                    isDisabled={!hasComments || isLoadComment}
                    onChange={(event) => searchComment(event.target.value)}
                  />
                </InputGroup>

                <VStack
                  spacing={0}
                  overflow="auto"
                  maxH="calc(100vh - 210px)"
                  w="100%"
                >
                  {isLoadComment && (
                    <Box w="100%" p={3}>
                      <SkeletonText noOfLines={10} spacing={3} />
                    </Box>
                  )}

                  {!isLoadComment && !hasComments && (
                    <Stack
                      align="center"
                      justify="center"
                      color="gray.300"
                      h="50vh"
                    >
                      <Box>No comments</Box>
                    </Stack>
                  )}

                  {!isLoadComment &&
                    hasComments &&
                    comments.map((props) => (
                      <CommentReview
                        key={`comment-${props.id}`}
                        onReportClick={onOpen}
                        onDeleteClick={() => confirmDeleteComment(props.id)}
                        {...props}
                      />
                    ))}
                </VStack>
              </VStack>

              <ConfirmModal
                isOpen={Boolean(pendingCommentDelete)}
                onClose={() => confirmDeleteComment(null)}
                onConfirmAction={deleteComment}
                header="Delete comment"
                body={`Delete comment from ${pendingCommentDelete?.author?.name}`}
                type="delete"
              />

              <ReportListModal
                isOpen={isReportListOpen}
                onClose={onCancelReportList}
                onDelete={onCancelReportList}
                list={[
                  {
                    label: "Report Category",
                    total: 3,
                  },
                  {
                    label: "Report Category",
                    total: 5,
                  },
                ]}
              />
            </FormControl>
          </SimpleGrid>
        </form>
      </Box>
    </Layout>
  );
};

export default FeedDetailPage;
