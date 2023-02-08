import { FC, useMemo } from "react";
import {
  VStack,
  Stack,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { AiTwotoneLike as LikeIcon } from "react-icons/ai";
import { RiDiscussLine as CommentIcon } from "react-icons/ri";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

enum FeedPostType {
  Image = "Image",
  Status = "Status",
  Poll = "Poll",
  LiveFeed = "LiveVeed",
}

type FeedPostProps = {
  type: FeedPostType;
  timestamp: string;
  status?: string;
  likeCount?: number;
  commentCount?: number;
  isLoading?: boolean;
  profile: {
    name: string;
    avatar?: string;
  };
};

const FeedPost: FC<FeedPostProps> = ({
  status = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus lacus duis nec sed vitae rhoncus. Aliquam auctor donec purus est lorem.",
  type = FeedPostType.Image,
  timestamp = new Date().toISOString(),
  likeCount = 0,
  commentCount = 0,
  isLoading = false,
  profile = {
    name: "Anonymous",
    avatar: "https://bit.ly/dan-abramov",
  },
  children,
}) => {
  const ts = dayjs(new Date(timestamp));
  const eventStatus = useMemo(() => {
    let eventType;
    switch (type) {
      case FeedPostType.Image:
        eventType = "shared";
        break;

      case FeedPostType.Poll:
        eventType = "conducted";
        break;

      case FeedPostType.Status:
        eventType = "posted";
        break;

      default:
        break;
    }

    return `Attendee ${profile?.name} ${eventType} a ${type}`;
  }, [type, profile]);

  return (
    <VStack
      p={3}
      spacing={4}
      borderWidth="1px"
      borderColor="gray.300"
      borderRadius="8px"
      bgColor="white"
      align="flex-start"
    >
      <Stack direction="row" align="flex-start" spacing={1}>
        {isLoading && (
          <>
            <SkeletonCircle size="12" mr={3} />
            <VStack align="flex-start" spacing={2}>
              <Skeleton w="250px" h="16px" />
              <Skeleton w="80px" h="12px" />
            </VStack>
          </>
        )}

        {!isLoading && (
          <>
            <Avatar name={profile?.name} src={profile?.avatar} mr={3} />
            <VStack align="flex-start" spacing={0}>
              <Box as="span">{eventStatus}</Box>
              <Box as="span" color="#7D7D7D" fontSize="0.85rem">
                {ts.fromNow()}
              </Box>
            </VStack>
          </>
        )}
      </Stack>

      {isLoading && <SkeletonText noOfLines={4} spacing={3} w="100%" />}
      {!isLoading && <Box>{status}</Box>}
      {!isLoading && children}

      {isLoading && (
        <Stack direction="row">
          <Stack direction="row" align="center" spacing={2}>
            <SkeletonCircle size="8" />
            <Skeleton w="20px" h="14px" />
          </Stack>
          <Stack direction="row" align="center" spacing={2}>
            <SkeletonCircle size="8" />
            <Skeleton w="20px" h="14px" />
          </Stack>
        </Stack>
      )}

      {!isLoading && (likeCount > 0 || commentCount > 0) && (
        <Stack direction="row" spacing={1} py={4}>
          {likeCount > 0 && (
            <Button
              leftIcon={
                <Flex
                  p={2}
                  as="span"
                  borderRadius="50%"
                  bgColor="#363636"
                  alignItems="center"
                  w="32px"
                  h="32px"
                >
                  <Icon as={LikeIcon} color="white" />
                </Flex>
              }
              size="xs"
              fontSize="1rem"
              variant="ghost"
              fontWeight="400"
              _hover={{
                bg: "none",
                svg: {
                  transform: "scale(1.2)",
                },
              }}
            >
              {likeCount}
            </Button>
          )}

          {commentCount > 0 && (
            <Button
              leftIcon={
                <Flex p={2} as="span" alignItems="center">
                  <Icon as={CommentIcon} color="#363636" />
                </Flex>
              }
              size="xs"
              fontSize="1rem"
              variant="ghost"
              fontWeight="400"
              _hover={{
                bg: "none",
                svg: {
                  transform: "scale(1.2)",
                },
              }}
              sx={{
                span: {
                  mr: 0,
                },
              }}
            >
              {commentCount}
            </Button>
          )}
        </Stack>
      )}
    </VStack>
  );
};

export default FeedPost;
