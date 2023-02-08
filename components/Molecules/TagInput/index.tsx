import React, { FC, useEffect, useMemo, useState, useRef } from "react";
import {
  InputGroup,
  InputLeftElement,
  Input,
  Wrap,
  WrapItem,
  FormControl,
  FormErrorMessage,
  List,
  ListItem,
} from "@chakra-ui/react";
import s from "shortid";
import Fuse from "fuse.js";
import { useField } from "formik";
import { SearchIcon, PlusIcon } from "@/components/Atoms/Icons";
import Tag from "@/components/Atoms/Tag";
import { useSettingPageList } from "@/hooks/setting";

interface TagInputProps {
  name: string;
  id: string;
  type: "INTEREST" | "INDUSTRY" | "TOPICS";
  label?: string;
  maxSuggestion?: number;
  description?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
}

const TagInput: FC<TagInputProps> = ({
  name,
  id,
  label,
  type,
  maxSuggestion = 5,
  ...props
}) => {
  const [{ value }, meta, { setValue }] = useField(name);
  const [searchText, setSearchText] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const tagInputRef = useRef<HTMLDivElement>(null);
  const { fetchSettingPageList, data } = useSettingPageList({
    filter: { type },
  });

  useEffect(() => {
    fetchSettingPageList();
  }, [fetchSettingPageList]);

  const filteredTagList = useMemo(() => {
    if (!data) return [];
    const tagList = data.listSettings.settings[0].tags;
    if (showAutocomplete && searchText === "") {
      return tagList
        .filter((_, index) => index < maxSuggestion)
        .map((item) => ({ item: item }));
    }
    const fuse = new Fuse(tagList, { keys: ["name"], includeMatches: true });
    return fuse.search(searchText).filter((_, index) => index < maxSuggestion);
  }, [data, searchText, showAutocomplete, maxSuggestion]);

  useEffect(() => {
    const onClickOutside = (e: any) => {
      if (!tagInputRef.current?.contains(e.target)) {
        setShowAutocomplete(false);
      }
    };

    if (showAutocomplete && tagInputRef.current) {
      document.addEventListener("mousedown", onClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [showAutocomplete]);

  return (
    <FormControl
      id={id}
      isInvalid={Boolean(meta.error && meta.touched)}
      ref={tagInputRef}
      {...props}
    >
      <InputGroup marginBottom="1">
        <InputLeftElement pointerEvents="none">
          <SearchIcon fill="url(#gradient)" boxSize="6" />
        </InputLeftElement>
        <Input
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setShowAutocomplete(true)}
          value={searchText}
          autoComplete="off"
          placeholder="Search"
        />
      </InputGroup>
      <List
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        position="absolute"
        backgroundColor="white"
        width="100%"
        zIndex="5"
        boxShadow="6px 5px 8px rgba(0,50,30,0.02)"
        display={showAutocomplete ? "block" : "none"}
      >
        {filteredTagList.map(({ item }: any) => {
          return (
            <ListItem
              key={s.generate()}
              cursor="pointer"
              px="2"
              py="1"
              _hover={{ bg: "gray.100" }}
              onClick={() => {
                if (Array.isArray(value)) {
                  setValue([...value, item.name]);
                } else {
                  setValue([item.name]);
                }
                setSearchText("");
                setShowAutocomplete(false);
              }}
            >
              {item.name}
            </ListItem>
          );
        })}
        {searchText.length > 2 && (
          <ListItem
            key={s.generate()}
            cursor="pointer"
            px="2"
            py="1"
            _hover={{ bg: "gray.100" }}
            onClick={() => {
              setValue([...value, searchText]);
              setSearchText("");
              setShowAutocomplete(false);
            }}
          >
            <PlusIcon /> <span>Create new tag</span>
          </ListItem>
        )}
      </List>
      <Wrap spacing="2" mt="2">
        {value &&
          value.map((item: string, index: number) => {
            return (
              <WrapItem key={s.generate()}>
                <Tag
                  label={item}
                  onClick={() => {
                    const tempValue = [...value];
                    tempValue.splice(index, 1);
                    setValue(tempValue);
                  }}
                />
              </WrapItem>
            );
          })}
      </Wrap>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default TagInput;
