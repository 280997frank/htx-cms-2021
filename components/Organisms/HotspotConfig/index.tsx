import { FC, useMemo, useState, useEffect, useRef } from "react";
import { useSelectionContainer, Box as DragBox } from "react-drag-to-select";
import { useDrop } from "react-dnd";
import { Form, FormikProps, FieldArray } from "formik";
import {
  Stack,
  VStack,
  ButtonGroup,
  Button,
  Wrap,
  WrapItem,
  AspectRatio,
  Box,
  FormLabel,
  Text,
} from "@chakra-ui/react";

import Panel from "@/components/Molecules/Panel";
import HotspotBannerInput from "@/components/Molecules/HotspotBannerInput";
import AddAnother from "@/components/Atoms/AddAnother";
import Hotspot from "@/components/Atoms/Hotspot";

import { BG_GRADIENT } from "@/constants/ui";

import { ILobbyInitialValues, IHotspot, HotspotData } from "@/types/lobby";

const HOTSPOT = "HOTSPOT";

const blankHotspot = {
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  file: "",
  url: "",
  title: "",
  sequence: 0,
  mimeType: "",
};

const hotspotStyles = {
  backgroundColor: "rgba(54, 54, 54, 0.6)",
  borderRadius: "0.6rem",
};

const getRandomNumber = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

