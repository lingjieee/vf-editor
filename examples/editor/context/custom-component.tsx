import React, {FunctionComponent, useEffect} from 'react';
import {useEditorContext} from 'vf-editor';

interface OwnProps {}

type Props = OwnProps;

const CustomComponent: FunctionComponent<Props> = (props) => {

  let {graph, commandManager, executeCommand} = useEditorContext();

  useEffect(()=>{
    console.log('graph:', graph);
    console.log('commandManager:', commandManager);
    console.log('executeCommand:', executeCommand);
  },[graph, commandManager, executeCommand]);

  return (
    <div/>
  );
};

export default CustomComponent;
