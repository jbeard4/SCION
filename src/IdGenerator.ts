export default class IdGenerator{
  private _count : number;
  constructor(){
    this.reset();
  }

  public generateId():string{
    return '$generated_' + Number(this._count++).toString();
  }

  public reset() {
    this._count = 0;
  } 
}
