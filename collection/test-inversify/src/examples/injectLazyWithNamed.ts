
/**
 * @named 只能和 @inject 配合使用，不能和 @lazyInjectNamed 配合使用.
 */

import 'reflect-metadata';
import { named, Container, injectable, inject } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

const container =  new Container();
const { lazyInjectNamed } = getDecorators(container);

const TYPES = {
  Weapon: 'weapon'
};

interface Weapon {
  name: string;
  durability: number;
  use (): void;
}

@injectable()
class Sword implements Weapon {
  public name: string;
  public durability: number;

  public constructor () {
    this.name = 'sword';
    this.durability = 100;
  }

  public use() {
    this.durability -= 10;
  }
}

@injectable()
class Shuriken implements Weapon {
  public name: string;
  public durability: number;
  public constructor () {
    this.name = 'shuriken';
    this.durability = 100;
  }

  use () {
    this.durability -= 20;
  }
}

@injectable()
class Warrior {
  @lazyInjectNamed(TYPES.Weapon, 'no-throwable')
  // @inject(TYPES.Weapon)
  // @named('no-throwable')
  public primaryWeapon!: Weapon;
  
  @lazyInjectNamed(TYPES.Weapon, 'throwable')
  // @inject(TYPES.Weapon)
  // @named('throwable')
  public secondaryWeapon!: Weapon;
}

container.bind(TYPES.Weapon).to(Sword).whenTargetNamed('no-throwable');
container.bind(TYPES.Weapon).to(Shuriken).whenTargetNamed('throwable');

const weapons = container.getAll(TYPES.Weapon);
console.log(weapons);

const warrior = container.resolve(Warrior);
// const warrior = container.get(Warrior);
console.log(warrior.primaryWeapon, warrior.secondaryWeapon);
