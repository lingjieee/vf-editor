import React, {FunctionComponent, useCallback, useEffect, useMemo, useRef} from 'react';
import GraphComponent from "@/components/graph";
import {FlowData, Graph, GraphEvent, GraphOptions, GraphReactEventProps} from "@/common/interface";
import {useEditorContext} from "@/components/context/editor-context";
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import behaviorManager from "@/common/behavior-manager";
import global from '@/common/global';
import {guid} from "@/util";

import './behavior';

interface FlowProps extends Partial<GraphReactEventProps>{
  styles?: React.CSSProperties;
  className?: string;
  graphConfig?: Partial<GraphOptions>
  customModes?: (mode:string, behaviors: any) => object;
  data: FlowData
}

const Flow: FunctionComponent<FlowProps> = (props) => {

  const {graph} = useEditorContext();
  const graphRef = useRef<Graph>(graph);

  useEffect(()=>{
    graphRef.current = graph;
  },[graph]);

  const canDragNode = useCallback((e:GraphEvent) => {
    return !['anchor', 'banAnchor'].some(item => item === e.target.get('className'));
  },[]);

  const canDragOrZoomCanvas = useCallback(() => {
    const graph = graphRef.current;
    if(!graph){
      return false;
    }
    return (
      global.plugin.itemPopover.state === 'hide' &&
        global.plugin.contextMenu.state === 'hide' &&
        global.plugin.editableLabel.state === 'hide'
    );
  },[]);

  const parseData = (data:FlowData) => {
    const {nodes, edges} = data;
    [...nodes, ...edges].forEach(item => {
      const {id} = item;
      if(!id){
        item.id = guid();
      }
    })
  };

  const config:Partial<GraphOptions> = useMemo(()=>{
    const modes: any = merge(behaviorManager.getRegisteredBehaviors(), {
      default: {
        'drag-node': {
          type: 'drag-node',
          enableDelegate: true,
          shouldBegin: canDragNode
        },
        'drag-canvas': {
          type: 'drag-canvas',
          shouldBegin: canDragOrZoomCanvas,
          shouldUpdate: canDragOrZoomCanvas
        }
        ,
        'zoom-canvas': {
          type: 'zoom-canvas',
          shouldUpdate: canDragOrZoomCanvas
        }
        ,
        'recall-edge': 'recall-edge',
        'brush-select': 'brush-select'
      }
    })
    const {customModes} = props;
    Object.keys(modes).forEach(mode=>{
      const behaviors = modes[mode];
      modes[mode] = Object.values(customModes?customModes(mode, behaviors): behaviors);
    })
    return merge({
      defaultNode: {
        type: 'task-node',
      },
      defaultEdge: {
        type: 'flowEdge',
      },
      modes
    }, props.graphConfig||{})
  },[]);

  return (
    <GraphComponent
      data={props.data}
      config={config}
      parseData={parseData}
      {...omit(props, ['customModes'])}/>
  );
};

export default Flow;
