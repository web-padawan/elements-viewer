(function(){if(("undefined"===typeof self||!self.Prism)&&("undefined"===typeof global||!global.Prism)){return}var options={classMap:{}};Prism.plugins.customClass={map:function map(cm){options.classMap=cm},prefix:function prefix(string){options.prefixString=string}};Prism.hooks.add("wrap",function(env){if(!options.classMap&&!options.prefixString){return}env.classes=env.classes.map(function(c){return(options.prefixString||"")+(options.classMap[c]||c)})})})();