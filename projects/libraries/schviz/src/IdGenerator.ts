export default class IdGenerator{
  private _count : any;
  constructor(){
    this.reset();
  }

  public generateId(parentId:string, $type:string, i?:number):string{
    if(!i){
      this._count[parentId] = this._count[parentId] || {};
      this._count[parentId][$type] = this._count[parentId][$type] || 0;
      i = this._count[parentId][$type]++;
    }
    return `$generated_${parentId}_${$type}_${i}`;
  }

  public reset() {
    this._count = {};
  } 
}
