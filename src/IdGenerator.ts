export default class IdGenerator{
  private _count : number;
  constructor(){
    this._count = 0;
  }

  public generateId():string{
    return '$generated_' + Number(this._count++).toString();
  }
}
