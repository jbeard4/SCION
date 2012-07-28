//a small DOM helper/compatibility layer
//tested on node xmldom, rhino JDK 6 native DOM, and various browser DOMs (Firefox, Chrome, IE6+)

function getItem(nodeList,index){
    return "item" in nodeList ? nodeList.item(index) : nodeList[index];
} 

//fixme: may need to wrap APIs that return strings in String constructor for Java

module.exports = {
    getItem : getItem, 

    localName : function(node){
        return String(node.localName || node.tagName);
    },

    getAttribute : function(node,attribute){
        return String(node.getAttribute(attribute));  
    },

    getElementChildren : function(node){
        return this.filter(node,function(child){
            return child.nodeType === 1;    //element
        });
    },

    forEach : function(elem,fn){
        for (var i=0; i<elem.childNodes.length; i++) {
            fn(getItem(elem.childNodes,i));
        }
    },

    filter : function(elem,fn){
        var r = [];
        for (var i=0; i<elem.childNodes.length; i++) {
            var o = getItem(elem.childNodes,i);
            if(fn(o)){r.push(o);}
        }

        return r;
    },

    map : function(elem,fn){
        var r = [];
        for (var i=0; i<elem.childNodes.length; i++) {
            r.push(fn(getItem(elem.childNodes,i)));
        }

        return r;
    }
};
