import {Command, Graph} from "@/common/interface";
import cloneDeep from 'lodash/cloneDeep';
import {EditorEvent} from "@/common/constants";
import {getGraphState} from "@/util";

class CommandManager {
  command: Record<string, Command> = {}
  commandQueue: Command[] = [];
  commandIndex: number = 0;

  register = (name:string, command: Command) => {
    this.command[name] = {
      ...command,
      name
    }
  }

  execute = (graph: Graph, name: string, params?: object) => {
    const Command = this.command[name];
    if(!Command){
      return;
    }
    const command:Command = Object.create(Command);
    command.params = {
      ...cloneDeep(Command.params),
      ...(params||{})
    };

    if(!command.canExecute(graph) || !command.shouldExecute(graph)){
      return;
    }

    command.init(graph);

    graph.emit(EditorEvent.onBeforeExecuteCommand, {
      name: command.name,
      params: command.params
    });

    command.execute(graph);

    graph.emit(EditorEvent.onAfterExecuteCommand, {
      name: command.name,
      params: command.params
    });

    if(command.canUndo(graph)){
      const {commandQueue, commandIndex} = this;
      commandQueue.splice(commandIndex, commandQueue.length - commandIndex, command);
      this.commandIndex+=1;
    }

    graph.emit(EditorEvent.onGraphStateChange, {
      graphState: getGraphState(graph),
    })
  }

  canExecute(graph: Graph, name:string):boolean {
    return this.command[name]?.canExecute(graph);
  }
}

export default CommandManager;