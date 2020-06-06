import G6 from '@antv/g6';
import {CustomNode, GGroup, NodeModel} from "@/common/interface";
import {ItemState} from "@/common/constants";
import merge from 'lodash/merge';
import isArray from 'lodash/isArray';
import {optimizeMultilineText} from "@/shape/util";

const CONTENT_CLASS_NAME = 'node-content';
const LABEL_CLASS_NAME = 'node-label';

const baseNode: CustomNode = {
  options: {
    size: [120, 80],
    contentStyle: {
      fill: '#5487ea',
      fillOpacity: 0.08,
      stroke: '#5487ea',
      strokeOpacity: 0.65,
      radius: 6,
    },
    labelStyle: {
      fill: '#000000',
      textAlign: 'center',
      textBaseline: 'middle',
    },
    stateStyles: {
      [ItemState.Active]: {
        wrapperStyle: {},
        contentStyle: {},
        labelStyle: {},
      } as any,
      [ItemState.Selected]: {
        wrapperStyle: {},
        contentStyle: {},
        labelStyle: {},
      } as any,
    },
  },

  getOptions(model: NodeModel) {
    return merge({}, this.options, this.getCustomConfig(model) || {}, model);
  },

  draw(model, group) {
    const keyShape = this.drawContent(model, group);
    this.drawLabel(model, group);

    return keyShape;
  },

  drawContent(model: NodeModel, group: GGroup) {
    const [width, height] = this.getSize(model);
    const { contentStyle } = this.getOptions(model);
    const shape = group.addShape('rect', {
      className: CONTENT_CLASS_NAME,
      draggable: true,
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        ...contentStyle,
      },
    });

    return shape;
  },

  drawLabel(model: NodeModel, group: GGroup) {
    const [width, height] = this.getSize(model);
    const { labelStyle } = this.getOptions(model);

    const shape = group.addShape('text', {
      className: LABEL_CLASS_NAME,
      draggable: true,
      attrs: {
        x: width / 2,
        y: height / 2,
        text: model.label,
        ...labelStyle,
      },
    });

    return shape;
  },

  setLabelText(model: NodeModel, group: GGroup) {
    const shape = group.findByClassName(LABEL_CLASS_NAME);

    if (!shape) {
      return;
    }

    const [width] = this.getSize(model);
    const { fontStyle, fontWeight, fontSize, fontFamily } = shape.attr();

    const text = model.label as string;
    const font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

    shape.attr('text', optimizeMultilineText(text, font, 3, width));
  },

  update(model, item) {
    const group = item.getContainer();

    this.setLabelText(model, group);
  },

  setState(name, value, item) {
    const group = item.getContainer();
    const model = item.getModel();
    const states = item.getStates() as ItemState[];

    [LABEL_CLASS_NAME].forEach(className => {
      const shape = group.findByClassName(className);
      const options = this.getOptions(model);

      const shapeName = className.split('-')[1];

      shape.attr({
        ...options[`${shapeName}Style`],
      });

      states.forEach(state => {
        if (options.stateStyles[state] && options.stateStyles[state][`${shapeName}Style`]) {
          shape.attr({
            ...options.stateStyles[state][`${shapeName}Style`],
          });
        }
      });
    });

    if (name === ItemState.Selected) {
      const contentShape = group.findByClassName(CONTENT_CLASS_NAME);

      if (value) {
        contentShape.attr({
          fillOpacity: 0.25,
          strokeOpacity: 0.92,
        });
      } else {
        contentShape.attr({
          fillOpacity: 0.08,
          strokeOpacity: 0.65,
        });
      }
    }

    if (this.afterSetState) {
      this.afterSetState(name, value, item);
    }
  },

  getSize(model: NodeModel) {
    const { size } = this.getOptions(model);

    if (!isArray(size)) {
      return [size, size];
    }

    return size;
  },

  getCustomConfig() {
    return {};
  },

  getAnchorPoints() {
    return [];
  },
}

G6.registerNode('base-node', baseNode);