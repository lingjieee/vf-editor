import G6 from '@antv/g6';
import {CustomNode, Item} from "@/common/interface";
import {setAnchorPointsState} from "@/shape/common/anchor";

const taskNode: CustomNode = {

  afterSetState(name: string, value: string|boolean, item:Item){
    setAnchorPointsState.call(this, name, value, item);
  },

  getAnchorPoints() {
    return[
      [0.5, 0],
      [1, 0.5],
      [0.5, 1],
      [0, 0.5],
    ]
  }
}
G6.registerNode('task-node', taskNode, 'base-node');