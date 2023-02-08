import { FC, useRef, useEffect, useState, useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Spinner,
  AspectRatio,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from "agora-rtc-sdk-ng";
import isEmpty from "lodash/isEmpty";

import { useUpdateLiveFeed } from "@/hooks/feed";

import { RootState } from "@/states/store";

import { TEStatusFeedEvent, LiveFeedStatus } from "@/types/feed";

interface LiveFeedVideoProps {
  isOpen: boolean;
  onClose: () => void;
  options: {
    channelName: string;
    token: string;
  };
}

interface LiveFeed {
  client?: IAgoraRTCClient;
  localAudioTrack?: IMicrophoneAudioTrack;
  localVideoTrack?: ICameraVideoTrack;
}

const LiveFeedVideo: FC<LiveFeedVideoProps> = ({
  isOpen,
  onClose,
  options,
}) => {
  const liveFeedRef = useRef<LiveFeed>({});
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const [isVideoLoading, setVideoLoadingStatus] = useState(true);
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const { userId } = useSelector(
    (state: RootState) => ({
      userId: state.auth.profile.id,
    }),
    shallowEqual
  );

  const { updateLiveFeed } = useUpdateLiveFeed();

  const closeVideo = useCallback(async () => {
    onAlertClose();

    liveFeedRef.current.localAudioTrack?.close();
    liveFeedRef.current.localVideoTrack?.close();

    setVideoLoadingStatus(true);

    await liveFeedRef.current.client?.leave();
    liveFeedRef.current = {};

    await updateLiveFeed({
      variables: {
        params: {
          id: options.channelName,
          status: TEStatusFeedEvent.Approved,
          currentProcess: LiveFeedStatus.done,
        },
      },
    });
    onClose();
  }, [onAlertClose, onClose, updateLiveFeed, options.channelName]);

  useEffect(() => {
    const { channelName, token } = options;

    if (isOpen && channelName && token && isEmpty(liveFeedRef.current)) {
      import("agora-rtc-sdk-ng")
        .then((data) => data.default)
        .then(async (AgoraRTC) => {
          liveFeedRef.current.client = AgoraRTC.createClient({
            mode: "live",
            codec: "vp8",
          });

          await liveFeedRef.current.client.setClientRole("host");

          liveFeedRef.current.localAudioTrack =
            await AgoraRTC.createMicrophoneAudioTrack();
          liveFeedRef.current.localVideoTrack =
            await AgoraRTC.createCameraVideoTrack();

          await liveFeedRef.current.client?.join(
            process.env.NEXT_PUBLIC_AGORA_APP_ID as string,
            channelName,
            token,
            userId
          );

          return liveFeedRef.current.client?.publish([
            liveFeedRef.current.localAudioTrack,
            liveFeedRef.current.localVideoTrack,
          ]);
        })
        .then(() => {
          setVideoLoadingStatus(false);

          liveFeedRef.current.localVideoTrack?.play("video-player");
        })
        .catch((error) => {
          closeVideo();

          toast({
            title: error.message,
            position: "bottom",
            isClosable: true,
            status: "error",
          });
        });
    }
  }, [isOpen, toast, options, userId, closeVideo]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onAlertOpen} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody p="0">
            <AspectRatio ratio={16 / 9}>
              <Box id="video-player" height="100%" width="100%">
                {isVideoLoading ? <Spinner size="xl" /> : null}
              </Box>
            </AspectRatio>
          </ModalBody>
          <ModalCloseButton bg="white" />
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Close Live Feed
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" ml={3} onClick={closeVideo}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default LiveFeedVideo;
