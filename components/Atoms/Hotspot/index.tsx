import { FC } from "react";
import { Text, Center } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { Resizable } from "re-resizable";
import { useField } from "formik";

import { IHotspot, HotspotData } from "@/types/lobby";

interface HotspotProps {
  hotspotStyles: Record<string, string>;
  x: number;
  y: number;
  height: number;
  width: number;
  index: number;
  containerId: string;
  fieldName: string;
}

interface CollectedData {
  opacity: number;
}

const formatToPercentage = (n: number) => {
  return n.toFixed(2) + "%";
};

const HOTSPOT = "HOTSPOT";

const Hotspot: FC<HotspotProps> = ({
  hotspotStyles,
  x,
  y,
  height,
  width,
  index,
  containerId,
  fieldName,
}) => {
  const [{ value }, , { setValue }] = useField<IHotspot[]>(fieldName);
  const [{ opacity }, dragRef] = useDrag<HotspotData, unknown, CollectedData>(
    () => ({
      type: HOTSPOT,
      item: {
        index,
        x,
        y,
        height,
        width,
      },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    [index, x, y, height, width]
  );

  return (
    <Resizable
      data-draggable={true}
      bounds={document.getElementById(containerId) as HTMLElement}
      style={{
        // ...hotspotStyles,
        position: "absolute",
        left: formatToPercentage(x),
        top: formatToPercentage(y),
        opacity,
        cursor: "move",
      }}
      size={{
        height: formatToPercentage(height),
        width: formatToPercentage(width),
      }}
      onResizeStop={(e, direction, ref, d) => {
        const hotspotArea = document.getElementById(containerId);
        const newHotspots = [...value];

        if (newHotspots[index] && hotspotArea) {
          const width =
            newHotspots[index].width +
            (d.width * 100) / hotspotArea.clientWidth;
          const height =
            newHotspots[index].height +
            (d.height * 100) / hotspotArea.clientHeight;

          newHotspots[index].width = Number(width.toFixed(2));
          newHotspots[index].height = Number(height.toFixed(2));

          setValue(newHotspots);
        }
      }}
    >
      <Center ref={dragRef} h="100%">
        <Center
          css={{
            ...hotspotStyles,
            height: "100%",
            width: "100%",
          }}
        >
          <Text color="white" fontWeight="500">
            {index + 1}
          </Text>
        </Center>
      </Center>
    </Resizable>
  );
};

export default Hotspot;
