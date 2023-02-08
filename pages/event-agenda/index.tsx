import React, { FC, useState } from "react";
import EventAgendaTable from "@/components/Organisms/EventAgendaTable";
import {
  Heading,
  Box,
  Flex,
  Spacer,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";

import withAuth from "@/utils/withAuth";
import Layout from "@/components/Templates/Layout";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { RiCalendarEventFill } from "react-icons/ri";
import dayjs from "dayjs";
import "react-day-picker/lib/style.css";
const EventAgenda: FC = () => {
  const dayEvent = dayjs(new Date().getTime());
  const [dateEventAgenda, setDateEventAgend] = useState(
    dayEvent.format("YYYY-MM-DD")
  );
  // const [dateEventAgendaEnd, setDateEventAgendEnd] = useState(
  //   dayEvent.format("YYYY-MM-DD")
  // );
  // console.log("date", dateEventAgenda);
  return (
    <Layout title="Event Agenda | ZodiacLive CMS">
      <Box minHeight="100vh" width="100%" padding="2rem 3rem" bg="grey.100">
        <Flex>
          <Box>
            <Heading as="h2" size="xl" fontWeight="extrabold">
              Event Agenda
            </Heading>
          </Box>
          <Spacer />
          <Box width="250px">
            <DayPickerInput
              format="DD-MM-YYYY"
              value={dateEventAgenda}
              component={(props: Record<string, unknown>) => {
                return (
                  <InputGroup>
                    <InputLeftElement
                      // pointerEvents="none"
                      color="gray.300"
                      fontSize="1.2em"
                    >
                      <RiCalendarEventFill style={{ fill: "url(#lgrad)" }} />
                    </InputLeftElement>
                    <Input {...props} />
                  </InputGroup>
                );
              }}
              onDayChange={(date) => {
                const day = dayjs(date);
                setDateEventAgend(day.format("YYYY-MM-DD"));
                // setDateEventAgendEnd(day.format("YYYY-MM-DD"));
              }}
            />
          </Box>
        </Flex>
        <EventAgendaTable dateEventAgenda={dateEventAgenda} />
      </Box>
    </Layout>
  );
};

export default withAuth(EventAgenda);
