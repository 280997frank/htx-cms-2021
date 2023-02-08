import HLSForm from "@/components/Organisms/HLSTable";
import Layout from "@/components/Templates/Layout";
import { Box, Heading } from "@chakra-ui/react";
import React from "react";

const HlsCommittee = () => {
  return (
    <Layout title="Healthy Lifestyle (HLS) Committee">
      <Box padding={["7", "10"]}>
        <Heading as="h1" size="xl" marginBottom="8">
          Healthy Lifestyle (HLS) Committee
        </Heading>
        <HLSForm />
      </Box>
    </Layout>
  );
};

export default HlsCommittee;
