import React, {FunctionComponent, useEffect} from 'react';
import {useEditorContext, useFlowDetail} from 'vf-editor';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import 'antd/lib/card/style';
import 'antd/lib/form/style';
import 'antd/lib/input/style';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const NodeDetail: FunctionComponent = () => {

  const {isNode, item} = useFlowDetail();
  let {executeCommand} = useEditorContext();
  let [form] = Form.useForm();

  useEffect(()=>{
    if(item && isNode){
      form.setFieldsValue({label: item.getModel().label})
    }
  },[item, isNode]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    form.validateFields()
      .then((values)=>{
        executeCommand('update', {
          id: item.get('id'),
          updateModel: {
            ...values
          }
        })
      },()=>{});
  };

  if(!isNode){
    return null;
  }

  return (
    <Card title="Node" bordered={false}>
     <Form form={form} {...formItemLayout}>
       <Form.Item label="Label" name="label">
         <Input onBlur={handleSubmit}/>
       </Form.Item>
     </Form>
    </Card>
  );
};

const EdgeDetail: FunctionComponent = () => {

  const {isEdge, item} = useFlowDetail();
  let {executeCommand} = useEditorContext();
  let [form] = Form.useForm();

  useEffect(()=>{
    if(item && isEdge){
      form.setFieldsValue({label: item.getModel().label})
    }
  },[item, isEdge]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    form.validateFields()
      .then((values)=>{
        executeCommand('update', {
          id: item.get('id'),
          updateModel: {
            ...values
          }
        })
      },()=>{});
  };

  if(!isEdge){
    return null;
  }

  return (
    <Card title="Edge" bordered={false}>
      <Form form={form} {...formItemLayout}>
        <Form.Item label="Label" name="label">
          <Input onBlur={handleSubmit}/>
        </Form.Item>
      </Form>
    </Card>
  );
};

const CanvasDetail: FunctionComponent = () => {

  const {isCanvas} = useFlowDetail();

  if(!isCanvas){
    return null;
  }

  return (
    <Card title="Canvas" bordered={false}>
      <p>Select a not or edge</p>
    </Card>
  );
};

export {NodeDetail, EdgeDetail, CanvasDetail}