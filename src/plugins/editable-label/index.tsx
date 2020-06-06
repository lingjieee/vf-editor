import React, {FunctionComponent, useCallback, useEffect, useRef, useState} from 'react';
import {useEditorContext} from "@/components/context/editor-context";
import {LabelStateEvent} from "@/common/interface";
import {EditorEvent, GraphMode, GraphNodeEvent, LabelState} from "@/common/constants";
import global from '@/common/global';
import {getSelectedNodes} from "@/util";
import G6 from '@antv/g6';
import ReactDOM from 'react-dom';

interface EditableLabelProps {
  labelClassName?: string;
  labelMaxWidth?: number;
}

const EditableLabel: FunctionComponent<EditableLabelProps> = (props) => {
  const {
    labelClassName = 'node-label',
    labelMaxWidth = 100
  } = props;

  let {graph, executeCommand} = useEditorContext();
  const divRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);

  const showEditableLabel = useCallback(()=>{
    global.plugin.editableLabel.state = 'show';
    setVisible(true);
    setTimeout(()=>{
      if(divRef.current){
        divRef.current.focus();
        document.execCommand('selectAll', false, null);
      }
    },0);
  },[]);

  const hideEditableLabel = useCallback(()=>{
    global.plugin.editableLabel.state = 'hide';
    setVisible(false);
  },[]);

  const update = () => {
    if(graph && divRef.current){
      const node = getSelectedNodes(graph)[0];
      const model = node.getModel();

      const {textContent: label} = divRef.current;
      if(label === model.label){
        return;
      }

      executeCommand('update', {
        id: model.id,
        updateModel: {
          label,
        },
        forceRefreshLayout: false
      })
    }
  };

  const handleBlur = () => {
    update();
    hideEditableLabel();
  };

  const handleKeyDown = (e:React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const {key} = e;
    if(['Tab'].includes(key)){
      e.preventDefault();
    }

    if(['Enter', 'Escape', 'Tab'].includes(key)) {
      update();
      hideEditableLabel();
    }
  }

  useEffect(()=>{
    const handler = ({labelState}:LabelStateEvent) => {
      if(labelState === LabelState.Show){
        showEditableLabel()
      }else{
        hideEditableLabel();
      }
    };

    if(graph){
      graph.on(EditorEvent.onLabelStateChange, handler);
      graph.on(GraphNodeEvent.onNodeDoubleClick, showEditableLabel);
    }
    return ()=>{
      if(graph){
        graph.off(EditorEvent.onLabelStateChange, handler);
        graph.off(GraphNodeEvent.onNodeDoubleClick, showEditableLabel);
      }
    }
  },[graph]);

  if(!graph){
    return null;
  }

  const mode = graph.getCurrentMode();
  const zoom = graph.getZoom();
  if(mode === GraphMode.Readonly){
    return null;
  }
  const node = getSelectedNodes(graph)[0];
  if(!node){
    return null;
  }
  const model = node.getModel();
  const group = node.getContainer();

  const label = model.label;
  const labelShape = group.findByClassName(labelClassName);
  if(!labelShape){
    return null;
  }
  if(!visible){
    return null;
  }

  // Get the label offset
  const { x: relativeX, y: relativeY } = labelShape.getBBox();
  const { x: absoluteX, y: absoluteY } = G6.Util.applyMatrix(
    {
      x: relativeX,
      y: relativeY,
    },
    node.getContainer().getMatrix(),
  );
  const { x: left, y: top } = graph.getCanvasByPoint(absoluteX, absoluteY);

  // Get the label size
  const { width, height } = labelShape.getBBox();

  // Get the label font
  const font = labelShape.attr('font');

  const style: React.CSSProperties = {
    position: 'absolute',
    top,
    left,
    width: 'auto',
    height: 'auto',
    minWidth: width,
    minHeight: height,
    maxWidth: labelMaxWidth,
    font,
    background: 'white',
    border: '1px solid #1890ff',
    outline: 'none',
    transform: `scale(${zoom})`,
    transformOrigin: 'left top',
  };
  return ReactDOM.createPortal(
    <div
      ref={divRef}
      style={style}
      contentEditable
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      suppressContentEditableWarning
    >
      {label}
    </div>,
    graph.get('container')
  );
};

export default EditableLabel;
