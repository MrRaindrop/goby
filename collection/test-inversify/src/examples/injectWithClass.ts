/**
 * class inject 的限制是不太好处理循环依赖的情况.
 */

import 'reflect-metadata';
import { Container, injectable } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

var container = new Container();
const { lazyInject } = getDecorators(container);

@injectable()
class Katana {
  public hit () {
    return 'cut!';
  }
}

@injectable()
class Shuriken {
  public test: string;
  constructor () {
    this.test = 'test';
  }
  public throw () {
    return 'hit!';
  }
}

@injectable()
class Ninja {
  @lazyInject(Katana) public _katana!: Katana;
  @lazyInject(Shuriken) public _shuriken!: Shuriken;
  // private _katana: Katana;
  // private _shuriken: Shuriken;

  // constructor (
    // @inject(Katana) k: Katana,
    // @inject(Shuriken) s: Shuriken
    // k: Katana,
    // s: Shuriken
  // ) {
    // this._katana = k;
    // this._shuriken = s;
  // }

  public fight () {
    return this._katana.hit();
  }
  public sneak () {
    return this._shuriken.throw();
  }
}

container.bind(Katana).toSelf().inSingletonScope();
container.bind(Shuriken).toSelf().inSingletonScope();

const s = container.resolve(Shuriken);
console.log('====>', s);

const n = container.resolve(Ninja);
// console.log('===>', n);
console.log('===>', n.fight());
console.log('===>', n.sneak());
