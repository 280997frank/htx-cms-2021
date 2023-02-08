import { FC } from "react";
import {
  Stack,
  VStack,
  Icon,
  IconButton,
  Avatar,
  Box,
  Flex,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { MdDelete as DeleteIcon, MdInfo as InfoIcon } from "react-icons/md";

type CommentReviewProps = {
  author: {
    name: string;
    avatar?: string;
  };
  timestamp?: string;
  isFlagged?: boolean;
  onReportClick?: () => void;
  onDeleteClick?: () => void;
};

const CommentReview: FC<CommentReviewProps> = ({
  author,
  timestamp = new Date().toISOString(),
  isFlagged = false,
  children,
  onReportClick = () => {},
  onDeleteClick = () => {},
}) => {
  const ts = dayjs(new Date(timestamp));
  return (
    <Stack
      direction="row"
      spacing={3}
      p={4}
      borderRadius="16px"
      backgroundColor={isFlagged ? "#F6B149" : ""}
      w="100%"
    >
      {isFlagged && (
        <Box>
          <IconButton
            icon={<InfoIcon />}
            aria-label="See info"
            bgColor="white"
            color="#F55A5A"
            borderRadius="50%"
            size="sm"
            fontSize="1.5rem"
            _hover={{ bgColor: "white" }}
            onClick={onReportClick}
          />
        </Box>
      )}

      <Avatar
        name={author?.name || "Anonymous"}
        src={author?.avatar}
        size="sm"
      />

      <VStack spacing={2} align="flex-start" w="100%">
        <Box fontWeight="600">{author?.name || "Anonymous"}</Box>
        <Box wordBreak="break-all">{children}</Box>
      </VStack>

      <Stack direction="row">
        <Box color="#7D7D7D">{ts.diff(Date.now(), "h")}h</Box>
        <Box pt="20px">
          <IconButton
            aria-label="Delete comment"
            icon={<Icon as={DeleteIcon} />}
            bgColor="#363636"
            color="white"
            borderRadius="50%"
            size="sm"
            _hover={{ bgColor: "red.500" }}
            sx={{
              svg: {
                width: "22px",
                height: "auto",
              },
            }}
            onClick={onDeleteClick}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default CommentReview;
