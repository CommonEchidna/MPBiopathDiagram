import { observable, action } from 'mobx-angular';

class Tabstore {
    @observable tabdata = [];
    @action setTab(pos) {
        this.tabdata = pos;
    }
}

export const tabstore = new Tabstore();