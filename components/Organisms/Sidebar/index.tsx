import { FC } from "react";
import { Box, Link, Image, Button, Heading, Center } from "@chakra-ui/react";
import NextLink from "next/link";

import Navbar from "@/components/Molecules/Navbar";
import { LogoutIcon } from "@/components/Atoms/Icons";

import menu from "@/constants/menu";

import { actions as authActions } from "@/states/auth/slice";

import { useAppDispatch } from "@/hooks";

const Sidebar: FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Box
      as="aside"
      bgColor="white"
      position="fixed"
      h="full"
      w="250px"
      overflow="auto"
      display="flex"
      flexDirection="column"
      p="6"
    >
      <NextLink href="/" passHref>
        <Link mb="5" _hover={{ textTransform: "none" }}>
          <Heading as="h1" size="md" mt="3" color="#5C068C" textAlign="center">
            conneXus
          </Heading>
        </Link>
      </NextLink>
      <Navbar menu={menu} />
      <Box flex="1" display="flex" alignItems="flex-end" marginTop="10">
        <Button
          // leftIcon={<LogoutIcon boxSize={5} />}
          onClick={() => {
            dispatch(authActions.logout());
            window.location.href = "/";
          }}
          bgColor="transparent !important"
          color="#363636"
          padding="0"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
