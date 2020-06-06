import { Command } from '@/common/interface';
import CommandManager from '@/common/command-manager';

const redoCommand: Command = {
  name: 'redo',

  params: {},

  canExecute(graph) {
    const commandManager: CommandManager = graph.get('commandManager');
    const { commandQueue, commandIndex } = commandManager;

    return commandIndex < commandQueue.length;
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

    commandQueue[commandIndex].execute(graph);

    commandManager.commandIndex += 1;
  },

  undo() {},

  shortcuts: [ 'mod+shift+z' ],
};

export default redoCommand;
