import React, {FunctionComponent, useEffect, useState} from 'react';
import classNames from 'classnames';
import {useEditorContext} from "@/components/context/editor-context";
import CommandManager from "@/common/command-manager";
import {EditorEvent} from "@/common/constants";

interface CommandProps {
  name: string;
  className?: string;
  disabledClassName?: string;
}


const Command: FunctionComponent<CommandProps> = (props) => {
  const {
    name,
    className = 'command',
    disabledClassName = 'command-disabled'
  } = props;
  const [disabled, setDisabled] = useState(false);
  let {graph, executeCommand} = useEditorContext();
  useEffect(()=>{
    if(graph){
      const commandManager: CommandManager = graph.get('commandManager');
      const stateChangeHandler = () => {
        setDisabled(!commandManager.canExecute(graph, name))
      };
      setDisabled(!commandManager.canExecute(graph, name));
      graph.on(EditorEvent.onGraphStateChange, stateChangeHandler)
      return()=>{
        graph.off(EditorEvent.onGraphStateChange, stateChangeHandler)
      }
    }
  },[graph]);

  const handleClick = () => {
    executeCommand(name);
  };

  if(!graph){
    return null;
  }
  return (
    <div className={classNames(className, {[disabledClassName]: disabled})}
         onClick={handleClick}
    >
      {props.children}
    </div>
  );
};

export default Command;
