import { ComponentType, Component as ReactComponent } from "react";
import router from "next/router";
import { Center } from "@chakra-ui/react";

import { getAccessToken } from "@/utils";

interface AuthState {
  isCheckingLoginStatus: boolean;
  isLoggedIn: boolean;
}

const withAuth = <P extends object>(Component: ComponentType<P>) => {
  return class CheckAuth extends ReactComponent<{}, AuthState> {
    constructor(props: any) {
      super(props);
      this.state = {
        isCheckingLoginStatus: true,
        isLoggedIn: false,
      };
    }

    componentDidMount() {
      const token = getAccessToken();

      if (token.length > 0) {
        this.setState({
          isLoggedIn: true,
          isCheckingLoginStatus: false,
        });
      } else {
        this.setState({
          isLoggedIn: false,
          isCheckingLoginStatus: false,
        });
        router.push("/");
      }
    }

    renderContent() {
      const { isLoggedIn, isCheckingLoginStatus } = this.state;

      if (isCheckingLoginStatus) {
        return <Center h="100vh">Loading ......</Center>;
      }

      if (isLoggedIn) {
        return <Component {...(this.props as P)} />;
      }

      return null;
    }

    render() {
      return this.renderContent();
    }
  };
};
export default withAuth;
