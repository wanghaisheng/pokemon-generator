import React from "react";
import { useWatch } from "react-hook-form";
import { Group } from "react-konva";
import ImageCanvas from "~components/Card/ImageCanvas";

const EvolutionImage = ({
  control,
  updateImgPos,
  isSelected,
  onSelect,
  updateScale,
}) => {
  const [evolvePicture, evolvePictureX, evolvePictureY] = useWatch({
    control,
    name: ["evolvePicture", "evolvePictureX", "evolvePictureY"],
  });

  if (!Boolean(evolvePicture)) return null;

  return (
    <Group
      width={66}
      height={60}
      y={55}
      x={43}
      onMouseEnter={(e) => {
        const container = e.target.getStage().container();
        container.style.cursor = "move";
      }}
      onMouseLeave={(e) => {
        const container = e.target.getStage().container();
        container.style.cursor = "default";
      }}
    >
      <ImageCanvas
        isTransformable
        isSelected={isSelected}
        src={evolvePicture}
        y={evolvePictureY}
        x={evolvePictureX}
        onSelect={onSelect}
        maxWidth={61}
        maxHeight={53}
        name="evolvePicture"
        onDragEnd={updateImgPos}
        onTransformEnd={updateScale}
        draggable
        prefixPath=""
        clipWidth={61}
        clipHeight={53}
        clipY={0}
        clipX={0}
      />
    </Group>
  );
};

export default EvolutionImage;
