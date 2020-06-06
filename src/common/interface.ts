import {Graph as IGraph, TreeGraph as ITreeGraph} from '@antv/g6';
import {
  GraphOptions as IGraphOptions,
  IG6GraphEvent,
  Modes as IModes,
  NodeConfig,
  EdgeConfig,
  BehaviorOption as IBehaviorOption,
  GraphData as IGraphData, IPoint,
  ShapeStyle as IShapeStyle,
} from "@antv/g6/lib/types";
import {IEdge, INode} from "@antv/g6/lib/interface/item";
import IGGroup from '@antv/g-canvas/lib/group';
import {ShapeOptions as IShapeOptions} from '@antv/g6/lib/interface/shape';
import { IShape as IGShape } from '@antv/g-canvas/lib/interfaces';
import {
  GraphCanvasEvent,
  GraphCommonEvent,
  GraphCustomEvent,
  GraphEdgeEvent,
  GraphNodeEvent, GraphState,
  LabelState
} from "@/common/constants";

export interface GShape extends IGShape {}
export interface GGroup extends IGGroup {}

export interface Graph extends IGraph {}
export interface TreeGraph extends ITreeGraph{}

export interface GraphOptions extends IGraphOptions{}
export interface CustomShape extends IShapeOptions {}
export interface CustomNode extends CustomShape {}
export interface CustomEdge extends CustomShape {}

export interface Modes extends IModes{}
export interface GraphEvent extends IG6GraphEvent{}
export interface NodeModel extends NodeConfig{}
export interface EdgeModel extends EdgeConfig {}
export interface FlowData extends IGraphData{}

export type Item = Node | Edge;
export interface Node extends INode {}
export interface Edge extends IEdge {}

export interface AnchorPoint extends IPoint {
  index: number;
}

export interface ShapeStyle extends IShapeStyle {}

export interface Behavior extends IBehaviorOption {
  graph?: Graph;
  graphMode?: string;
  [propName: string]: any;
}

export interface Command<P = object, G = Graph> {
  name: string;
  params: P;
  canExecute: (graph:G) => boolean;
  shouldExecute: (graph:G) => boolean;
  canUndo: (graph:G) => boolean;
  init: (graph:G) => void;
  execute: (graph:G) => void;
  undo: (graph:G) => void;
  shortcuts: string[];
}

export interface CommandEvent {
  name: string,
  params?: object
}

export interface LabelStateEvent {
  labelState: LabelState;
}

export interface GraphStateEvent {
  graphState: GraphState;
}

export type GraphNativeEvent = GraphCommonEvent | GraphNodeEvent | GraphEdgeEvent | GraphCanvasEvent | GraphCustomEvent;

export type GraphReactEvent =
  | keyof typeof GraphCommonEvent
  | keyof typeof GraphNodeEvent
  | keyof typeof GraphEdgeEvent
  | keyof typeof GraphCanvasEvent
  | keyof typeof GraphCustomEvent;

export type GraphReactEventProps = Record<GraphReactEvent, (e: any) => void>;