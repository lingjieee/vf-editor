import cloneDeep from 'lodash/cloneDeep';
import global from '@/common/global';
import { BaseCommand, baseCommand } from '@/components/graph/command/base';
import { NodeModel } from '@/common/interface';

const copyCommand: BaseCommand = {
  ...baseCommand,

  canExecute(graph) {
    return !!this.getSelectedNodes(graph).length;
  },

  canUndo() {
    return false;
  },

  execute(graph) {
    const selectedNodes = this.getSelectedNodes(graph);

    global.clipboard.models = cloneDeep(selectedNodes.map(node => node.getModel() as NodeModel));
    console.log(global.clipboard.models)
  },

  shortcuts: ['mod+c'],
};

export default copyCommand;
