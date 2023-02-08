import { FC, useEffect, useMemo, useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import {
  Heading,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
} from "@chakra-ui/react";
import { BsChevronRight } from "react-icons/bs";
import { object, boolean, array, string } from "yup";

import Layout from "@/components/Templates/Layout";
import LobbyForm from "@/components/Organisms/LobbyForm";
import HotspotConfig from "@/components/Organisms/HotspotConfig";

import { useAppDispatch } from "@/hooks";
import {
  useLobbyDetail,
  useLobbyUpdate,
  useHotspotUpdate,
} from "@/hooks/lobby";
import { useUploadFile, useUploadMultipleFile } from "@/hooks/upload";

import { RootState } from "@/states/store";
import { actions as lobbyActions } from "@/states/lobby/slice";

import {
  ILobbyInitialValues,
  LobbyDetail,
  SidebarMenu,
  HotspotType,
} from "@/types/lobby";
import { MediaFolderType } from "@/types/upload";

import { lobbyInitialValues } from "@/constants/form";
import {
  requiredString,
  requiredFile,
  decimalNumber,
  optionalFile,
} from "@/constants/validationSchema";
import withAuth from "@/utils/withAuth";

const getSidebarItem = (array: SidebarMenu[], fieldName: string) => {
  const item = array.find(({ name }) => name === fieldName);
  return {
    id: item?.id || "",
    isActive: item?.isActive || false,
  };
};

const formatToInitialValues = (values?: LobbyDetail): ILobbyInitialValues => {
  if (values) {
    return {
      lobbyBackground: values.getLobby.lobbyMedia,
      appId: values.getLobby.intercomAppId,
      verificationId: values.getLobby.intercomSecretVerificationId,
      showLobby: getSidebarItem(values.getLobby.sidebarMenus, "Lobby"),
      showAboutEvent: getSidebarItem(
        values.getLobby.sidebarMenus,
        "About Event"
      ),
      showFeed: getSidebarItem(values.getLobby.sidebarMenus, "Feed"),
      showAuditorium: getSidebarItem(
        values.getLobby.sidebarMenus,
        "Auditorium"
      ),
      showExhibitionHall: getSidebarItem(
        values.getLobby.sidebarMenus,
        "Exhibition Hall"
      ),
      showBreakoutRoom: getSidebarItem(
        values.getLobby.sidebarMenus,
        "Breakout Room"
      ),
      showRoundtable: getSidebarItem(
        values.getLobby.sidebarMenus,
        "Roundtable"
      ),
      showEventAgenda: getSidebarItem(
        values.getLobby.sidebarMenus,
        "Event Agenda"
      ),
      showSpeakers: getSidebarItem(values.getLobby.sidebarMenus, "Speakers"),
      showAttendees: getSidebarItem(values.getLobby.sidebarMenus, "Attendees"),
      showResourceCenter: getSidebarItem(
        values.getLobby.sidebarMenus,
        "Resource Center"
      ),
      showVOD: getSidebarItem(values.getLobby.sidebarMenus, "Video on Demand"),
      showSponsors: getSidebarItem(values.getLobby.sidebarMenus, "Sponsors"),
      showFeedback: getSidebarItem(values.getLobby.sidebarMenus, "Feedback"),
      showSocialWall: getSidebarItem(
        values.getLobby.sidebarMenus,
        "Social Wall"
      ),
      hotspots: Array.isArray(values.getLobby.hotspots)
        ? values.getLobby.hotspots.map(
            ({
              x,
              y,
              width,
              height,
              bannerMediaUrl,
              url,
              sequence,
              title,
              mimeType,
            }) => ({
              x,
              y,
              width,
              height,
              file: bannerMediaUrl,
              url,
              title,
              sequence,
              mimeType,
            })
          )
        : [],
      mimeType: values.getLobby.mimeType,
    };
  }

  return lobbyInitialValues;
};

const Lobby: FC = () => {
  const dispatch = useAppDispatch();
  const { activePage } = useSelector(
    (state: RootState) => ({
      activePage: state.lobby.activePage,
    }),
    shallowEqual
  );
  const {
    fetchLobbyDetail,
    // loading: isFetchingLobby,
    data: lobbyDetail,
  } = useLobbyDetail();

  const {
    updateLobbyDetail,
    // loading: isUpdatingLobby,
    // data: lobbyUpdateResponse,
  } = useLobbyUpdate();

  const {
    updateHotspots,
    // loading: isUpdatingHotspots,
    // data: hotspotsUpdateResponse,
  } = useHotspotUpdate();

  const { uploadFile } = useUploadFile();

  const {
    uploadMultipleFile,
    // data: multipleUploadResponse,
    // loading: isUploadingMultipleFile,
  } = useUploadMultipleFile();

  const initialValues = useMemo(() => {
    return formatToInitialValues(lobbyDetail);
  }, [lobbyDetail]);

  const validateForm = useCallback(() => {
    let validationSchema = {};

    if (activePage === "lobby") {
      const requiredSwitchValue = object().shape({
        id: requiredString,
        isActive: boolean(),
      });

      validationSchema = {
        lobbyBackground: requiredFile,
        appId: requiredString,
        verificationId: requiredString,
        showLobby: requiredSwitchValue,
        showAboutEvent: requiredSwitchValue,
        showFeed: requiredSwitchValue,
        showAuditorium: requiredSwitchValue,
        showExhibitionHall: requiredSwitchValue,
        showBreakoutRoom: requiredSwitchValue,
        showRoundtable: requiredSwitchValue,
        showEventAgenda: requiredSwitchValue,
        showSpeakers: requiredSwitchValue,
        showAttendees: requiredSwitchValue,
        showResourceCenter: requiredSwitchValue,
        showVOD: requiredSwitchValue,
        showSponsors: requiredSwitchValue,
        showFeedback: requiredSwitchValue,
        showSocialWall: requiredSwitchValue,
        mimeType: string(),
      };
    } else {
      const hotspotSchema = object().shape({
        x: decimalNumber,
        y: decimalNumber,
        width: decimalNumber,
        height: decimalNumber,
        file: optionalFile,
        title: requiredString,
        url: string().when("file", {
          is: (file: File | string) => !file,
          then: requiredString.url("Invalid URL"),
          otherwise: string().max(
            0,
            "URL must be empty if banner is specified"
          ),
        }),
        mimeType: string(),
        // sequence: requiredString,
      });

      validationSchema = {
        hotspots: array().of(hotspotSchema),
      };
    }

    return object(validationSchema);
  }, [activePage]);

  const submitForm = useCallback(
    async (values: ILobbyInitialValues) => {
      if (activePage === "lobby") {
        let lobbyMediaUrl = "";

        if (values.lobbyBackground instanceof File) {
          // NOTE: upload separately and save the URL
          const uploadResult = await uploadFile({
            variables: {
              uploadFilesInput: {
                file: values.lobbyBackground,
                folder: MediaFolderType.LOBBY,
              },
            },
          });

          lobbyMediaUrl = uploadResult.data?.uploadFile.url || "";
        } else {
          lobbyMediaUrl = values.lobbyBackground;
        }

        await updateLobbyDetail({
          variables: {
            setLobbyInput: {
              intercomAppId: values.appId,
              intercomSecretVerificationId: values.verificationId,
              lobbyMediaUrl,
              mimeType: values.mimeType,
              sidebarMenus: [
                values.showAboutEvent,
                values.showLobby,
                values.showAboutEvent,
                values.showFeed,
                values.showAuditorium,
                values.showExhibitionHall,
                values.showBreakoutRoom,
                values.showRoundtable,
                values.showEventAgenda,
                values.showSpeakers,
                values.showAttendees,
                values.showResourceCenter,
                values.showVOD,
                values.showSponsors,
                values.showFeedback,
                values.showSocialWall,
              ],
            },
          },
        });
      } else {
        // Hotspot config
        // Only upload hotspot's files
        const uploadedHotspots = values.hotspots
          .filter(({ file }) => file instanceof File)
          .map(({ file, sequence }) => ({ file: file as File, sequence }));

        // NOTE: upload separately and save the URL
        const uploadResult = await uploadMultipleFile({
          variables: {
            uploadFilesInput: {
              files: uploadedHotspots.map(({ file }) => file),
              folder: MediaFolderType.HOTSPOT,
            },
          },
        });

        let i = 0;

        const submittedHotspots = values.hotspots.map(
          ({ file, url, width, height, x, y, title, mimeType }, index) => {
            const returnValue = {
              sequence: index + 1,
              x,
              y,
              width,
              height,
              hotspotType: file ? HotspotType.BANNER : HotspotType.URL,
              bannerMediaUrl: file as string,
              url,
              title,
              mimeType,
            };

            if (uploadResult.data && file instanceof File) {
              return {
                ...returnValue,
                mimeType: file.type,
                bannerMediaUrl: uploadResult.data.uploadMultiFiles.urls[i++],
                hotspotType: HotspotType.BANNER,
              };
            }

            return returnValue;
          }
        );

        await updateHotspots({
          variables: {
            setHotspotInput: {
              hotspots: submittedHotspots,
            },
          },
        });
      }
    },
    [
      activePage,
      updateLobbyDetail,
      uploadFile,
      uploadMultipleFile,
      updateHotspots,
    ]
  );

  useEffect(() => {
    fetchLobbyDetail();
  }, [fetchLobbyDetail]);

  return (
    <Layout title="Lobby | ZodiacLive CMS">
      <VStack align="flex-start" minHeight="100vh" padding={["7", "10"]}>
        <Breadcrumb
          separator={
            <Box marginBottom="8" fontSize="md">
              <BsChevronRight />
            </Box>
          }
        >
          <BreadcrumbItem>
            {activePage === "hotspot" ? (
              <BreadcrumbLink
                href="#"
                onClick={() => dispatch(lobbyActions.toggleActivePage())}
              >
                <Heading as="h1" size="xl" marginBottom="8" color="gray.300">
                  Lobby
                </Heading>
              </BreadcrumbLink>
            ) : (
              <Heading as="h1" size="xl" marginBottom="8">
                Lobby
              </Heading>
            )}
          </BreadcrumbItem>
          {activePage === "hotspot" && (
            <BreadcrumbItem>
              <Heading as="h1" size="xl" marginBottom="8">
                Configure Hotspots
              </Heading>
            </BreadcrumbItem>
          )}
        </Breadcrumb>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validateForm}
          onSubmit={submitForm}
          component={(props) => {
            return activePage === "lobby" ? (
              <LobbyForm {...props} />
            ) : (
              <HotspotConfig {...props} />
            );
          }}
        />
      </VStack>
    </Layout>
  );
};

export default withAuth(Lobby);
