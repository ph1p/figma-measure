export interface TooltipSettings {
  position: string;
  width: boolean;
  height: boolean;
  fontFamily: boolean;
  fontStyle: boolean;
  fontSize: boolean;
  color: boolean;
  opacity: boolean;
  stroke: boolean;
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

export interface Store {
  labels: boolean;
  color: string;
  selection: any[];
  fill: 'dashed' | 'fill' | 'stroke' | 'fill-stroke';
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
