import 'reflect-metadata';
import { injectable, inject, Container, interfaces } from "inversify";


class Katana {
  public hit () {
    return 'cut!';
  }
}

@injectable()
class Shuriken {
  public str: string;
  constructor () {
    this.str = 'hit';
  }
  public throw () {
    return this.str;
  }
}

interface Ninja {
  fight (): void;
  sneak (): void;
}

@injectable()
class Ninja implements Ninja {
  private _katana: Katana;
  private _shuriken: Shuriken;

  public constructor(
    @inject("Factory<Katana>") katanaFactory: () => Katana, 
    @inject("Shuriken") shuriken: Shuriken
  ) {
      this._katana = katanaFactory();
      this._shuriken = shuriken;
  }

  public fight() { return this._katana.hit(); };
  public sneak() { return this._shuriken.throw(); };
}

const container = new Container();

container.bind<interfaces.Factory<Katana>>('Factory<Katana>')
  .toFactory<Katana>((context: interfaces.Context) => {
    return () => {
      return context.container.get<Katana>('Katana');
    };
  });


interface IOpt { name: string; }
function log (opt: IOpt) {
  console.log(opt.name);
}

const testObj = {
  name: 'test',
  other: 123
};

log(testObj);
// log({
//   name: 'test',
//   other: 123
// } as any);
