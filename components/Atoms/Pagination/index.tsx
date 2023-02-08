import { Button, Flex, Grid, Input } from "@chakra-ui/react";
import React, { ChangeEventHandler, FC, MouseEventHandler } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface PaginationProps {
  onPrevClick: MouseEventHandler<HTMLButtonElement>;
  onNextClick: MouseEventHandler<HTMLButtonElement>;
  total: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  currentPage?: number;
}

const Pagination: FC<PaginationProps> = ({
  onPrevClick,
  onNextClick,
  total,
  onChange,
  currentPage,
  ...props
}) => {
  return (
    <Flex width="100%" justifyContent="flex-end" mt="15px">
      <Grid
        templateColumns="repeat(4, 1fr)"
        gap={1}
        justifyItems="center"
        alignItems="center"
      >
        <Button
          bg="transparent"
          _focus={{ border: "none" }}
          size="xs"
          onClick={onPrevClick}
        >
          <BsChevronLeft />
        </Button>
        <div style={{ width: "3rem" }}>
          <Input
            size="xs"
            value={currentPage === undefined ? 1 : currentPage}
            name="page"
            _focus={{ border: "1px solid #5C068C" }}
            textAlign="center"
            borderRadius="5px"
            onChange={onChange}
          />
        </div>
        <span>of {total}</span>
        <Button
          bg="transparent"
          _focus={{ border: "none" }}
          size="xs"
          onClick={onNextClick}
        >
          <BsChevronRight />
        </Button>
      </Grid>
    </Flex>
  );
};

export default Pagination;
