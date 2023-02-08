import { FC } from "react";
import { List, Box } from "@chakra-ui/react";
import s from "shortid";

import NavItem, { NavItemProps } from "@/components/Atoms/NavItem";
import { UseSuperAdmin } from "@/utils";

type NavbarProps = {
  menu: NavItemProps[];
};

const Navbar: FC<NavbarProps> = ({ menu }) => {
  const isSuperAdmin = UseSuperAdmin();
  return (
    <Box>
      <List>
        {menu.map((item: NavItemProps) => {
          if (isSuperAdmin) {
            return <NavItem key={s.generate()} {...item} />;
          } else {
            if (item.url !== "/manage-users") {
              return <NavItem key={s.generate()} {...item} />;
            }
          }
        })}
      </List>
    </Box>
  );
};

export default Navbar;
