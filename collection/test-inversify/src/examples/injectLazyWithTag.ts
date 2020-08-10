
import 'reflect-metadata';
import { Container, injectable, tagged } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

const container =  new Container();
const { lazyInjectTagged } = getDecorators(container);

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
  @lazyInjectTagged(TYPES.Weapon, 'throwable', false)
  @tagged('throwable', false)
  public primaryWeapon!: Weapon;
  
  @lazyInjectTagged(TYPES.Weapon, 'throwable', true)
  @tagged('throwable', true)
  public secondaryWeapon!: Weapon;
}

container.bind(TYPES.Weapon).to(Sword).whenTargetTagged('throwable', false);
container.bind(TYPES.Weapon).to(Shuriken).whenTargetTagged('throwable', true);

const warrior = container.resolve(Warrior);

console.log(warrior.primaryWeapon, warrior.secondaryWeapon);
