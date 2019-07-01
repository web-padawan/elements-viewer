(function(){if("undefined"===typeof self||!self.Prism||!self.document){return}/**
	 * Plugin name which is used as a class name for <pre> which is activating the plugin
	 * @type {String}
	 */var PLUGIN_NAME="line-numbers",NEW_LINE_EXP=/\n(?!$)/g,_resizeElement=function(element){var codeStyles=getStyles(element),whiteSpace=codeStyles["white-space"];if("pre-wrap"===whiteSpace||"pre-line"===whiteSpace){var codeElement=element.querySelector("code"),lineNumbersWrapper=element.querySelector(".line-numbers-rows"),lineNumberSizer=element.querySelector(".line-numbers-sizer"),codeLines=codeElement.textContent.split(NEW_LINE_EXP);if(!lineNumberSizer){lineNumberSizer=document.createElement("span");lineNumberSizer.className="line-numbers-sizer";codeElement.appendChild(lineNumberSizer)}lineNumberSizer.style.display="block";codeLines.forEach(function(line,lineNumber){lineNumberSizer.textContent=line||"\n";var lineSize=lineNumberSizer.getBoundingClientRect().height;lineNumbersWrapper.children[lineNumber].style.height=lineSize+"px"});lineNumberSizer.textContent="";lineNumberSizer.style.display="none"}},getStyles=function(element){if(!element){return null}return window.getComputedStyle?getComputedStyle(element):element.currentStyle||null};/**
	 * Regular expression used for determining line breaks
	 * @type {RegExp}
	 */window.addEventListener("resize",function(){Array.prototype.forEach.call(document.querySelectorAll("pre."+PLUGIN_NAME),_resizeElement)});Prism.hooks.add("complete",function(env){if(!env.code){return}var code=env.element,pre=code.parentNode;// works only for <code> wrapped inside <pre> (not inline)
if(!pre||!/pre/i.test(pre.nodeName)){return}// Abort if line numbers already exists
if(code.querySelector(".line-numbers-rows")){return}for(var addLineNumbers=!1,lineNumbersRegex=/(?:^|\s)line-numbers(?:\s|$)/,element=code;element;element=element.parentNode){if(lineNumbersRegex.test(element.className)){addLineNumbers=!0;break}}// only add line numbers if <code> or one of its ancestors has the `line-numbers` class
if(!addLineNumbers){return}// Remove the class 'line-numbers' from the <code>
code.className=code.className.replace(lineNumbersRegex," ");// Add the class 'line-numbers' to the <pre>
if(!lineNumbersRegex.test(pre.className)){pre.className+=" line-numbers"}var match=env.code.match(NEW_LINE_EXP),linesNum=match?match.length+1:1,lineNumbersWrapper,lines=Array(linesNum+1).join("<span></span>");lineNumbersWrapper=document.createElement("span");lineNumbersWrapper.setAttribute("aria-hidden","true");lineNumbersWrapper.className="line-numbers-rows";lineNumbersWrapper.innerHTML=lines;if(pre.hasAttribute("data-start")){pre.style.counterReset="linenumber "+(parseInt(pre.getAttribute("data-start"),10)-1)}env.element.appendChild(lineNumbersWrapper);_resizeElement(pre);Prism.hooks.run("line-numbers",env)});Prism.hooks.add("line-numbers",function(env){env.plugins=env.plugins||{};env.plugins.lineNumbers=!0});/**
	 * Global exports
	 */Prism.plugins.lineNumbers={/**
		 * Get node for provided line number
		 * @param {Element} element pre element
		 * @param {Number} number line number
		 * @return {Element|undefined}
		 */getLine:function(element,number){if("PRE"!==element.tagName||!element.classList.contains(PLUGIN_NAME)){return}var lineNumberRows=element.querySelector(".line-numbers-rows"),lineNumberStart=parseInt(element.getAttribute("data-start"),10)||1,lineNumberEnd=lineNumberStart+(lineNumberRows.children.length-1);if(number<lineNumberStart){number=lineNumberStart}if(number>lineNumberEnd){number=lineNumberEnd}var lineIndex=number-lineNumberStart;return lineNumberRows.children[lineIndex]}}})();