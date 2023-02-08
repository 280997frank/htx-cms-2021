import { FC } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Stack,
  Box,
  Button,
  ModalProps,
} from "@chakra-ui/react";

type ReportListModalProps = Omit<ModalProps, "children"> & {
  list: {
    label: string;
    total: number;
  }[];
  onDelete: () => void;
};

const ReportListModal: FC<ReportListModalProps> = ({
  isOpen,
  onClose,
  list = [],
  onDelete = () => {},
}) => {
  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="1rem" textTransform="uppercase">
          Report List
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack p={4} spacing={4}>
            {list.map(({ label, total }) => (
              <Stack
                key={label}
                w="100%"
                direction="row"
                justify="space-between"
              >
                <Box>{label}</Box>
                <Box>{total}</Box>
              </Stack>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button
            mr={3}
            bgGradient="linear-gradient(45deg, #BE73ED 0, #FFBC6C 100%)"
            color="white"
            fontSize="1rem"
            _hover={{
              bgGradient:
                "linear-gradient(45deg, #BE73ED 0, #BE73ED 10%, #FFBC6C 100%)",
            }}
            onClick={onDelete}
          >
            Delete Comment
          </Button>
          <Button
            variant="ghost"
            borderWidth="1px"
            borderColor="gray.300"
            onClick={onClose}
          >
            Ignore Report
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportListModal;
