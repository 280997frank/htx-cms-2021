import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
} from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { MdCheckCircle, MdAddCircle } from "react-icons/md";
import Tag from "@/components/Atoms/Tag";
import { RiSearchLine } from "react-icons/ri";
import { TInput } from "@/types/setting";
import { useUpsertTags } from "@/hooks/setting";
import s from "shortid";

export interface Option {
  id: string;
  name: string;
}

export interface AutocompleteProps {
  options: Option[];
  values: Option[];
  setValue: (options: Option[]) => void;
  renderCheckIcon?: React.ReactNode;
  renderCreateIcon?: React.ReactNode;
  customIcon?: React.ReactNode;
  placeholder?: string;
  inputName?: string;
  inputId?: string;
  bgHoverColor?: string;
  createText?: string;
  allowCreation?: boolean;
  notFoundText?: string;
  isInvalid?: boolean;
  settingId?: string;
}

export const TagInputAutocomplete = ({
  options,
  setValue,
  values,
  placeholder,
  inputName,
  inputId,
  bgHoverColor,
  createText,
  allowCreation,
  notFoundText,
  isInvalid,
  customIcon,
  settingId,
  ...props
}: AutocompleteProps) => {
  const [optionsCopy, setOptionsCopy] = useState<Option[]>(options);
  const [partialResult, setPartialResult] = useState<Option[]>();
  const [displayOptions, setDisplayOptions] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutationUpsertTags, data: settingData } = useUpsertTags();

  const filterOptions = (inputValue: string) => {
    if (inputValue) {
      setDisplayOptions(true);
      setPartialResult(
        matchSorter(optionsCopy, inputValue, { keys: ["name"] })
      );
      setInputValue(inputValue);
    } else {
      setDisplayOptions(false);
    }
  };

  useEffect(() => {
    if (optionsCopy.length === 0) {
      setOptionsCopy(options);
    }
  }, [options, optionsCopy.length]);

  const selectOption = (option: Option) => {
    if (values.includes(option)) {
      setValue([
        ...values.filter(
          (existingOption) => existingOption.name !== option.name
        ),
      ]);
    } else {
      setValue([option, ...values]);
    }
  };

  const isOptionSelected = (option: Option) => {
    return (
      values.filter((selectedOption) => selectedOption.name === option.name)
        .length > 0
    );
  };

  const selectOptionFromList = (option: Option) => {
    selectOption(option);
    setDisplayOptions(false);
    if (inputRef && inputRef.current !== null) {
      inputRef.current.value = "";
    }
  };

  const renderCheckIcon = (option: Option) => {
    if (isOptionSelected(option)) {
      if (props.renderCheckIcon) {
        return props.renderCheckIcon;
      } else {
        return <MdCheckCircle color="green.500" />;
      }
    }
    return null;
  };

  const renderCreateIcon = () => {
    if (props.renderCreateIcon) {
      return props.renderCreateIcon;
    } else {
      return <MdAddCircle color="green.500" />;
    }
  };

  const upsertTags = () => {
    if (settingId !== undefined && inputValue) {
      mutationUpsertTags({
        variables: {
          upsertTagsInput: {
            id: "",
            settingId: settingId,
            name: inputValue,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (settingData !== undefined && settingData !== null && inputValue) {
      const newOption: TInput = {
        id: settingData.upsertTags.id,
        name: inputValue,
      };
      setOptionsCopy([newOption, ...optionsCopy]);
      selectOption(newOption);
      setDisplayOptions(false);
      if (inputRef && inputRef.current !== null) {
        inputRef.current.value = "";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingData]);

  const createOption = () => {
    if (inputValue && allowCreation) {
      const newOption: TInput = {
        id: s.generate(),
        name: inputValue,
      };
      setOptionsCopy([newOption, ...optionsCopy]);
      selectOption(newOption);
      setDisplayOptions(false);
      if (inputRef && inputRef.current !== null) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <Box width="100%" data-testid="simple-autocomplete" position="relative">
      <FormControl>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.300"
            fontSize="1.2em"
          >
            {customIcon !== null ? (
              customIcon
            ) : (
              <RiSearchLine style={{ fill: "url(#lgrad)" }} />
            )}
          </InputLeftElement>
          <Input
            name={inputName}
            id={inputId}
            placeholder={placeholder}
            onChange={(e) => filterOptions(e.currentTarget.value)}
            ref={inputRef}
            isInvalid={isInvalid}
          />
        </InputGroup>
      </FormControl>
      {displayOptions && (
        <List
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          position="absolute"
          backgroundColor="white"
          width="100%"
          zIndex="5"
          boxShadow="6px 5px 8px rgba(0,50,30,0.02)"
          mt={2}
        >
          {partialResult?.map((option) => {
            return (
              <ListItem
                key={option.name}
                _hover={{ bg: bgHoverColor || "gray.100" }}
                my={1}
                p={2}
                cursor="pointer"
                onClick={() => selectOptionFromList(option)}
              >
                <Flex align="center">
                  {renderCheckIcon(option)}
                  {option.name}
                </Flex>
              </ListItem>
            );
          })}
          {!partialResult?.length && allowCreation && (
            <ListItem
              _hover={{ bg: bgHoverColor || "gray.100" }}
              my={1}
              p={2}
              cursor="pointer"
              data-testid="create-option"
              onClick={() => {
                settingId !== null && upsertTags();
                settingId === null && createOption();
              }}
            >
              <Flex align="center">
                {renderCreateIcon()}
                {createText}
              </Flex>
            </ListItem>
          )}
          {!partialResult?.length && !allowCreation && (
            <ListItem my={1} p={2} data-testid="not-found">
              <Flex align="center">{notFoundText}</Flex>
            </ListItem>
          )}
        </List>
      )}
      {values.length > 0 && (
        <Box my={2}>
          {values.map((option, index) => (
            <Tag
              key={index}
              label={option.name}
              onClick={() => selectOption(option)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

TagInputAutocomplete.defaultProps = {
  notFoundText: "Not found",
  allowCreation: true,
  createText: "Create option",
  customIcon: null,
  settingId: null,
};
