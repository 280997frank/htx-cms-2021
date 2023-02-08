import React, { FC, useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Button,
  MenuOptionGroup,
  // MenuItemOption,
  MenuDivider,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { IoFilterSharp } from "react-icons/io5";
import { BG_GRADIENT } from "@/constants/ui";
interface DropdownFilterOption {
  label: string;
  value: string;
}

interface TDropdownFilterArray {
  options: DropdownFilterOption[];
  isSelected: string[];
  setSelected: (e: string[]) => void;
}

const DropdownFilterArray: FC<TDropdownFilterArray> = ({
  options,
  setSelected,
  isSelected,
}) => {
  const [isCheckAll, setIsCheckAll] = useState(false);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setSelected(options.map((li) => li.value));
    if (isCheckAll) {
      setSelected([]);
    }
  };

  const handleSelect = (e: any, data: DropdownFilterOption) => {
    const { checked, value } = e.target;
    const newValue = value;
    setSelected([...isSelected, data.value]);
    if (!checked) {
      setSelected(isSelected.filter((value) => value !== newValue));
    }
  };
  useEffect(() => {
    if (isSelected.length === options.length) {
      setIsCheckAll(true);
    } else {
      setIsCheckAll(false);
    }
  }, [isSelected, options]);
  // console.log("ini", isCheck);
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        padding="0rem 4rem"
        as={Button}
        colorScheme={BG_GRADIENT}
        bg={BG_GRADIENT}
        leftIcon={<IoFilterSharp style={{ fill: "white" }} />}
      >
        Filter
      </MenuButton>
      <MenuList>
        <MenuOptionGroup type="checkbox">
          <Checkbox
            pl={5}
            isChecked={isCheckAll}
            onChange={(e) => {
              handleSelectAll();
            }}
          >
            All
          </Checkbox>
          <MenuDivider />
          <Stack mt={1} spacing={1}>
            {options.map((data, index) => (
              <Checkbox
                key={index}
                pl={5}
                value={data.value}
                isChecked={isSelected.includes(data.value)}
                onChange={(e) => {
                  handleSelect(e, data);
                }}
              >
                {data.label}
              </Checkbox>
            ))}
          </Stack>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuItem
          color="gray.300"
          onClick={() => {
            setIsCheckAll(false);
            setSelected([]);
          }}
        >
          Clear Filter
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default DropdownFilterArray;