const HotspotConfig: FC<FormikProps<ILobbyInitialValues>> = ({
  isSubmitting,
  values,
  setFieldValue,
  resetForm,
}) => {
  const [fileUrl, setFileUrl] = useState("");
  const [isFirstRender, setFirstRenderStatus] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentHotspot = useRef<IHotspot>(blankHotspot);
  const [, dropRef] = useDrop<HotspotData, void, any>(
    () => ({
      accept: HOTSPOT,
      drop: (item, monitor) => {
        const hotspotArea = document.getElementById("hotspot-area");
        const delta = monitor.getDifferenceFromInitialOffset();

        if (delta && hotspotArea) {
          let left = item.x + (delta.x * 100) / hotspotArea.clientWidth;
          let top = item.y + (delta.y * 100) / hotspotArea.clientHeight;
          left = Number(left.toFixed(2));
          top = Number(top.toFixed(2));
          const newHotspots = [...values.hotspots];

          if (newHotspots[item.index]) {
            newHotspots[item.index].x = left < 0 ? 0 : left;
            newHotspots[item.index].y = top < 0 ? 0 : top;

            if (newHotspots[item.index].x + item.width > 100) {
              newHotspots[item.index].x = 100 - item.width;
            }

            if (newHotspots[item.index].y + item.height > 100) {
              newHotspots[item.index].y = 100 - item.height;
            }

            setFieldValue("hotspots", newHotspots);
          }
        }
      },
    }),
    [values.hotspots]
  );
  const { DragSelection } = useSelectionContainer({
    eventsElement: document.getElementById("hotspot-area"),
    selectionProps: {
      style: {
        ...hotspotStyles,
        border: "none",
      },
    },
    onSelectionChange: (e: DragBox) => {
      const hotspotArea = document.getElementById("hotspot-area");
      if (hotspotArea) {
        const x =
          ((e.left - hotspotArea.getBoundingClientRect().left) * 100) /
          hotspotArea.clientWidth;
        const y =
          ((e.top - hotspotArea.getBoundingClientRect().top) * 100) /
          hotspotArea.clientHeight;
        const height = (e.height * 100) / hotspotArea.clientHeight;
        const width = (e.width * 100) / hotspotArea.clientWidth;

        const updatedHotspot = {
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          height: Number(height.toFixed(2)),
          width: Number(width.toFixed(2)),
        };
        currentHotspot.current = {
          ...currentHotspot.current,
          ...updatedHotspot,
        };
      }
    },
    onSelectionEnd: () => {
      if (currentHotspot.current.height !== 0) {
        // Not just a click on the hotspot area, but a drag result
        const newHotspots = [...values.hotspots];
        currentHotspot.current.sequence = getRandomNumber(10, 100);
        newHotspots.push(currentHotspot.current);
        setFieldValue("hotspots", newHotspots);

        // reset ref value
        currentHotspot.current = blankHotspot;
      }
    },
  });
  const fileType = useMemo(() => {
    let result = "";
    if (typeof values.lobbyBackground === "string") {
      if (values.lobbyBackground.length) {
        result = "all";
      }
    } else if (values.lobbyBackground instanceof File) {
      [result] = values.lobbyBackground.type.split("/");
    }

    return result;
  }, [values.lobbyBackground]);

  const backgroundImage = () => {
    if (values.lobbyBackground instanceof File) {
      return `url("${fileUrl}")`;
    }

    if (values.lobbyBackground) {
      return `url("${values.lobbyBackground}")`;
    }

    return undefined;
  };

  useEffect(() => {
    if (values.lobbyBackground instanceof File) {
      setFileUrl(URL.createObjectURL(values.lobbyBackground));
    }
  }, [values.lobbyBackground]);

  useEffect(() => {
    if (fileUrl) {
      return () => {
        URL.revokeObjectURL(fileUrl);
      };
    }
  }, [fileUrl]);

  useEffect(() => {
    // A hack to trigger reinitialize of `useSelectionContainer`
    // with valid element as `eventsElement` param
    if (isFirstRender) {
      setFirstRenderStatus(false);
    }
  }, [isFirstRender]);

  return (
    <Form style={{ width: "100%" }}>
      <Stack direction={["column", "row"]} align="flex-start" spacing="10">
        <VStack spacing="6" w={["100%", "60%"]} align="flex-start">
          <FormLabel fontWeight="bold" textTransform="uppercase">
            Hotspot Area
          </FormLabel>
          <AspectRatio
            ratio={16 / 9}
            w="100%"
            css={{ marginTop: "0 !important" }}
          >
            <Box
              id="hotspot-area"
              ref={dropRef}
              css={{
                backgroundPositionY: "top",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% auto",
                backgroundImage: BG_GRADIENT,
              }}
              style={{
                backgroundImage: backgroundImage(),
              }}
            >
              {(fileType === "video" || fileType === "all") && (
                <video
                  ref={videoRef}
                  preload="metadata"
                  width="960"
                  height="540"
                  muted
                  autoPlay
                  loop
                  style={{
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: BG_GRADIENT,
                  }}
                  onError={() => {
                    if (videoRef.current) {
                      videoRef.current.style.display = "none";
                    }
                  }}
                >
                  <source
                    src={
                      values.lobbyBackground instanceof File
                        ? fileUrl
                        : values.lobbyBackground
                    }
                    type={
                      values.lobbyBackground instanceof File
                        ? values.lobbyBackground.type
                        : ""
                    }
                  />
                </video>
              )}
              {values.hotspots.map((props, index) => (
                <Hotspot
                  {...props}
                  key={props.sequence}
                  hotspotStyles={hotspotStyles}
                  index={index}
                  containerId="hotspot-area"
                  fieldName="hotspots"
                />
              ))}
              <DragSelection />
            </Box>
          </AspectRatio>
          <Text
            color="gray.500"
            css={{ marginTop: "var(--chakra-space-3) !important" }}
          >
            Click and drag over an area on the image/video above to define a
            hotspot area.
          </Text>
        </VStack>
        <VStack spacing="6" w={["100%", "40%"]}>
          <Panel label="Banners (Upload or Paste URL)">
            <Wrap spacing="8" justify="flex-start">
              <FieldArray
                name="hotspots"
                render={({ remove, push }) => {
                  const bannerInputs = values.hotspots.map(
                    ({ sequence }, index) => (
                      <WrapItem key={sequence}>
                        <Box w="13rem">
                          <HotspotBannerInput
                            index={index}
                            onRemove={() => remove(index)}
                          />
                        </Box>
                      </WrapItem>
                    )
                  );

                  return [
                    ...bannerInputs,
                    <WrapItem key="a">
                      <Box w="13rem">
                        <AddAnother
                          ratio={149}
                          onClick={() =>
                            push({
                              x: 44.5,
                              y: 44.5,
                              width: 15,
                              height: 15,
                              file: "",
                              url: "",
                              title: "",
                              sequence:
                                (values.hotspots
                                  .map(({ sequence }) => sequence)
                                  .sort((a, b) => a - b)
                                  .pop() ?? 0) + 1,
                              mimeType: "",
                            })
                          }
                        />
                      </Box>
                    </WrapItem>,
                  ];
                }}
              />
            </Wrap>
          </Panel>
        </VStack>
      </Stack>
      <ButtonGroup mt="8">
        <Button
          bgImage={BG_GRADIENT}
          color="white"
          isLoading={isSubmitting}
          type="submit"
        >
          Save Changes
        </Button>
        <Button
          variant="outline"
          color="gray.500"
          bg="white"
          onClick={() => resetForm()}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default HotspotConfig;
