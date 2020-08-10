import 'reflect-metadata';
import { Container, injectable, inject } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

const container = new Container();
const { lazyInject } = getDecorators(container);

const TYPE = {
  Dom: Symbol.for('Dom'),
  DomUi: Symbol.for('DomUi')
};

@injectable()
class DomUi {
  @lazyInject(TYPE.Dom) public dom!: Dom;
  public name: string;
  constructor () {
    console.log('instanitate DomUi!');
    this.name = 'domUi';
  }
}

@injectable()
class Dom {
  public name: string;
  public domUi: DomUi;
  constructor (@inject(TYPE.DomUi) d: DomUi) {
    console.log('instantiate Dom!');
    this.domUi = d;
    this.name = 'Dom';
  }
}

@injectable()
class Test {
  public dom: Dom;
  public domUi: DomUi;
  constructor (@inject(TYPE.Dom) d: Dom, @inject(TYPE.DomUi) dui: DomUi) {
    console.log('instantiate Test!');
    this.dom = d;
    this.domUi = dui;
  }
}

container.bind<DomUi>(TYPE.DomUi).to(DomUi).inSingletonScope();
container.bind<Dom>(TYPE.Dom).to(Dom).inSingletonScope();
container.bind(Test).toSelf();
// container.bind<DomUi>(TYPE.DomUi).to(DomUi);
// container.bind<Dom>(TYPE.Dom).to(Dom);

const t = container.resolve(Test);
console.log('resolved Test ====>', t);
console.log('get t.dom.name ====>', t.dom.name);
