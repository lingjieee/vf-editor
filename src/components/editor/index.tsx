import React, {FunctionComponent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {EditorContextProvider} from "@/components/context/editor-context";
import {CommandEvent, Graph} from "@/common/interface";
import pick from 'lodash/pick';
import CommandManager from "@/common/command-manager";
import {EditorEvent, GraphCommonEvent, RendererType} from "@/common/constants";
import isArray from 'lodash/isArray';
import isHotkey from 'is-hotkey';

interface EditorProps {
  styles?: React.CSSProperties;
  className?: string;
  [EditorEvent.onBeforeExecuteCommand]?: (e: CommandEvent) => void;
  [EditorEvent.onAfterExecuteCommand]?: (e: CommandEvent) => void;
}

const Editor: FunctionComponent<EditorProps> = (props) => {

  let commandManager = useMemo(()=>new CommandManager(), []);
  const [graph, setStateGraph] = useState<Graph>(null);
  const graphRef = useRef<Graph>(null);
  const lastMouseDownTargetRef = useRef<HTMLElement>(null);

  const bindEvent = useCallback((graph: Graph) => {
    const defaultEvent = ()=>{};
    graph.on(EditorEvent.onBeforeExecuteCommand, props[EditorEvent.onBeforeExecuteCommand] || defaultEvent);
    graph.on(EditorEvent.onAfterExecuteCommand, props[EditorEvent.onAfterExecuteCommand] || defaultEvent);
  },[]);

  useEffect(()=>{
    const mouseDownHandler = e => {
      lastMouseDownTargetRef.current = e.target as HTMLElement;
    };
    window.addEventListener(GraphCommonEvent.onMouseDown, mouseDownHandler);
    return ()=>{
      window.removeEventListener(GraphCommonEvent.onMouseDown, mouseDownHandler);
    }
  });

  const shouldTriggerShortcut = useCallback((graph: Graph, target:HTMLElement | null)=>{
    const renderer: RendererType = graph.get('renderer');
    const canvasElement = graph.get('canvas').get('el');

    if(!target){
      return false;
    }

    if(target === canvasElement){
      return true;
    }

    if(renderer === RendererType.Svg){
      if(target.nodeName === 'svg'){
        return true;
      }

      let parentNode = target.parentNode;
      while (parentNode && parentNode.nodeName !== 'BODY'){
        if(parentNode.nodeName === 'svg'){
          return true;
        }else{
          parentNode = parentNode.parentNode;
        }
      }

      return false;
    }
  },[]);

  const executeCommand = useCallback((name:string, params?: object) => {
    const graph = graphRef.current;
    if(graph){
      commandManager.execute(graph, name, params);
    }
  },[commandManager]);

  const bindShortcut = useCallback((graph: Graph) => {
    const handler = (e:any) => {
      if(!shouldTriggerShortcut(graph, lastMouseDownTargetRef.current)){
        return;
      }

      Object.values(commandManager.command).some(command => {
        const {name, shortcuts} = command;
        const flag = shortcuts.some((shortcut:string) => {
          if(isHotkey(shortcut, e)){
            return true;
          }
        });
        if(flag){
          if(commandManager.canExecute(graph, name)){
            e.preventDefault();
            executeCommand(name);
            return true;
          }
        }
        return false;
      })
    };
    graph.on(GraphCommonEvent.onKeyDown, handler);
    return()=>{
      graph.off(GraphCommonEvent.onKeyDown, handler);
    }
  },[graph, commandManager, executeCommand]);

  const setGraph = useCallback((graph: Graph)=>{
    setStateGraph(graph);
    graphRef.current = graph;
    bindEvent(graph);
    bindShortcut(graph);
  },[setStateGraph]);

  return (
    <EditorContextProvider value={{
      graph, setGraph,
      commandManager,
      executeCommand,
    }}>
      <div {...pick(props, 'className', 'style')}>
        {props.children}
      </div>
    </EditorContextProvider>
  );
};

export default Editor;
