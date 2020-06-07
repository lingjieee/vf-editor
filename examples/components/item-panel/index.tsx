import React, { FunctionComponent } from 'react';
import Editor, {Flow, Item, ItemPanel} from 'vf-editor';
import styles from './index.less';

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

const App: FunctionComponent = () => {

  return (
    <div>
      <Editor>
        <ItemPanel className={styles.itemPanel}>
          <Item className={styles.item}
                model={{
                  type: 'circle',
                  size: 50,
                  label: 'circle'
                }}>
            <div className={styles.circle}>
              circle
            </div>
          </Item>
          <Item className={styles.item}
                model={{
                  type: 'rect',
                  size: [80,24],
                  label: 'rect'
                }}>
            <div className={styles.rect}>
              rect
            </div>
          </Item>
        </ItemPanel>
        <Flow data={data} className={styles.graph}/>
      </Editor>
    </div>
  );
};

export default App;
