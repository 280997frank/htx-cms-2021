import { NavItemProps } from "components/Atoms/NavItem";
// import {
//   AboutIcon,
//   AnalyticsIcon,
//   AttendeesIcon,
//   AuditoriumIcon,
//   BreakoutRoomsIcon,
//   CalendarIcon,
//   ExhibitionIcon,
//   FeedbackIcon,
//   FeedIcon,
//   HomeIcon,
//   LobbyIcon,
//   NotificationIcon,
//   ResourceCenterIcon,
//   RoundtableIcon,
//   SettingsIcon,
//   SocialWallIcon,
//   SpeakersIcon,
//   SponsorIcon,
//   VODIcon,
// } from "@/components/Atoms/Icons";

const menu: NavItemProps[] = [
  {
    label: "Manage Users",
    url: "/manage-users",
  },
  {
    label: "What's Up",
    url: "/whats-up",
  },
  {
    label: "In Profile",
    url: "/in-profile",
  },
  {
    label: "Congratulations",
    url: "/congrats",
  },
  {
    label: "Happy Birthday",
    url: "/happy-birthday",
  },
  {
    label: "Group Buy",
    url: "/group-buy",
  },
  {
    label: "X Marks The Spot",
    url: "/xmarks-the-spot",
  },
  {
    label: "Announcements",
    url: "/announcement",
  },
  {
    label: "Spotlight",
    url: "/spotlight",
    divider: true,
  },
  {
    label: "TechXchange",
    url: "/techxchange",
  },
  {
    label: "Event Highlights",
    url: "/event-highlights",
  },
  {
    label: "Feedback",
    url: "/feedback",
  },
  {
    label: "HLS Committee",
    url: "/hls-committee",
  },
  {
    label: "HTX Houses",
    url: "/htx-houses",
  },
  {
    label: "TechXplain",
    url: "/techxplain",
  },
  {
    label: "Analytics",
    url: "/analytics",
  },
];

export default menu;
