import React, {FunctionComponent, useCallback, useEffect, useRef, useState} from 'react';
import Popover from 'antd/lib/popover';
import {Item} from "@/common/interface";
import {useEditorContext} from "@/components/context/editor-context";
import {GraphNodeEvent} from "@/common/constants";
import delay from 'lodash/delay';
import global from '@/common/global';
import {TooltipPlacement} from "antd/lib/tooltip";
import 'antd/lib/popover/style';
import ReactDOM from "react-dom";

export enum ItemPopoverType{
  Node = 'node',
  Edge = 'edge'
}
export type Placement = TooltipPlacement;
export type RenderFunction = (item:Item) => React.ReactNode

interface ItemPopoverProps {
  type?: ItemPopoverType;
  title?: RenderFunction
  content?: RenderFunction;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  placement?: Placement;
}

const ItemPopover: FunctionComponent<ItemPopoverProps> = (props) => {

  const {
    type = ItemPopoverType.Node,
    title,
    content,
    mouseEnterDelay = 250,
    mouseLeaveDelay = 250,
    placement = 'top'
  } = props;
  const [item, setItem] = useState<Item>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<any>(null);
  let {graph} = useEditorContext();
  const mouseEnterTimoutRef = useRef<number>(0)
  const mouseLeaveTimoutRef = useRef<number>(0)

  const showItemPopover = useCallback((item:Item) => {
    global.plugin.itemPopover.state = 'show';
    const { minX, minY, maxX, maxY, centerX, centerY } = item.getBBox();

    const { x: itemMinX, y: itemMinY } = graph.getCanvasByPoint(minX, minY);
    const { x: itemMaxX, y: itemMaxY } = graph.getCanvasByPoint(maxX, maxY);
    const { x: itemCenterX, y: itemCenterY } = graph.getCanvasByPoint(centerX, centerY);

    const position = {
      minX: itemMinX,
      minY: itemMinY,
      maxX: itemMaxX,
      maxY: itemMaxY,
      centerX: itemCenterX,
      centerY: itemCenterY,
    };
    setItem(item);
    setPosition(position);
    setVisible(true);
  },[graph]);

  const hideItemPopover = useCallback(() => {
    global.plugin.itemPopover.state = 'hide';
    setVisible(false);
    setPosition(null);
  },[]);

  useEffect(()=>{
    const handleMouseEnter = ({item}) => {
      clearTimeout(mouseEnterTimoutRef.current);
      mouseEnterTimoutRef.current = delay(showItemPopover, mouseEnterDelay, item);
    };

    const handleMouseLeave = ({item}) => {
      clearTimeout(mouseLeaveTimoutRef.current);
      mouseLeaveTimoutRef.current = delay(hideItemPopover, mouseLeaveDelay, item);
    };

    if(graph){
      graph.on(GraphNodeEvent.onNodeMouseEnter, handleMouseEnter);
      graph.on(GraphNodeEvent.onNodeMouseLeave, handleMouseLeave)
    }
    return ()=>{
      if(graph){
        graph.off(GraphNodeEvent.onNodeMouseEnter, handleMouseEnter);
        graph.off(GraphNodeEvent.onNodeMouseLeave, handleMouseLeave)
      }
    }
  },[graph, type, mouseEnterDelay, mouseLeaveDelay]);

  if(!visible || !position || !item){
    return null;
  }
  let styles: React.CSSProperties;
  if(placement === 'top'){
    styles = {
      position: "absolute",
      left: position.centerX,
      top: position.minY
    }
  }else if(placement === 'topLeft'){
    styles = {
      position: "absolute",
      left: position.minX,
      top: position.minY
    }
  }else if(placement === 'topRight'){
    styles = {
      position: "absolute",
      left: position.maxX,
      top: position.minY
    }
  }else if(placement === 'left'){
    styles = {
      position: "absolute",
      left: position.minX,
      top: position.centerY
    }
  }else if(placement === 'right'){
    styles = {
      position: "absolute",
      left: position.maxX,
      top: position.centerY
    }
  }else if(placement === 'bottom'){
    styles = {
      position: "absolute",
      left: position.centerX,
      top: position.maxY
    }
  }else if(placement === 'bottomLeft'){
    styles = {
      position: "absolute",
      left: position.minX,
      top: position.maxY
    }
  }else{
    styles = {
      position: "absolute",
      left: position.maxX,
      top: position.maxY
    }
  }
  return ReactDOM.createPortal(
    <Popover
      visible
      title={title(item)}
      content={content(item)}
      placement={placement}>
      <div style={styles}/>
    </Popover>,
    graph.get('container')
  );
};

export default ItemPopover;
