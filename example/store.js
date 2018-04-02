import {observable,decorate} from 'mobx';


export class MyStore {
  count = 0;

  increment = ()=>{
    this.count++;
  }
}
decorate(MyStore, {
  count: observable
});
const store = new MyStore();

export {store};
