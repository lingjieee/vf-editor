import React, {FunctionComponent, useCallback, useEffect} from 'react';
import {useEditorContext} from "@/components/context/editor-context";
import {GraphMode} from "@/common/constants";
import {GGroup, GShape} from "@/common/interface";
import global from '@/common/global';
import pick from 'lodash/pick';
import Item from './item';

interface ItemPanelProps {
  style?: React.CSSProperties;
  className?: string;
}

const ItemPanel: FunctionComponent<ItemPanelProps> = (props) => {

  let {graph} = useEditorContext();
  const handleMouseUp = useCallback(()=>{
    if(graph.getCurrentMode()===GraphMode.Default){
      return;
    }

    const group: GGroup = graph.get('group');
    const shape: GShape = group.findByClassName(global.component.itemPanel.delegateShapeClassName) as GShape;

    if(shape){
      shape.remove(true);
      graph.paint();
    }

    global.component.itemPanel.model = null;
    graph.setMode(GraphMode.Default);
  },[graph]);

  useEffect(()=>{
    document.addEventListener('mouseup', handleMouseUp, false);
    return ()=>{
      document.removeEventListener('mouseup', handleMouseUp, false);
    }
  },[handleMouseUp]);

  return (
    <div {...pick(props, ['styles', 'className'])}>
      {props.children}
    </div>
  );
};

export {Item}
export default ItemPanel;
