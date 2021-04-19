declare interface ElementTimeControl {
  beginElement():void;
  beginElementAt(offset:number):void;
  endElement():void;
  endElementAt(offset:number):void;
}

declare interface SVGAnimationElement 
  extends SVGElement,
    SVGTests,
    ElementTimeControl{
}

