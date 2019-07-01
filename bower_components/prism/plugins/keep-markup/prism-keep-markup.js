(function(self,document){if("undefined"===typeof self||!self.Prism||!self.document||!document.createRange){return}Prism.plugins.KeepMarkup=!0;Prism.hooks.add("before-highlight",function(env){if(!env.element.children.length){return}var pos=0,data=[],f=function(elt,baseNode){var o={};if(!baseNode){// Clone the original tag to keep all attributes
o.clone=elt.cloneNode(!1);o.posOpen=pos;data.push(o)}for(var i=0,l=elt.childNodes.length,child;i<l;i++){child=elt.childNodes[i];if(1===child.nodeType){// element
f(child)}else if(3===child.nodeType){// text
pos+=child.data.length}}if(!baseNode){o.posClose=pos}};f(env.element,!0);if(data&&data.length){// data is an array of all existing tags
env.keepMarkup=data}});Prism.hooks.add("after-highlight",function(env){if(env.keepMarkup&&env.keepMarkup.length){var walk=function(elt,nodeState){for(var i=0,l=elt.childNodes.length,child;i<l;i++){child=elt.childNodes[i];if(1===child.nodeType){// element
if(!walk(child,nodeState)){return!1}}else if(3===child.nodeType){// text
if(!nodeState.nodeStart&&nodeState.pos+child.data.length>nodeState.node.posOpen){// We found the start position
nodeState.nodeStart=child;nodeState.nodeStartPos=nodeState.node.posOpen-nodeState.pos}if(nodeState.nodeStart&&nodeState.pos+child.data.length>=nodeState.node.posClose){// We found the end position
nodeState.nodeEnd=child;nodeState.nodeEndPos=nodeState.node.posClose-nodeState.pos}nodeState.pos+=child.data.length}if(nodeState.nodeStart&&nodeState.nodeEnd){// Select the range and wrap it with the clone
var range=document.createRange();range.setStart(nodeState.nodeStart,nodeState.nodeStartPos);range.setEnd(nodeState.nodeEnd,nodeState.nodeEndPos);nodeState.node.clone.appendChild(range.extractContents());range.insertNode(nodeState.node.clone);range.detach();// Process is over
return!1}}return!0};// For each tag, we walk the DOM to reinsert it
env.keepMarkup.forEach(function(node){walk(env.element,{node:node,pos:0})});// Store new highlightedCode for later hooks calls
env.highlightedCode=env.element.innerHTML}})})(self,document);