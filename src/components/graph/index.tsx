import React, {FunctionComponent, useEffect, useRef} from 'react';
import {useEditorContext} from "@/components/context/editor-context";
import G6 from '@antv/g6';
import merge from 'lodash/merge';
import {
  FlowData,
  Graph,
  GraphNativeEvent,
  GraphOptions,
  GraphReactEvent,
  GraphReactEventProps
} from "@/common/interface";
import pick from 'lodash/pick';

import commands from './command';
import './behavior';
import {GraphCanvasEvent, GraphCommonEvent, GraphCustomEvent, GraphEdgeEvent, GraphNodeEvent} from "@/common/constants";

interface GraphProps extends Partial<GraphReactEventProps>{
  style?: React.CSSProperties;
  className?: string;
  config: Partial<GraphOptions>,
  data: FlowData,
  parseData: (data:FlowData) => void;
}

const GraphComponent: FunctionComponent<GraphProps> = (props) => {

  const containerRef = useRef<HTMLDivElement>();
  const graphRef = useRef<Graph>(null);
  let {setGraph, commandManager} = useEditorContext();

  useEffect(()=>{
    init();
    bindEvent();
  },[]);

  const init = () => {
    if(containerRef.current){
      const container = containerRef.current;
      const {clientWidth = 0, clientHeight = 0} = container;
      const actConfig:GraphOptions = merge(props.config, {container: containerRef.current, width: clientWidth, height: clientHeight});
      let graph = new G6.Graph(actConfig);
      graphRef.current = graph;
      const data = {...props.data};
      if(data){
        props.parseData(data);
        graph.data(data);
      }
      graph.render();

      setGraph(graph);
      // 设置命令管理器
      graph.set('commandManager', commandManager);
      Object.keys(commands).forEach(name => {
        commandManager.register(name, commands[name]);
      });
    }
  };

  const bindEvent = () => {
    if(graphRef.current){
      const graph = graphRef.current;
      const events: {
        [propName in GraphReactEvent] : GraphNativeEvent
      } = {
        ...GraphCommonEvent,
        ...GraphNodeEvent,
        ...GraphEdgeEvent,
        ...GraphCanvasEvent,
        ...GraphCustomEvent
      };

      (Object.keys(events) as GraphReactEvent[]).forEach(event=>{
        if(typeof props[event] === 'function'){
          graph.on(events[event], props[event]);
        }
      })
    }
  };

  return (
    <div ref={containerRef} {...pick(props, ['className', 'style'])}/>
  );
};

export default GraphComponent;
