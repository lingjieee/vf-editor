import React, {FunctionComponent, useMemo} from 'react';
import G6 from '@antv/g6';
import {Behavior, Command, CustomEdge, CustomNode} from "@/common/interface";
import {useEditorContext} from "@/components/context/editor-context";
import behaviorManager from "@/common/behavior-manager";

interface RegisterNodeProps {
  name: string,
  config: CustomNode,
  extend?: string
}

const RegisterNode: FunctionComponent<RegisterNodeProps> = (props) => {
  useMemo(()=>{
    const {name, config, extend} = props;
    G6.registerNode(name, config, extend);
  },[]);
  return null;
};

interface RegisterEdgeProps {
  name: string,
  config: CustomEdge,
  extend?: string
}

const RegisterEdge: FunctionComponent<RegisterEdgeProps> = (props) => {
  useMemo(()=>{
    const {name, config, extend} = props;
    G6.registerEdge(name, config, extend);
  },[]);
  return null;
};

interface RegisterCommandProps {
  name: string,
  command: Command,
}

const RegisterCommand: FunctionComponent<RegisterCommandProps> = (props) => {
  let {commandManager} = useEditorContext();
  useMemo(()=>{
    const {name, command} = props;
    if(commandManager){
      commandManager.register(name, command)
    }
  },[commandManager]);
  return null;
};

interface RegisterBehaviorProps {
  name: string,
  behavior: Behavior
}

const RegisterBehavior: FunctionComponent<RegisterBehaviorProps> = (props) => {
  useMemo(()=>{
    const {name, behavior} = props;
    behaviorManager.register(name, behavior);
  },[]);
  return null;
};

export {
  RegisterNode,
  RegisterEdge,
  RegisterCommand,
  RegisterBehavior
}