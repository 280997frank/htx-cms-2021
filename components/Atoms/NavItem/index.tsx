import { FC, useState, useMemo } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import {
  List,
  ListItem,
  Link,
  Divider,
  Text,
  LinkProps,
} from "@chakra-ui/react";
import s from "shortid";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ZLIconType,
} from "@/components/Atoms/Icons";
import { BG_GRADIENT } from "../../../constants/ui";
export type TNavItem = {
  url: string;
  label: string;
  icon?: ZLIconType | null;
  divider?: boolean;
};

export type NavItemProps = TNavItem & {
  submenu?: TNavItem[];
};

type NavLinkProps = LinkProps & {
  label: string;
  url: string;
  isActive: boolean;
  icon: ZLIconType | null | undefined;
};
const NavLink: FC<NavLinkProps> = ({
  label,
  url,
  icon,
  isActive,
  ...props
}) => {
  const Icon = icon;
  return (
    <NextLink passHref href={url}>
      <Link
        {...props}
        _hover={{ textDecoration: "none" }}
        _focus={{ outline: "0" }}
        textDecoration="none"
        display="flex"
        alignItems="center"
        userSelect="none"
        fontWeight="bold"
        fontSize="sm"
      >
        {!isNil(Icon) && (
          <Icon
            marginRight="2"
            fill={isActive ? "url(#gradient)" : props.color}
            boxSize={5}
          />
        )}
        <Text as="span">{label}</Text>
      </Link>
    </NextLink>
  );
};

const NavItem: FC<NavItemProps> = ({ url, label, icon, submenu, divider }) => {
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();

  const isMatch = (url: string | string[], path: string) => {
    if (isArray(url)) {
      return !isEmpty(
        url.filter((item) => new RegExp(`^${item}`, "m").test(path))
      );
    } else {
      return new RegExp(`^${url}`, "m").test(path);
    }
  };

  const isActiveParent = useMemo(() => {
    if (isOpen) return true;

    if (submenu) {
      const urls = submenu.map((item) => item.url);
      return isMatch(urls, router.pathname);
    }

    return false;
  }, [submenu, isOpen, router.pathname]);

  return (
    <ListItem marginBottom="4">
      {!isNil(submenu) ? (
        <>
          <Link
            position="relative"
            display="flex"
            alignItems="center"
            fontWeight="bold"
            color={isActiveParent ? "#fff" : "#5E5E5D"}
            fontSize="sm"
            userSelect="none"
            marginBottom="4"
            onClick={() => setOpen(!isOpen)}
            _hover={{ textDecoration: "none" }}
          >
            <>
              <Text as="span">{label}</Text>
              {isActiveParent ? (
                <ArrowUpIcon position="absolute" right="0" boxSize={4} />
              ) : (
                <ArrowDownIcon position="absolute" right="0" boxSize={4} />
              )}
            </>
          </Link>
          <List
            marginLeft="3"
            hidden={!isActiveParent}
            marginBottom={divider ? "4" : "0"}
          >
            {submenu.map((submenuItem) => (
              <ListItem marginBottom="4" key={s.generate()}>
                <NavLink
                  isActive={isMatch(submenuItem.url, router.pathname)}
                  color={isActiveParent ? "white" : "#363636"}
                  url={submenuItem.url}
                  label={submenuItem.label}
                  icon={submenuItem.icon}
                />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <NavLink
          marginBottom={divider ? "2rem" : "0"}
          isActive={isMatch(url, router.pathname)}
          color={isMatch(url, router.pathname) ? "white" : "#363636"}
          url={url}
          label={label}
          icon={icon}
          background={
            isMatch(url, router.pathname) ? BG_GRADIENT : "transparent"
          }
          p="2"
          borderRadius="full"
        />
      )}
      {/* {divider && <Divider borderColor="#D7D7D7" />} */}
    </ListItem>
  );
};

export default NavItem;
