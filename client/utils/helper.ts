import { RgbaColor } from "react-colorful";

export const getRgbaColor = (color: RgbaColor): string => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${
    typeof color.a === "undefined" ? 1 : color.a
  })`;
};

export const observeFieldResize = (
  field,
  fullWidth: number,
  fontSize: number
) => {
  new ResizeObserver(() => {
    if (!field) return;
    field.style.fontSize = (field.clientWidth / fullWidth) * fontSize + "px";
  }).observe(field);
};
