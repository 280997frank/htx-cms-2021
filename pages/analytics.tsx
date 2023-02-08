import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import Layout from "@/components/Templates/Layout";
import withAuth from "@/utils/withAuth";
import Panel from "@/components/Molecules/Panel";
import { TGetAnalyticsResponse, TTypeAnalytics } from "types/analytics";
import { initialAnalytic } from "constants/intialAnalytics";
import { useAnalytics, useExportAnalytics } from "@/hooks/analytics";
import { isNil } from "lodash";
import { BG_GRADIENT } from "@/constants/ui";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { RiCalendarEventFill } from "react-icons/ri";
import dayjs from "dayjs";
import "react-day-picker/lib/style.css";
interface TItemsAnalytic {
  title: string;
  Point: number;
}
const ItemAnalytic: FC<TItemsAnalytic> = ({ title, Point }) => {
  return (
    <Stack
      height="auto"
      border="1px"
      borderColor="gray.200"
      borderRadius="10px"
      p="10px"
      pl="15px"
      direction="column"
    >
      <Text
        fontSize={{
          base: "xs",
          "2xl": "md",
        }}
        fontWeight="normal"
        color="gray"
      >
        {title}
      </Text>
      <Text
        fontWeight="bold"
        fontSize={{
          base: "28px",
          "2xl": "36px",
        }}
      >
        {Point}
      </Text>
    </Stack>
  );
};
const Analytics: FC = () => {
  const dayEvent = dayjs(new Date().getTime());
  const [startDateEventAgenda, setStartDateEventAgend] = useState(
    dayEvent.format("YYYY-MM-DD")
  );
  const [endDateEventAgenda, setEndDateEventAgend] = useState(
    dayEvent.format("YYYY-MM-DD")
  );

  const { fetchAnalytics, data, loading } = useAnalytics({
    filter: {
      startDate: startDateEventAgenda,
      endDate: endDateEventAgenda,
    },
  });
  const [DataAnalytics, setDataAnalytics] =
    useState<TGetAnalyticsResponse>(initialAnalytic);
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);
  useEffect(() => {
    if (!isNil(data)) {
      setDataAnalytics(data);
    }
  }, [data]);
  const { fetchExportAnalytics } = useExportAnalytics();
  const handleExportAnalytics = async (startDate: string, endDate: string) => {
    await fetchExportAnalytics({
      startDate: startDate,
      endDate: endDate,
    });
  };
  // console.log("dateEventAgenda", dateEventAgenda);

  return (
    <Layout title="Analytics | HTX">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Flex width="100%" justifyContent="space-between">
          <Heading as="h1" size="xl" marginBottom="8">
            Analytics
          </Heading>

          <Stack direction="row">
            <Button
              colorScheme={BG_GRADIENT}
              bgImage={BG_GRADIENT}
              color="white"
              onClick={() =>
                handleExportAnalytics(startDateEventAgenda, endDateEventAgenda)
              }
            >
              Export Spreadsheet
            </Button>
            <DayPickerInput
              format="DD-MM-YYYY"
              value={startDateEventAgenda}
              component={(props: Record<string, unknown>) => {
                return (
                  <InputGroup
                    color="#5C068C"
                    fontSize="1.2em"
                    borderColor="#5C068C"
                    width="260px"
                  >
                    <InputLeftElement
                      // pointerEvents="none"
                      color="#5C068C"
                      fontSize="1.2em"
                      borderColor="#5C068C"
                    >
                      <RiCalendarEventFill style={{ fill: "#5C068C" }} />
                    </InputLeftElement>
                    <Input {...props} />
                  </InputGroup>
                );
              }}
              onDayChange={(date) => {
                const day = dayjs(date);
                setStartDateEventAgend(day.format("YYYY-MM-DD"));
                // setDateEventAgendEnd(day.format("YYYY-MM-DD"));
              }}
            />
            <DayPickerInput
              format="DD-MM-YYYY"
              value={endDateEventAgenda}
              component={(props: Record<string, unknown>) => {
                return (
                  <InputGroup
                    color="#5C068C"
                    fontSize="1.2em"
                    borderColor="#5C068C"
                    width="260px"
                  >
                    <InputLeftElement
                      // pointerEvents="none"
                      color="#5C068C"
                      fontSize="1.2em"
                      borderColor="#5C068C"
                    >
                      <RiCalendarEventFill style={{ fill: "#5C068C" }} />
                    </InputLeftElement>
                    <Input {...props} />
                  </InputGroup>
                );
              }}
              onDayChange={(date) => {
                const day = dayjs(date);
                setEndDateEventAgend(day.format("YYYY-MM-DD"));
                // setDateEventAgendEnd(day.format("YYYY-MM-DD"));
              }}
            />
          </Stack>
        </Flex>

        <Panel label="NUMBER OF CLICKS">
          <Stack direction="row" align="flex-start" width="full" spacing="10">
            <Stack width="50%">
              <Heading as="h1" size="small">
                PINNED MENU
              </Heading>
              <SimpleGrid columns={3} spacing={2}>
                <ItemAnalytic
                  title="What's Up"
                  Point={DataAnalytics.whatsUp.total}
                />
                <ItemAnalytic
                  title="In Profile"
                  Point={DataAnalytics.inProfile.total}
                />
                <ItemAnalytic
                  title="Congrats"
                  Point={DataAnalytics.congrats.total}
                />
                <ItemAnalytic
                  title="Happy Birthday"
                  Point={DataAnalytics.hbd.total}
                />
                <ItemAnalytic
                  title="Group Buy"
                  Point={DataAnalytics.groupBuy.total}
                />
                <ItemAnalytic
                  title="X Marks the Spot"
                  Point={DataAnalytics.pickYourChoice.total}
                />
                <ItemAnalytic
                  title="Announcement"
                  Point={DataAnalytics.announcement.total}
                />
                <ItemAnalytic
                  title="Spotlight"
                  Point={DataAnalytics.spotlight.total}
                />
              </SimpleGrid>
            </Stack>
            <Stack width="50%">
              <Heading as="h1" size="small">
                HIDDEN MENU
              </Heading>
              <SimpleGrid columns={3} spacing={2}>
                <ItemAnalytic
                  title="TechXchange"
                  Point={DataAnalytics.techxchange.total}
                />
                <ItemAnalytic
                  title="Event Highlights"
                  Point={DataAnalytics.eventHighlights.total}
                />
                <ItemAnalytic
                  title="Feedback"
                  Point={DataAnalytics.feedback.total}
                />
                <ItemAnalytic
                  title="HLS Committee"
                  Point={DataAnalytics.hlsCommittee.total}
                />
                <ItemAnalytic
                  title="HTX Houses"
                  Point={DataAnalytics.htxHouses.total}
                />
                <ItemAnalytic
                  title="TechXplain"
                  Point={DataAnalytics.techxplain.total}
                />
              </SimpleGrid>
            </Stack>
          </Stack>
          <Stack direction="row" align="flex-start" width="full" spacing="10">
            <Stack width="50%">
              <Heading as="h1" size="small">
                GAMES
              </Heading>
              <SimpleGrid columns={3} spacing={2}>
                <ItemAnalytic
                  title="BEJEWELED"
                  Point={DataAnalytics.bejeweled.total}
                />
                <ItemAnalytic
                  title="Drone Patrol"
                  Point={DataAnalytics.dronePatrol.total}
                />
                <ItemAnalytic
                  title="Fruit Ninja"
                  Point={DataAnalytics.fruitNinja.total}
                />
              </SimpleGrid>
            </Stack>
            <Stack width="50%">
              <Heading as="h1" size="small">
                CARDS AND WISHES
              </Heading>
              <SimpleGrid columns={3} spacing={2}>
                <ItemAnalytic
                  title="Clicks"
                  Point={DataAnalytics.cardAndWishes.total}
                />
                <ItemAnalytic
                  title="Cards Sent"
                  Point={DataAnalytics.cardSent.total}
                />
              </SimpleGrid>
            </Stack>
          </Stack>
        </Panel>
      </VStack>
    </Layout>
  );
};

export default withAuth(Analytics);
