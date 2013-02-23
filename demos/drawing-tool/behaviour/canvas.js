function computeTDelta(oldEvent,newEvent){
    //summary:computes the offset between two events; to be later used with this.translate
    var dx = newEvent.clientX - oldEvent.clientX;
    var dy = newEvent.clientY - oldEvent.clientY;

    return {'dx':dx,'dy':dy};
}

function updateRect(node,tDelta){
    node.width.baseVal.value = tDelta.dx;
    node.height.baseVal.value = tDelta.dy;
}

function updateCircle(node,startPosition,currentPosition){
    var dxByTwo = (currentPosition.clientX - startPosition.clientX)/2;
    var dyByTwo = (currentPosition.clientY - startPosition.clientY)/2;
    node.cx.baseVal.value = startPosition.clientX + dxByTwo;
    node.cy.baseVal.value = startPosition.clientY + dyByTwo;
    node.rx.baseVal.value = dxByTwo;
    node.ry.baseVal.value = dyByTwo;
}

function updateTransformHandles(selectedNodes){
    //var sePtX = cachedBBox.width + cachedBBox.x;
    //var sePtY = cachedBBox.height + cachedBBox.y;
    var bbox = getAggregateBBox(selectedNodes);
    var sePtX = bbox.x + bbox.width, sePtY = bbox.y + bbox.height;

    //TODO: make this more general
    var sScale = scaleHandle.transform.baseVal.getItem(0);
    var newM = scaleHandle.ownerSVGElement.createSVGMatrix().translate(sePtX,sePtY).
            multiply(scaleHandle.ownerSVGElement.createSVGMatrix().rotate(-45));
    sScale.setMatrix(newM);

    var rScale = rotationHandle.transform.baseVal.getItem(0);
    newM = rotationHandle.ownerSVGElement.createSVGMatrix().translate(sePtX,sePtY);
    rScale.setMatrix(newM);
}

function getAggregateBBox(nodes){

    //get the aggregate of the bounding boxes of his children, or if he has no hier children, get his own bbox
    var newBBox;
    if(nodes.length){
        var bboxes = nodes.map(function(n){
            return transformModule.getBoundingBoxInCanvasCoordinates(n);    //FIXME: we do everything in canvas coordinates
        });

        var newBBoxX0 = Math.min.apply(this,bboxes.map(function(bbox){ return bbox.x; }));
        var newBBoxY0 = Math.min.apply(this,bboxes.map(function(bbox){ return bbox.y; }));
        var newBBoxX1 = Math.max.apply(this,bboxes.map(function(bbox){return bbox.x+bbox.width;}));
        var newBBoxY1 = Math.max.apply(this,bboxes.map(function(bbox){ return bbox.y+bbox.height;}));

        var newBBoxWidth = newBBoxX1 - newBBoxX0;
        var newBBoxHeight = newBBoxY1 - newBBoxY0;

        newBBox = {
            x : newBBoxX0,
            y : newBBoxY0,
            width : newBBoxWidth,
            height : newBBoxHeight
        };

    }else{
        newBBox = {
            x : 0,
            y : 0,
            width : 0,
            height : 0
        };
    }
    
    return newBBox;

}

function getAggregateCenterPoint(nodes){
    var bbox = getAggregateBBox(nodes);

    var cPt = {
        'x': bbox.x + (bbox.width / 2),
        'y': bbox.y + (bbox.height / 2)
    };   

    return cPt;
}


function  computeRDelta(oldEvent,newEvent,cachedCenterPoint){
    return _computeRotationAngle(cachedCenterPoint,{x:oldEvent.clientX,y:oldEvent.clientY},{x:newEvent.clientX,y:newEvent.clientY});
}

function  _computeRotationAngle(cpt,pt1,pt2){
    var a1 = _computeAngle(cpt,pt1);
    var a2 = _computeAngle(cpt,pt2);
    var angleInDegrees = a2-a1;
    return angleInDegrees; 
}

function  _computeAngle(cpt,pt){
    var angle=0;

    //put him on the trig circle
    var signedPt= {
        x:pt.x-cpt.x,
        y:pt.y-cpt.y
    };

    //put him in upper right corner
    var normalizedPt= {
        x:Math.abs(signedPt.x), 
        y:Math.abs(signedPt.y)
    };

    //compute the angle
    angle = Math.abs(Math.atan2(normalizedPt.y, normalizedPt.x));

    //get angle for signed coordinates
    if(signedPt.x<0 && signedPt.y>=0){
        angle=Math.PI-angle;
    }else if(signedPt.x<0 && signedPt.y<0){
        angle=Math.PI+angle;
    }else if(signedPt.x>=0 && signedPt.y<0){
        angle=2*Math.PI-angle;
    }
    return angle;
}
