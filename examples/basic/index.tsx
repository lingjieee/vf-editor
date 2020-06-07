import React, { FunctionComponent } from 'react';
import Editor, {Flow, EditableLabel, ItemPopover} from 'vf-editor';
import styles from './index.less';

interface OwnProps {}

type Props = OwnProps;

const data = {
  nodes: [
    {
      id: '0',
      label: 'Node',
      x: 50,
      y: 50,
    },
    {
      id: '1',
      label: 'Node',
      x: 50,
      y: 200,
    },
  ],
  edges: [
    {
      label: 'Label',
      source: '0',
      sourceAnchor: 2,
      target: '1',
      targetAnchor: 0,
    },
  ],
};

const Basic: FunctionComponent<Props> = (props) => {

  return (
    <div>
      <Editor>
        <Flow data={data} className={styles.graph}/>
        <EditableLabel/>
        <ItemPopover title={()=>"title"} content={(item)=>{
          return(
            <div>
              content
            </div>
          )
        }}/>
      </Editor>
    </div>
  );
};

export default Basic;
