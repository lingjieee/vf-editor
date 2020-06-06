import React, {FunctionComponent, useEffect, useState} from 'react';
import {EditorEvent, GraphState} from "@/common/constants";
import {useEditorContext} from "@/components/context/editor-context";
import {GraphStateEvent} from "@/common/interface";
import {getSelectedEdges, getSelectedNodes} from "@/util";
import {DetailContextProvider, useFlowDetail} from "./context";

interface DetailPanelProps {}

const DetailPanel: FunctionComponent<DetailPanelProps> = (props) => {

  const [graphState, setGraphState] = useState(GraphState.CanvasSelected);
  let {graph} = useEditorContext();

  useEffect(()=>{
    const handler = ({graphState}:GraphStateEvent) => {
      setGraphState(graphState)
    };
    graph?.on(EditorEvent.onGraphStateChange, handler);

    return()=>{
      graph?.off(EditorEvent.onGraphStateChange, handler);
    };
  },[graph]);

  if(!graph){
    return null;
  }
  const isNode = graphState === GraphState.NodeSelected;
  const isEdge = graphState === GraphState.EdgeSelected;
  const isCanvas = graphState === GraphState.CanvasSelected || graphState === GraphState.MultiSelected;
  let item = null;
  if(isNode){
    let nodes = getSelectedNodes(graph);
    if(nodes?.length>0){
      item = nodes[0];
    }
  }else if(isEdge){
    let edges = getSelectedEdges(graph);
    if(edges?.length>0){
      item = edges[0];
    }
  }

  return (
    <DetailContextProvider value={{
      isEdge,
      isNode,
      isCanvas,
      item
    }}>
      {props.children}
    </DetailContextProvider>
  );
};

export {useFlowDetail}
export default DetailPanel;
