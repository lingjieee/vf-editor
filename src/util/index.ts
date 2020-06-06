/** 获取图表状态 */
import {EditorEvent, GraphState, ItemState, ItemType} from "@/common/constants";
import {Edge, EdgeModel, Graph, Item, Node} from "@/common/interface";
import { v4 as uuid } from 'uuid';

/** 生成唯一标识 */
export function guid() {
  return uuid();
}

export function getGraphState(graph: Graph): GraphState {
  let graphState: GraphState = GraphState.MultiSelected;

  const selectedNodes = getSelectedNodes(graph);
  const selectedEdges = getSelectedEdges(graph);

  if (selectedNodes.length === 1 && !selectedEdges.length) {
    graphState = GraphState.NodeSelected;
  }

  if (selectedEdges.length === 1 && !selectedNodes.length) {
    graphState = GraphState.EdgeSelected;
  }

  if (!selectedNodes.length && !selectedEdges.length) {
    graphState = GraphState.CanvasSelected;
  }

  return graphState;
}

/** 获取选中节点 */
export function getSelectedNodes(graph: Graph): Node[] {
  return graph.findAllByState(ItemType.Node, ItemState.Selected);
}

/** 获取选中边线 */
export function getSelectedEdges(graph: Graph): Edge[] {
  return graph.findAllByState(ItemType.Edge, ItemState.Selected);
}

export function isEdge(item: Item) {
  return item.getType() === ItemType.Edge;
}

/** 清除选中状态 */
export function clearSelectedState(graph: Graph, shouldUpdate: (item: Item) => boolean = () => true) {
  const selectedNodes = getSelectedNodes(graph);
  const selectedEdges = getSelectedEdges(graph);

  executeBatch(graph, () => {
    [...selectedNodes, ...selectedEdges].forEach(item => {
      if (shouldUpdate(item)) {
        graph.setItemState(item, ItemState.Selected, false);
      }
    });
  });
}

/** 执行批量处理 */
export function executeBatch(graph: Graph, execute: Function) {
  const autoPaint = graph.get('autoPaint');

  graph.setAutoPaint(false);

  execute();

  graph.paint();
  graph.setAutoPaint(autoPaint);
}

/** 获取回溯路径 - Flow */
export function getFlowRecallEdges(graph: Graph, node: Node, targetIds: string[] = [], edges: Edge[] = []) {
  const inEdges: Edge[] = node.getInEdges();

  if (!inEdges.length) {
    return [];
  }

  inEdges.map(edge => {
    const sourceId = (edge.getModel() as EdgeModel).source;
    const sourceNode = graph.findById(sourceId) as Node;

    edges.push(edge);

    const targetId = node.get('id');

    targetIds.push(targetId);

    if (!targetIds.includes(sourceId)) {
      getFlowRecallEdges(graph, sourceNode, targetIds, edges);
    }
  });

  return edges;
}

/** 设置选中元素 */
export function setSelectedItems(graph: Graph, items: Item[] | string[]) {
  executeBatch(graph, () => {
    const selectedNodes = getSelectedNodes(graph);
    const selectedEdges = getSelectedEdges(graph);

    [...selectedNodes, ...selectedEdges].forEach(node => {
      graph.setItemState(node, ItemState.Selected, false);
    });

    items.forEach(item => {
      graph.setItemState(item, ItemState.Selected, true);
    });
  });

  graph.emit(EditorEvent.onGraphStateChange, {
    graphState: getGraphState(graph),
  });
}