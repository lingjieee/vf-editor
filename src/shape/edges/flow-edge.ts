import {CustomEdge, GGroup, GShape} from "@/common/interface";
import {ItemState} from "@/common/constants";
import G6 from '@antv/g6';

const EDGE_LABEL_CLASS_NAME = 'edge-label';
const EDGE_LABEL_WRAPPER_CLASS_NAME = 'edge-label-wrapper-label';

const flowEdge: CustomEdge = {
  options: {
    style: {
      stroke: '#e5e5e5',
      lineWidth: 1,
      lineAppendWidth: 16,
      shadowColor: null,
      shadowBlur: 0,
      radius: 8,
      offset: 20,
      endArrow: {
        path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
        fill: '#e5e5e5'
      },
    },
    labelCfg: {
      style: {
        fill: '#000000',
        fontSize: 10,
      },
    },
    stateStyles: {
      [ItemState.Selected]: {
        stroke: '#5aaaff',
        shadowColor: '#5aaaff',
        lineAppendWidth: 16,
        shadowBlur: 24,
        endArrow: {
          path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
          fill: '#5aaaff'
        }
      },
      [ItemState.HighLight]: {
        stroke: '#5aaaff',
        shadowColor: '#5aaaff',
        lineAppendWidth: 16,
        shadowBlur: 24,
        endArrow: {
          path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
          fill: '#5aaaff'
        }
      },
    },
  },

  getPath(points){
    const startPoint = points[0];
    const endPoint = points[1];
    const arcRatio = 4;
    const arrowEndSpace = 9;
    let edgeX = startPoint.x;
    let edgeY = startPoint.y;
    let endX = endPoint.x;
    let endY = endPoint.y;
    const startControlPoint = [edgeX, edgeY];
    const endControlPoint = [endX, endY];
    const startAngel = this.getPointDirect(startPoint);
    const endAngel = this.getPointDirect(endPoint);
    const  offsetLength = Math.sqrt(Math.pow(edgeX - endX, 2) + Math.pow(edgeY - endY, 2)) / arcRatio;

    startControlPoint[0] += (1 / startAngel < 0 ? -1 : 1) * Math.cos(startAngel) * offsetLength;
    startControlPoint[1] += -Math.sin(startAngel) * offsetLength; // svg坐标系倒置需要给y坐标加负号

    endControlPoint[0] += (1 / endAngel < 0 ? -1 : 1) * Math.cos(endAngel) * offsetLength;
    endControlPoint[1] += -Math.sin(endAngel) * offsetLength; // svg坐标系倒置需要给y坐标加负号

    if(endPoint.index===0){
      endY -= arrowEndSpace;
    }else if(endPoint.index === 1){
      endX += arrowEndSpace;
    }else if(endPoint.index===2){
      endY += arrowEndSpace;
    }else if(endPoint.index===3){
      endX -= arrowEndSpace;
    }

    return [
      ['M', startPoint.x, startPoint.y],
      ['C', startControlPoint[0], startControlPoint[1],endControlPoint[0],endControlPoint[1], endX, endY],
      ['L', endPoint.x, endPoint.y]
    ]
  },

  getPointDirect(point){
    let angel = 0;
    if(point.index===0){
      angel = Math.PI / 2;
    }else if(point.index===1){
      angel = -Math.PI;
    }else if(point.index===2){
      angel = -Math.PI / 2;
    }else if(point.index===3){
      angel = Math.PI;
    }
    return angel || 0;
  },

  createLabelWrapper(group: GGroup) {
    const label = group.findByClassName(EDGE_LABEL_CLASS_NAME);
    const labelWrapper = group.findByClassName(EDGE_LABEL_WRAPPER_CLASS_NAME);

    if (!label) {
      return;
    }

    if (labelWrapper) {
      return;
    }

    group.addShape('rect', {
      className: EDGE_LABEL_WRAPPER_CLASS_NAME,
      attrs: {
        fill: '#e1e5e8',
        radius: 2,
      },
    });

    label.set('zIndex', 1);

    group.sort();
  },

  updateLabelWrapper(group: GGroup) {
    const label = group.findByClassName(EDGE_LABEL_CLASS_NAME);
    const labelWrapper = group.findByClassName(EDGE_LABEL_WRAPPER_CLASS_NAME);

    if (!label) {
      labelWrapper && labelWrapper.hide();
      return;
    } else {
      labelWrapper && labelWrapper.show();
    }

    if (!labelWrapper) {
      return;
    }

    const { minX, minY, width, height } = label.getBBox();

    labelWrapper.attr({
      x: minX - 5,
      y: minY - 3,
      width: width + 10,
      height: height + 6,
    });
  },

  afterDraw(model, group) {
    this.createLabelWrapper(group);
    this.updateLabelWrapper(group);
  },

  afterUpdate(model, item) {
    const group = item.getContainer();

    this.createLabelWrapper(group);
    this.updateLabelWrapper(group);
  },

  setState(name, value, item) {
    const shape: GShape = item.get('keyShape');

    if (!shape) {
      return;
    }

    const { style, stateStyles } = this.options;

    const stateStyle = stateStyles[name];

    if (!stateStyle) {
      return;
    }

    if (value) {
      shape.attr({
        ...style,
        ...stateStyle,
      });
    } else {
      shape.attr(style);
    }
  },
}

// polyline
G6.registerEdge('flowEdge', flowEdge, 'line');
