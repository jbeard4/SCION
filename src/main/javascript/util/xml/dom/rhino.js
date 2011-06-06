/**
 * Rhino's default Java bindings are great, but sometimes they are not great enough. 
 * Also, sometimes the Java XML API is more cumbersome, pedantic and precise than what you find in the browser (e.g. handling of getElementById).
 * This module defines wrappers for Document and Node classes to expose a dom-like interface.
 * It is not meant to be a complete DOM implementation, but rather simply to implement a compatibility layer for the doc2model module.
 */
define(["util/xml/rhino","util/xpath/rhino"],function(xml,xpath){
	function Document(doc){
		this.doc = doc;
	}

	Document.prototype = {
		getElementById : function(id){
			var nodes = xpath("//*[@id = '"+id+"']",this.doc.documentElement);

			return nodes.length ? new Node(nodes[0]) : null;
		},
		createElementNS : function(ns,name){
			return new Node(this.doc.createElementNS(ns,name));
		},
		get documentElement(){return new Node(this.doc.documentElement);}
	};

	function Node(node){
		this.node = node;
	}

	Node.prototype = {
		getAttributeNS : function(ns,name){
			return String(this.node.getAttributeNS(ns,name));
		},
		setAttributeNS : function(ns,name,value){
			this.node.setAttributeNS(ns,name,value);
		},
		appendChild : function(childNode){
			this.node.appendChild(childNode.node);
		},
		get localName(){return String(this.node.localName)},
		get childNodes(){
			toReturn = [];
			childNodes = this.node.childNodes;
			for(var i = 0; i < childNodes.length; i++){
				var node = childNodes.item(i);
				if(node.tagName){
					toReturn.push(new Node(node));
				}
			}
			return toReturn;
		},
		get parentNode(){
			parentNode = this.node.parentNode;
			if(parentNode && parentNode instanceof Packages.org.w3c.dom.Element){
				return new Node(parentNode);
			}else{
				return null;
			}
		}
		
	};

	return {
		Node : Node,
		Document : Document
	}
});
