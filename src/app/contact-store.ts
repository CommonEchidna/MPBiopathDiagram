import { observable, action } from 'mobx-angular';

class GraphStore {
    @observable dot = ["","",""];
    @action setDot(dots,pos) {
        this.dot[pos] = dots;
    }
}

export const contactStore = new GraphStore();