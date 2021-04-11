export enum Alignments {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CENTER = 'CENTER',
}

export interface SetTooltipOptions {
  flags: TooltipSettings;
  unit: string;
  offset: number;
  precision: number;
  multiplicator: number;
  position: TooltipPositions;
  vertical?: TooltipPositions;
  horizontal?: TooltipPositions;
  backgroundColor?: string;
  fontColor?: string;
  fontSize?: number;
}
export interface LineParameterTypes {
  left: number;
  top: number;
  node: SceneNode;
  direction: string;
  name: string;
  txtVerticalAlign: Alignments;
  txtHorizontalAlign: Alignments;
  lineVerticalAlign: Alignments;
  lineHorizontalAlign: Alignments;
  strokeCap: string;
  strokeOffset: number;
  unit: string;
  precision: number;
  multiplicator: number;
  color: string;
  labels: boolean;
  labelsOutside: boolean;
}
export interface TooltipSettings {
  width: boolean;
  height: boolean;
  fontName: boolean;
  fontSize: boolean;
  color: boolean;
  opacity: boolean;
  stroke: boolean;
  cornerRadius: boolean;
  points: boolean;
}

export interface PluginNodeData {
  version?: number;
  surrounding?: SurroundingSettings;
  connectedNodes?: string[];
  // strokeCap?: StrokeCap;
  // strokeOffset?: number;
  // unit?: string;
  // color?: string;
  // labels?: boolean;
  // labelsOutside?: boolean;
  // fill?: FillTypes;
  // opacity?: number;
  // tooltip: {
  //   flags: TooltipSettings;
  //   position: TooltipPositions;
  //   offset: number;
  // };
}

export interface SurroundingSettings {
  labels: boolean;
  topBar: boolean;
  leftBar: boolean;
  rightBar: boolean;
  bottomBar: boolean;
  horizontalBar: boolean;
  verticalBar: boolean;
  center: boolean;
  tooltip: TooltipPositions;
}

export type FillTypes = 'dashed' | 'fill' | 'stroke' | 'fill-stroke';

export enum TooltipPositions {
  TOP = 'TOP',
  LEFT = 'LEFT',
  BOTTOM = 'BOTTOM',
  RIGHT = 'RIGHT',
  NONE = '',
}

export interface MainMeasurements {
  labels: boolean;
  color: string;
  fill: FillTypes;
  opacity: number;
  strokeCap: StrokeCap | 'STANDARD';
  strokeOffset: number;
  surrounding: SurroundingSettings;
  tooltipOffset: number;
  tooltip: TooltipSettings;
  unit: string;
}

export interface Store {
  labelsOutside: boolean;
  labels: boolean;
  color: string;
  selection: unknown[];
  fill: FillTypes;
  opacity: number;
  unit: string;
  multiplicator: number;
  precision: number;
  strokeCap: StrokeCap | 'STANDARD';
  strokeOffset: number;
  surrounding: SurroundingSettings;
  tooltipOffset: number;
  tooltip: TooltipSettings;
  visibility: boolean;
}

export interface NodeSelection {
  id: string;
  type: NodeType;
  hasSpacing: boolean;
  data: unknown;
}
