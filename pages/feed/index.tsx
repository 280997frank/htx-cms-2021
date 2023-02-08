import { FC, useCallback, useState, useEffect, useRef } from "react";
import {
  Heading,
  Box,
  Flex,
  Spacer,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { IoIosVideocam } from "react-icons/io";
import s from "shortid";

import Layout from "components/Templates/Layout";
import ImageFeed from "@/components/Organisms/ImageFeed";
import FeedTable from "@/components/Organisms/FeedTable";
import LiveFeedVideo from "@/components/Atoms/LiveFeedVideo";

import { useAgoraToken } from "@/hooks/liveFeed";
import { useCreateLiveFeed } from "@/hooks/feed";

import withAuth from "@/utils/withAuth";

import { BG_GRADIENT } from "@/constants/ui";

import { AgoraRole } from "@/types/liveFeed";
import { TTypeFeedEvent } from "@/types/feed";

type TTabCustom = {
  title: string;
};

const TabCustom: FC<TTabCustom> = ({ title }) => {
  return (
    <Tab
      p="0"
      mr="6"
      color="gray"
      _selected={{
        color: "black",
        fontWeight: "bold",
        borderBottom: "solid 4px transparent",
        background: `linear-gradient(white, white), ${BG_GRADIENT}`,
        backgroundOrigin: "border-box",
        bgClip: "padding-box, border-box",
      }}
    >
      {title}
    </Tab>
  );
};

const Feed: FC = () => {
  const toast = useToast();
  const { fetchAgoraToken, data } = useAgoraToken();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [liveFeedOptions, setLiveFeedOptions] = useState({
    channelName: "",
    token: "",
  });
  const channelNameRef = useRef("");
  const { createLiveFeed } = useCreateLiveFeed();

  const startLiveFeed = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_AGORA_APP_ID) {
      return toast({
        title: "Live stream app ID is not defined",
        position: "bottom",
        isClosable: true,
        status: "error",
      });
    }

    const liveFeedDetail = await createLiveFeed({
      variables: {
        params: {
          type: TTypeFeedEvent.LiveFeed,
          postingText: "",
        },
      },
    });

    if (liveFeedDetail.data?.postingFeedEvent.id) {
      fetchAgoraToken({
        variables: {
          getAgoraTokenInput: {
            channelName: liveFeedDetail.data.postingFeedEvent.id,
            role: AgoraRole.PUBLISHER,
          },
        },
      });

      channelNameRef.current = liveFeedDetail.data.postingFeedEvent.id;
      onOpen();
    }
  }, [toast, onOpen, fetchAgoraToken, createLiveFeed]);

  useEffect(() => {
    if (data?.getAgoraToken) {
      setLiveFeedOptions({
        channelName: channelNameRef.current,
        token: data.getAgoraToken,
      });
    }
  }, [data?.getAgoraToken]);

  return (
    <Layout title="Event Feed | ZodiacLive CMS">
      <main>
        <Box minHeight="100vh" width="100%" padding="2rem 3rem" bg="grey.100">
          <Flex>
            <Box>
              <Heading as="h2" size="xl" fontWeight="extrabold">
                Feed
              </Heading>
            </Box>
            <Spacer />
            <Box>
              <Button
                leftIcon={<IoIosVideocam />}
                bg={BG_GRADIENT}
                color="white"
                _hover={{
                  background: { BG_GRADIENT },
                }}
                onClick={startLiveFeed}
              >
                Go Live
              </Button>
            </Box>
          </Flex>
          <Box mt="1rem">
            <Tabs variant="unstyled">
              <TabList>
                <TabCustom title="POST MODERATION LIST" />
                <TabCustom title="IMAGES" />
              </TabList>
              <TabPanels>
                <TabPanel p="0" pt="5">
                  <FeedTable />
                </TabPanel>
                <TabPanel p="0" pt="5">
                  <ImageFeed />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </main>
      <LiveFeedVideo
        options={liveFeedOptions}
        isOpen={isOpen}
        onClose={() => {
          setLiveFeedOptions({
            channelName: "",
            token: "",
          });
          onClose();
        }}
      />
    </Layout>
  );
};

export default withAuth(Feed);
