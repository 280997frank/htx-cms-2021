import { FC } from "react";
import { VStack, Stack, Box, Progress, Divider } from "@chakra-ui/react";

type VotingItem = {
  label: string;
  count?: number;
  percentage?: number;
};

type VotingProps = {
  total: number;
  items: VotingItem[];
};

const Voting: FC<VotingProps> = ({ items = [], total = 0 }) => {
  return (
    <VStack
      p={4}
      spacing={3}
      borderRadius="16px"
      align="flex-start"
      shadow="lg"
    >
      {items.map(({ label, count = 10, percentage }, index) => {
        const percentageValue = percentage || Math.round((100 * count) / total);
        return (
          <VStack key={`vote-${index}`} spacing={0} align="flex-start" w="100%">
            <Box>{label}</Box>
            <Stack direction="row" align="center" w="100%">
              <Progress
                value={percentageValue}
                flex={1}
                borderRadius="8px"
                bg="none"
                sx={{
                  div: {
                    bgGradient: "linear(to right, #BE73ED 0%, #FFBC6C 100%)",
                  },
                }}
              />
              <Box as="span" color="#7D7D7D" fontSize="0.9rem">
                {percentageValue}%
              </Box>
            </Stack>
          </VStack>
        );
      })}
      <Divider borderColor="#D7D7D7" />
      <Stack direction="row" color="#7D7D7D" spacing={1}>
        <Box as="span">{total}</Box>
        <Box as="span">Votes</Box>
      </Stack>
    </VStack>
  );
};

export default Voting;
