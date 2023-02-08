import { FC } from "react";
import {
  HomeIcon,
  AuditoriumIcon,
  AttendeesIcon,
  AnalyticsIcon,
  AboutIcon,
  FeedIcon,
  RoundtableIcon,
  VODIcon,
  SponsorIcon,
  SpeakersIcon,
  SocialWallIcon,
  SettingsIcon,
  LobbyIcon,
} from "components/Atoms/Icons";
import Layout from "components/Templates/Layout";

const Example: FC = () => {
  return (
    <Layout title="cuy">
      <main>
        <HomeIcon withGradient color="red" boxSize={10} />
        <AuditoriumIcon color="black" boxSize={10} />
        <AttendeesIcon boxSize={10} />
        <AnalyticsIcon boxSize={10} />
        <AboutIcon boxSize={10} />
        <FeedIcon boxSize={10} />
        <RoundtableIcon boxSize={10} />
        <VODIcon boxSize={10} />
        <SponsorIcon boxSize={10} />
        <SpeakersIcon boxSize={10} />
        <SocialWallIcon boxSize={10} />
        <SettingsIcon boxSize={10} />
        <LobbyIcon boxSize={10} />
      </main>
    </Layout>
  );
};

export default Example;
