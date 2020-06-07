import React, { FunctionComponent } from 'react';
import styles from './index.less';
import Editor, {Flow, constants, Command} from "vf-editor";
import {createFromIconfontCN} from '@ant-design/icons';
import Divider from 'antd/lib/divider';
import Tooltip from 'antd/lib/tooltip';
import upperFirst from 'lodash/upperFirst';
import 'antd/lib/divider/style';
import 'antd/lib/tooltip/style';

const Icon = createFromIconfontCN({scriptUrl: 'https://at.alicdn.com/t/font_1868205_mw1l92j3c7.js'});
const {EditorCommand} = constants;

const COMMAND_LIST = [
  EditorCommand.Undo,
  EditorCommand.Redo,
  '|',
  EditorCommand.Copy,
  EditorCommand.Paste,
  EditorCommand.Remove,
  '|',
  EditorCommand.ZoomIn,
  EditorCommand.ZoomOut
]

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

const App: FunctionComponent = (props) => {

  return (
    <Editor>
      <div className={styles.toolbar}>
        {COMMAND_LIST.map((name, index)=>{
          if(name==='|'){
            return <Divider key={index} type="vertical"/>
          }
          return (
            <Command key={name} name={name} className={styles.command} disabledClassName={styles.commandDisabled}>
              <Tooltip title={upperFirst(name)}>
                <Icon type={`icon-${name}`}/>
              </Tooltip>
            </Command>
          )
        })}
      </div>
      <Flow data={data} className={styles.graph}/>
    </Editor>
  );
};

export default App;
