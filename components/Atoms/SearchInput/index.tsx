import React, { ChangeEventHandler, FC } from "react";
import { DebounceInput } from "react-debounce-input";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  InputProps,
} from "@chakra-ui/react";
import { RiSearchLine as SearchIcon } from "react-icons/ri";

const SearchInput: FC<InputProps> = ({ onChange, ...props }) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
        <Icon as={SearchIcon} fill="url(#gradPurple)" boxSize={6} />
      </InputLeftElement>
      <Input
        as={DebounceInput}
        onChange={onChange}
        placeholder="Search"
        // @ts-ignore
        debounceTimeout={300}
        {...props}
      />
    </InputGroup>
  );
};

export default SearchInput;
