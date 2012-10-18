/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

var transformModule = (function(){ 


    function getBoundingBoxInArbitrarySpace(element,mat){
        var svgRoot = element.ownerSVGElement;
        var bbox = element.getBBox();

        var xs = [];
        var ys = [];

        function calc(){
            var cPtTr = cPt.matrixTransform(mat);
            xs.push(cPtTr.x);
            ys.push(cPtTr.y);
        }

        var cPt =  svgRoot.createSVGPoint();
        cPt.x = bbox.x;
        cPt.y = bbox.y;
        calc();
            
        cPt.x += bbox.width;
        calc();

        cPt.y += bbox.height;
        calc();

        cPt.x -= bbox.width;
        calc();
        
        var minX=Math.min.apply(this,xs);
        var minY=Math.min.apply(this,ys);
        var maxX=Math.max.apply(this,xs);
        var maxY=Math.max.apply(this,ys);

        return {
            "x":minX,
            "y":minY,
            "width":maxX-minX,
            "height":maxY-minY
        };
    }

    function getBoundingBoxInCanvasCoordinates (rawNode){
        return getBoundingBoxInArbitrarySpace(rawNode,rawNode.getTransformToElement(rawNode.ownerSVGElement));
    }

    function radiansToDegrees(r){
        return r*180/Math.PI;
    }

    function   _computeScaleTransform(pt1,pt2,bbox,svg){
          var ptDiff = {
            x:pt2.x-pt1.x,
            y:pt2.y-pt1.y
          };
          
          //compute his translation and scale factors
          //southeast only
          var sx = 1+ptDiff.x / bbox.width;
          var sy = 1+ptDiff.y / bbox.height;
          var tx = bbox.x * (1-sx);
          var ty = bbox.y * (1-sy);
          
          var g = svg.createSVGMatrix();
          var m  = g.translate(tx,ty).scaleNonUniform(sx,sy);         
          return m;
    }

    return {
        translate : function(rawNode,tDelta){
            var tl = rawNode.transform.baseVal;
            var t = tl.numberOfItems ? tl.getItem(0) : rawNode.ownerSVGElement.createSVGTransform();
            var m = t.matrix;
            var newM = rawNode.ownerSVGElement.createSVGMatrix().translate(tDelta.dx,tDelta.dy).multiply(m);
            t.setMatrix(newM);
            tl.initialize(t);
            return newM;
        },

        rotate : function (rawNode,d,cx,cy){
            cx = cx || 0;
            cy = cy || 0;

            var tl = rawNode.transform.baseVal;
            var t = tl.numberOfItems ? tl.getItem(0) : rawNode.ownerSVGElement.createSVGTransform();
            var m = t.matrix;
            //console.log(d);
            //console.log(cx);
            //console.log(cy);
            var newM = rawNode.ownerSVGElement.createSVGMatrix().translate(cx,cy).rotate(d).translate(-cx,-cy).multiply(m);
            t.setMatrix(newM);
            tl.initialize(t);
            return newM;
        },

        rotateRadians : function (rawNode,radians,cx,cy){
            this.rotate(rawNode,radiansToDegrees(radians),cx,cy);
        },

        scale : function (rawNode,e1,e2,bbox){
            bbox = bbox || getBoundingBoxInCanvasCoordinates(rawNode);

            var tl = rawNode.transform.baseVal;
            var t = tl.numberOfItems ? tl.getItem(0) : rawNode.ownerSVGElement.createSVGTransform();
            var m = t.matrix;

            var pt1 = {x:e1.clientX,y:e1.clientY},pt2 = {x:e2.clientX,y:e2.clientY};
            var scaleTransform = _computeScaleTransform(pt1,pt2,bbox,rawNode.ownerSVGElement);

            var newM = scaleTransform.multiply(m);
            t.setMatrix(newM);
            tl.initialize(t);
            return newM;
        },

        getBoundingBoxInCanvasCoordinates : getBoundingBoxInCanvasCoordinates
    };
})();
