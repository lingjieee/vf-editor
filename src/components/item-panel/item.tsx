import React, {FunctionComponent} from 'react';
import {GraphMode, ItemType} from "@/common/constants";
import {NodeModel} from "@/common/interface";
import {useEditorContext} from "@/components/context/editor-context";
import global from '@/common/global';
import pick from 'lodash/pick';

interface ItemProps {
  style?: React.CSSProperties;
  className?: string;
  type?: ItemType;
  model: Partial<NodeModel>;
}

const Item: FunctionComponent<ItemProps> = (props) => {
  let {graph} = useEditorContext();

  const handleMouseDown = () => {
    const {type = ItemType.Node, model} = props;
    if(type===ItemType.Node){
      global.component.itemPanel.model = model;
      graph.setMode(GraphMode.AddNode)
    }
  };

  return (
    <div {...pick(props, ['style','className'])} onMouseDown={handleMouseDown}>
      {props.children}
    </div>
  );
};

export default Item;
