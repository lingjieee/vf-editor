import { Command } from '@/common/interface';
import CommandManager from '@/common/command-manager';

const undoCommand: Command = {
  name: 'undo',

  params: {},

  canExecute(graph) {
    const commandManager: CommandManager = graph.get('commandManager');
    const { commandIndex } = commandManager;

    return commandIndex > 0;
  },

  shouldExecute() {
    return true;
  },

  canUndo() {
    return false;
  },

  init() {},

  execute(graph) {
    const commandManager: CommandManager = graph.get('commandManager');
    const { commandQueue, commandIndex } = commandManager;

    commandQueue[commandIndex - 1].undo(graph);

    commandManager.commandIndex -= 1;
  },

  undo() {},

  shortcuts: ['mod+z'],
};

export default undoCommand;
