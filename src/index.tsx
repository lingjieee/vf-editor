import G6 from '@antv/g6';
import '@/shape';

import Editor from '@/components/editor';
import Flow from '@/components/flow';
import ItemPanel, {Item} from './components/item-panel';
import EditableLabel from '@/plugins/editable-label';
import ItemPopover from '@/plugins/item-popover';
import DetailPanel, {useFlowDetail} from './components/detail-panel';
import { useEditorContext } from './components/context/editor-context';

import global from '@/common/global';
import * as constants from '@/common/constants';
import CommandManager from '@/common/command-manager';
import behaviorManager from '@/common/behavior-manager';
import Command from '@/components/command';

import { setAnchorPointsState } from '@/shape/common/anchor';
import { baseCommand } from './components/graph/command/base';
import {RegisterNode, RegisterEdge, RegisterCommand, RegisterBehavior} from './components/register';

export {
  Flow,
  G6,
  ItemPanel,
  Item,
  Command,
  EditableLabel,
  ItemPopover,
  DetailPanel,
  baseCommand,
  RegisterEdge,
  RegisterNode,
  RegisterCommand,
  RegisterBehavior,
  useFlowDetail,
  useEditorContext,
  global,
  constants,
  CommandManager,
  behaviorManager,
  setAnchorPointsState,
}

export default Editor;