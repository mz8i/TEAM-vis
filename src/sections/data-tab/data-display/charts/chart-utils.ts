export function isHovered(gkey: string, hoveredKey: string | null) {
  return hoveredKey != null ? hoveredKey === gkey : null;
}

export function isSelected(gkey: string, selectedKey: string | null) {
  return selectedKey != null ? selectedKey === gkey : null;
}

export function isFullOpacity(
  hovered: boolean | null,
  selected: boolean | null
) {
  return hovered != null ? hovered : selected != null ? selected : true;
}
