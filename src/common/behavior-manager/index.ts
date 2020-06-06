import {Behavior} from "@/common/interface";
import G6 from '@antv/g6';

class BehaviorManager {

  behaviors: Record<string, Behavior> = {};

  getRegisteredBehaviors = () => {
    const registeredBehaviors = {};
    Object.keys(this.behaviors).forEach(name=>{
      const behavior = this.behaviors[name];
      const {graphMode = 'default'} = behavior;
      if(!registeredBehaviors[graphMode]){
        registeredBehaviors[graphMode] = {};
      }

      registeredBehaviors[graphMode][name] = name;
    });
    return registeredBehaviors;
  }

  register = (name:string, behavior: Behavior) => {
    this.behaviors[name] = behavior;
    G6.registerBehavior(name, behavior);
  };
}

export default new BehaviorManager();