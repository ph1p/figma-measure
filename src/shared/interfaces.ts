export enum Alignments {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CENTER = 'CENTER',
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
  offset: number;
  unit: string;
  color: string;
  labels: boolean;
}
export interface TooltipSettings {
  width: boolean;
  height: boolean;
  fontFamily: boolean;
  fontStyle: boolean;
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
  tooltip: string;
}

export type FillTypes = 'dashed' | 'fill' | 'stroke' | 'fill-stroke';

export interface Store {
  labels: boolean;
  color: string;
  selection: any[];
  fill: FillTypes;
  dashDistance: number;
  unit: string;
  strokeCap: StrokeCap | 'STANDARD';
  strokeOffset: number;
  surrounding: SurroundingSettings;
  tooltip: TooltipSettings;
  setUnit(unit: string): void;
  setColor(color: string): void;
  setLabels(labels: boolean): void;
  toggleTooltipSetting(key: keyof TooltipSettings): void;
  setTooltipSettings(settings: any): void;
  setFill(fill: any): void;
  setDashDistance(distance: number): void;
  setStrokeCap(lineEnding: StrokeCap | 'STANDARD'): void;
  setStrokeOffset(offset: number): void;
  setSurrounding(surrounding: any): void;
  setSelection(selection?: any[]): void;
}
