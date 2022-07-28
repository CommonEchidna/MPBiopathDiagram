import { observable, action } from 'mobx-angular';

class Tabstore {
    @observable tabnum = 0;
    @action setTab(pos) {
        this.tabnum = pos;
    }
}

export const tabstore = new Tabstore();