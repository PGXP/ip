/*
 * Orange angular-swagger-ui - v0.2.7
 *
 * (C) 2015 Orange, all right reserved
 * MIT Licensed
 */
"use strict";angular.module("swaggerUi",["ng","swaggerUiTemplates"]).directive("swaggerUi",["$injector",function(a){return{restrict:"A",controller:"swaggerUiController",templateUrl:"templates/swagger-ui.html",scope:{url:"=",parser:"@?",loading:"=?",permalinks:"=?",apiExplorer:"=?",errorHandler:"=?",trustedSources:"=?",validatorUrl:"@?"},link:function(b){if(b.permalinks&&a.has("$route")){var c=a.get("$route");c.current&&c.current.$$route&&c.current.$$route.reloadOnSearch&&console.warn("AngularSwaggerUI: when using permalinks you should set reloadOnSearch=false in your route config to avoid UI being rebuilt multiple times")}b.trustedSources||a.has("$sanitize")||console.warn("AngularSwaggerUI: you must use ngSanitize OR set trusted-sources=true as directive param if swagger descriptors are loaded from trusted sources"),void 0===b.validatorUrl&&(b.validatorUrl="http://online.swagger.io/validator")}}}]).controller("swaggerUiController",["$scope","$http","$location","$q","swaggerClient","swaggerModules","swagger2JsonParser",function(a,b,c,d,e,f,g){function h(c,d){a.loading=!0;var e={method:"GET",url:c};f.execute(f.BEFORE_LOAD,e).then(function(){b(e).success(d).error(function(a,b){k({code:b,message:a})})})["catch"](k)}function i(b,c){a.loading=!1;var d={};a.parser=a.parser||"auto",f.execute(f.PARSE,a.parser,b,c,l,a.trustedSources,d).then(function(a){a?j(d):k({code:415,message:"no parser found for Swagger descriptor of type "+c+" and version "+l.swagger})})["catch"](k)}function j(b){f.execute(f.BEFORE_DISPLAY,b).then(function(){a.infos=b.infos,a.form=b.form,a.resources=b.resources})["catch"](k)}function k(b){a.loading=!1,"function"==typeof a.errorHandler?a.errorHandler(b.message,b.code):console.error(b.code,"AngularSwaggerUI: "+b.message)}var l;f.add(f.PARSE,g),a.$watch("url",function(b){a.infos={},a.resources=[],a.form={},b&&""!==b&&(a.loading,h(b,function(a,c,d){l=a,f.execute(f.BEFORE_PARSE,b,l).then(function(){var a=d()["content-type"]||"application/json",c=a.split(";")[0];i(b,c)})["catch"](k)}))}),a.expand=function(a,b){a.open=!0;for(var c=0,d=a.operations,e=d.length;e>c;c++)d[c].open=b},a.permalink=function(b){a.permalinks&&c.search("swagger",b)},a.submitExplorer=function(b){b.loading=!0,e.send(l,b,a.form[b.id]).then(function(a){b.loading=!1,b.explorerResult=a})}}]).directive("fileInput",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){b.bind("change",function(){a.$apply(function(){d.$setViewValue(b[0].files[0])})})}}}),angular.module("swaggerUi").service("swaggerClient",["$q","$http","swaggerModules",function(a,b,c){function d(a,b){var c="",d=b.data,e=b.config;if(e.params){var f=[];for(var g in e.params)f.push(g+"="+encodeURIComponent(e.params[g]));f.length>0&&(c="?"+f.join("&"))}a.resolve({url:e.url+c,response:{body:d?angular.isString(d)?d:angular.toJson(d,!0):"no content",status:b.status,headers:angular.toJson(b.headers(),!0)}})}this.send=function(e,f,g){for(var h=a.defer(),i={},j={},k=f.path,l=0,m=f.parameters||[],n=m.length;n>l;l++){var o=m[l],p=g[o.name];switch(o["in"]){case"query":p&&(i[o.name]=p);break;case"path":k=k.replace("{"+o.name+"}",encodeURIComponent(p));break;case"header":p&&(j[o.name]=p);break;case"formData":g.body=g.body||new FormData,p&&("file"===o.type&&(g.contentType=void 0),g.body.append(o.name,p));break;case"body":g.body=g.body||p}}j.Accept=g.responseType,j["Content-Type"]=g.body?g.contentType:"text/plain";var q=[e.schemes[0],"://",e.host,e.basePath||""].join(""),r={method:f.httpMethod,url:q+k,headers:j,data:g.body,params:i},s=function(a,b,e,f){var g={data:a,status:b,headers:e,config:f};c.execute(c.AFTER_EXPLORER_LOAD,g).then(function(){d(h,g)})};return c.execute(c.BEFORE_EXPLORER_LOAD,r).then(function(){b(r).success(s).error(s)}),h.promise}}]),angular.module("swaggerUi").service("swaggerModel",function(){function a(a){var b=a.$ref.split("/");return b[b.length-1]}function b(a,e,h){var i;if(h=h||{},e["default"]||e.example)i=e["default"]||e.example;else if(e.properties){i={};for(var j in e.properties)i[j]=b(a,e.properties[j],h)}else if(e.$ref){var k=f(a,e);k?(d[e.$ref]||h[e.$ref]||(h[e.$ref]=!0,d[e.$ref]=b(a,k,h)),i=d[e.$ref]||{}):console.warn("schema not found",e.$ref)}else"array"===e.type?i=[b(a,e.items,h)]:"object"===e.type?i={}:(i=c(g(e)),i=e.defaultValue||e.example||c(g(e)));return i}function c(a){var b;switch(a){case"long":case"integer":b=0;break;case"boolean":b=!1;break;case"double":case"number":b=0;break;case"string":b="string";break;case"date":b=(new Date).toISOString().split("T")[0];break;case"date-time":b=(new Date).toISOString()}return b}var d={},e={},f=this.resolveReference=function(a,b){if(b.$ref){var c=b.$ref.replace("#/","").split("/");b=a;for(var d=0,e=c.length;e>d;d++)b=b[c[d]]}return b},g=this.getType=function(a){var b=a.format;switch(b){case"int32":b=a.type;break;case"int64":b="long"}return b||a.type};this.generateSampleJson=function(a,c){var d,e=b(a,c);return e&&(d=angular.toJson(e,!0)),d};var h=0,i=this.generateModel=function(b,c,d,j){function k(a,b){return a.required&&-1!==a.required.indexOf(b)}var l="";if(j=j||{},c.properties){d=d||"Inline Model"+h++,j[d]=!0;var m=["<div><strong>"+d+" {</strong>"],n=[];for(var o in c.properties){var p=c.properties[o];if(m.push('<div class="pad"><strong>',o,'</strong> (<span class="type">'),p.properties){var q="Inline Model"+h++;m.push(q),n.push(i(b,p,q,j))}else if(p.$ref)m.push(a(p)),n.push(i(b,p,null,j));else if("array"===p.type){if(m.push("Array["),p.items.properties){var q="Inline Model"+h++;m.push(q),n.push(i(b,p,q,j))}else p.items.$ref?(m.push(a(p.items)),n.push(i(b,p.items,null,j))):m.push(g(p.items));m.push("]")}else m.push(g(p));m.push("</span>"),k(c,o)||m.push(", ","<em>optional</em>"),m.push(")"),p.description&&m.push(": ",p.description),p["enum"]&&m.push(" = ",angular.toJson(p["enum"]).replace(/,/g," or ")),m.push(",</div>")}m.pop(),m.push("</div>"),m.push("<strong>}</strong>"),m.push(n.join(""),"</div>"),l=m.join("")}else if(c.$ref){var r=a(c),s=f(b,c);if(j[r])return"";s&&(e[c.$ref]||(e[c.$ref]=i(b,s,r,j)),j[r]=!0,l=e[c.$ref])}else if("array"===c.type){var m=["<strong>Array ["],t="";if(c.items.properties){var q="Inline Model"+h++;m.push(q),t=i(b,c.items,q,j)}else c.items.$ref?(m.push(a(c.items)),t=i(b,c.items,null,j)):m.push(g(c.items));m.push("]</strong><br><br>",t),l=m.join("")}else"object"===c.type&&(l="<strong>Inline Model {<br>}</strong>");return l};this.clearCache=function(){d={},e={}}}),angular.module("swaggerUi").service("swaggerModules",["$q",function(a){function b(a,c,d,e){var f=c.shift();f?f.execute.apply(f,d).then(function(f){e=e||f,b(a,c,d,e)})["catch"](a.reject):a.resolve(e)}var c={};this.BEFORE_LOAD="BEFORE_LOAD",this.BEFORE_PARSE="BEFORE_PARSE",this.PARSE="PARSE",this.BEFORE_DISPLAY="BEFORE_DISPLAY",this.BEFORE_EXPLORER_LOAD="BEFORE_EXPLORER_LOAD",this.AFTER_EXPLORER_LOAD="AFTER_EXPLORER_LOAD",this.add=function(a,b){c[a]||(c[a]=[]),c[a].indexOf(b)<0&&c[a].push(b)},this.execute=function(){var d=Array.prototype.slice.call(arguments),e=d.splice(0,1),f=a.defer(),g=c[e]||[];return b(f,[].concat(g),d),f.promise}}]),angular.module("swaggerUi").service("swagger2JsonParser",["$q","$sce","$location","swaggerModel",function(a,b,c,d){function e(a,b,d,e){var i={},j={},k=[],m=a.info,n=c.search().swagger,o="application/json";f(a,b,m,o),g(a,k,i),h(a,k,j,i,o,n),l(k,n),e.infos=m,e.resources=k,e.form=j,d.resolve(!0)}function f(a,b,c,d){var e=angular.element('<a href="'+b+'"></a>')[0];a.schemes=[a.schemes&&a.schemes[0]||e.protocol.replace(":","")],a.host=a.host||e.host,a.consumes=a.consumes||[d],a.produces=a.produces||[d],c.scheme=a.schemes[0],c.basePath=a.basePath,c.host=a.host,c.description=m(c.description)}function g(a,b,c){var d,e,f;if(a.tags)for(d=0,e=a.tags.length;e>d;d++)f=a.tags[d],b.push(f),c[f.name]=d;else b.push({name:"default",open:!0}),c["default"]=0}function h(a,b,c,d,e,f){var g,h,i,l,n,o,p,q=0,r=0;for(g in a.paths){h=a.paths[g],i=h.parameters||[],delete h.parameters;for(l in h)n=h[l],n.id=q,n.description=m(n.description),n.produces=n.produces||a.produces,c[q]={responseType:e},n.httpMethod=l,n.path=g,j(a,n,i,c,e,q,r),k(a,n),n.tags=n.tags||["default"],o=n.tags[0],"undefined"==typeof d[o]&&(d[o]=b.length,b.push({name:o})),p=b[d[n.tags[0]]],n.open=f&&f===n.operationId||f===p.name+"*",p.operations=p.operations||[],p.operations.push(n),n.open&&(p.open=!0),q++}}function i(a,b,c){var e,f,g,h,i,j,k,l=c.parameters||[],m=[].concat(l);for(e=0,h=b.length;h>e;e++){for(i=!1,j=d.resolveReference(a,b[e]),f=0,g=l.length;g>f;f++)if(k=d.resolveReference(a,l[f]),j.name===k.name&&j["in"]===k["in"]){i=!0;break}i||m.push(j)}return m}function j(a,c,e,f,g,h,j){var k,l,n,o=c.parameters=i(a,e,c);for(k=0,l=o.length;l>k;k++)n=o[k]=d.resolveReference(a,o[k]),n.id=j,n.type=d.getType(n),n.description=m(n.description),n.items&&n.items["enum"]&&(n["enum"]=n.items["enum"],n["default"]=n.items["default"]),n.subtype=n["enum"]?"enum":n.type,f[h][n.name]=n["default"]||"",n.schema&&(n.schema.display=1,n.schema.json=d.generateSampleJson(a,n.schema),n.schema.model=b.trustAsHtml(d.generateModel(a,n.schema))),"body"===n["in"]&&(c.consumes=c.consumes||a.consumes,f[h].contentType=1===c.consumes.length?c.consumes[0]:g),j++}function k(a,c){var e,f;if(c.responses)for(e in c.responses)f=c.responses[e],f.description=m(f.description),f.schema?(f.schema.json=f.examples&&f.examples[c.produces[0]]||d.generateSampleJson(a,f.schema),"object"===f.schema.type||"array"===f.schema.type||f.schema.$ref?(f.display=1,f.schema.model=b.trustAsHtml(d.generateModel(a,f.schema))):"string"===f.schema.type&&delete f.schema,"200"===e||"201"===e?(c.responseClass=f,c.responseClass.display=1,c.responseClass.status=e,delete c.responses[e]):c.hasResponses=!0):c.hasResponses=!0}function l(a,b){var c,e,f;for(c=0;c<a.length;c++)e=a[c],f=a[c].operations,e.open=e.open||b===e.name||b===e.name+"*",(!f||f&&0===f.length)&&a.splice(c--,1);a.sort(function(a,b){return a.name>b.name?1:a.name<b.name?-1:0}),d.clearCache()}function m(a){var c=a;return"string"==typeof a&&o&&(c=b.trustAsHtml(n(a))),c}function n(a){return a&&a.replace(/&/g,"&amp;").replace(/<([^\/a-zA-Z])/g,"&lt;$1").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}var o;this.execute=function(b,c,d,f,g,h){var i=a.defer();if("2.0"===f.swagger&&("json"===b||"auto"===b&&"application/json"===d)){o=g;try{e(f,c,i,h)}catch(j){i.reject({code:500,message:"failed to parse swagger: "+j.message})}}else i.resolve(!1);return i.promise}}]),angular.module("swaggerUiTemplates",["templates/endpoint.html","templates/operation.html","templates/parameter.html","templates/response.html","templates/swagger-ui.html"]),angular.module("templates/endpoint.html",[]).run(["$templateCache",function(a){a.put("templates/endpoint.html",'<div class="clearfix"> <ul class="list-inline pull-left endpoint-heading"> <li> <h4> <a href="javascript:;" ng-click="api.open=!api.open;permalink(api.open?api.name:null)" ng-bind="api.name"></a> <span ng-if="api.description"> : <span ng-bind="api.description"></span></span> </h4> </li> </ul> <ul class="list-inline pull-right endpoint-actions"> <li> <a href="javascript:;" ng-click="api.open=!api.open;permalink(api.open?api.name:null)">open/hide</a> </li> <li> <a href="javascript:;" ng-click="expand(api);permalink(api.name)">list operations</a> </li> <li> <a href="javascript:;" ng-click="expand(api,true);permalink(api.name+\'*\')">expand operations</a> </li> </ul> </div> <ul class="list-unstyled collapse operations" ng-class="{in:api.open}"> <li ng-repeat="op in api.operations track by $index" class="operation {{op.httpMethod}}" ng-include="\'templates/operation.html\'"></li> </ul>')}]),angular.module("templates/operation.html",[]).run(["$templateCache",function(a){a.put("templates/operation.html",'<div class="heading"> <a ng-click="op.open=!op.open;permalink(op.open?op.operationId:null)" href="javascript:;"> <div class="clearfix"> <span class="http-method text-uppercase" ng-bind="op.httpMethod"></span> <span class="path" ng-bind="op.path"></span> <span class="description pull-right" ng-bind="op.summary"></span> </div> </a> </div> <div class="content collapse" ng-class="{in:op.open}"> <div ng-if="op.description"> <h5>implementation notes</h5> <p ng-bind-html="op.description"></p> </div> <form role="form" name="explorerForm" ng-submit="explorerForm.$valid&&submitExplorer(op)"> <div ng-if="op.responseClass" class="response"> <h5>response class (status {{op.responseClass.status}})</h5> <div ng-if="op.responseClass.display!==-1"> <ul class="list-inline schema"> <li><a href="javascript:;" ng-click="op.responseClass.display=0" ng-class="{active:op.responseClass.display===0}">model</a></li> <li><a href="javascript:;" ng-click="op.responseClass.display=1" ng-class="{active:op.responseClass.display===1}">model schema</a></li> </ul> <pre class="model" ng-if="op.responseClass.display===0" ng-bind-html="op.responseClass.schema.model"></pre> <pre class="model-schema" ng-if="op.responseClass.display===1" ng-bind="op.responseClass.schema.json"></pre> </div> <div ng-if="op.produces" class="content-type"> <label for="responseContentType{{op.id}}">response content type</label> <select ng-model="form[op.id].responseType" ng-options="item for item in op.produces track by item" id="responseContentType{{op.id}}" name="responseContentType{{op.id}}" required></select> </div> </div> <div ng-if="op.parameters&&op.parameters.length>0" class="table-responsive"> <h5>parameters</h5> <table class="table table-condensed parameters"> <thead> <tr> <th class="name">parameter <th class="value">value <th class="desc">description <th class="type">parameter type <th class="data">data type   <tbody> <tr ng-repeat="param in op.parameters track by $index" ng-include="\'templates/parameter.html\'">  </table> </div> <div class="table-responsive" ng-if="op.hasResponses"> <h5>response messages</h5> <table class="table responses"> <thead> <tr> <th class="code">HTTP status code <th>reason <th>response model   <tbody> <tr ng-repeat="(code, resp) in op.responses track by $index" ng-include="\'templates/response.html\'">  </table> </div> <div ng-if="apiExplorer"> <button class="btn btn-default" ng-click="op.explorerResult=false;op.hideExplorerResult=false" type="submit" ng-disabled="op.loading" ng-bind="op.loading?\'loading...\':\'try it out!\'"></button> <a class="hide-try-it" ng-if="op.explorerResult&&!op.hideExplorerResult" ng-click="op.hideExplorerResult=true" href="javascript:;">hide response</a> </div> </form> <div ng-if="op.explorerResult" ng-show="!op.hideExplorerResult"> <h5>request URL</h5> <pre ng-bind="op.explorerResult.url"></pre> <h5>response body</h5> <pre ng-bind="op.explorerResult.response.body"></pre> <h5>response code</h5> <pre ng-bind="op.explorerResult.response.status"></pre> <h5>response headers</h5> <pre ng-bind="op.explorerResult.response.headers"></pre> </div> </div>')}]),angular.module("templates/parameter.html",[]).run(["$templateCache",function(a){a.put("templates/parameter.html",'<td ng-class="{bold:param.required}"> <label for="param{{param.id}}" ng-bind="param.name"></label>  <td ng-class="{bold:param.required}"> <div ng-if="apiExplorer"> <div ng-if="param.in!==\'body\'" ng-switch="param.subtype"> <input ng-switch-when="file" type="file" file-input ng-model="form[op.id][param.name]" id="param{{param.id}}" placeholder="{{param.required?\'(required)\':\'\'}}" ng-required="param.required"> <select ng-switch-when="enum" ng-model="form[op.id][param.name]" id="param{{param.id}}"> <option ng-repeat="value in param.enum" value="{{value}}" ng-bind="value+(param.default===value?\' (default)\':\'\')" ng-selected="param.default===value"> </select> <input ng-switch-default type="text" ng-model="form[op.id][param.name]" id="param{{param.id}}" placeholder="{{param.required?\'(required)\':\'\'}}" ng-required="param.required"> </div> <div ng-if="param.in===\'body\'"> <textarea id="param{{param.id}}" ng-model="form[op.id][param.name]" ng-required="param.required"></textarea> <br> <div ng-if="op.consumes" class="content-type"> <label for="bodyContentType{{op.id}}">parameter content type</label> <select ng-model="form[op.id].contentType" id="bodyContentType{{op.id}}" name="bodyContentType{{op.id}}" ng-options="item for item in op.consumes track by item"></select> </div> </div> </div> <div ng-if="!apiExplorer"> <div ng-if="param.in!==\'body\'"> <div ng-if="param.default"><span ng-bind="param.default"></span> (default)</div> <div ng-if="param.enum"> <span ng-repeat="value in param.enum track by $index">{{value}}<span ng-if="!$last"> or </span></span> </div> <div ng-if="param.required"><strong>(required)</strong></div> </div> </div>  <td ng-class="{bold:param.required}" ng-bind-html="param.description"> <td ng-bind="param.in"> <td ng-if="param.type" ng-switch="param.type"> <span ng-switch-when="array" ng-bind="\'Array[\'+param.items.type+\']\'"></span> <span ng-switch-default ng-bind="param.type"></span>  <td ng-if="param.schema"> <ul class="list-inline schema"> <li><a href="javascript:;" ng-click="param.schema.display=0" ng-class="{active:param.schema.display===0}">model</a></li> <li><a href="javascript:;" ng-click="param.schema.display=1" ng-class="{active:param.schema.display===1}">model schema</a></li> </ul> <pre class="model" ng-if="param.schema.display===0&&param.schema.model" ng-bind-html="param.schema.model"></pre> <div class="model-schema" ng-if="param.schema.display===1&&param.schema.json"> <pre ng-bind="param.schema.json" ng-click="form[op.id][param.name]=param.schema.json" aria-described-by="help-{{param.id}}"></pre> <div id="help-{{param.id}}">click to set as parameter value</div> </div> ')}]),angular.module("templates/response.html",[]).run(["$templateCache",function(a){a.put("templates/response.html",'<td ng-bind="code"> <td ng-bind-html="resp.description"> <td> <ul ng-if="resp.schema&&resp.schema.model&&resp.schema.json" class="list-inline schema"> <li><a href="javascript:;" ng-click="resp.display=0" ng-class="{active:resp.display===0}">model</a></li> <li><a href="javascript:;" ng-click="resp.display=1" ng-class="{active:resp.display===1}">model schema</a></li> </ul> <pre class="model" ng-if="resp.display===0&&resp.schema&&resp.schema.model" ng-bind-html="resp.schema.model"></pre> <pre class="model-schema" ng-if="resp.display===1&&resp.schema&&resp.schema.json" ng-bind="resp.schema.json"></pre> ')}]),angular.module("templates/swagger-ui.html",[]).run(["$templateCache",function(a){a.put("templates/swagger-ui.html",'<div class="swagger-ui" aria-live="polite" aria-relevant="additions removals"> <div class="api-name"> <h3 ng-bind="infos.title"></h3> </div> <div class="api-description" ng-bind-html="infos.description"></div> <div class="api-infos"> <div class="api-infos-contact" ng-if="infos.contact"> <div ng-if="infos.contact.name" class="api-infos-contact-name">created by <span ng-bind="infos.contact.name"></span></div> <div ng-if="infos.contact.url" class="api-infos-contact-url">see more at <a href="{{infos.contact.url}}" ng-bind="infos.contact.url"></a></div> <a ng-if="infos.contact.email" class="api-infos-contact-url" href="mailto:{{infos.contact.email}}?subject={{infos.title}}">contact the developer</a> </div> <div class="api-infos-license" ng-if="infos.license"> <span>license: </span><a href="{{infos.license.url}}" ng-bind="infos.license.name"></a> </div> </div> <ul class="list-unstyled endpoints"> <li ng-repeat="api in resources track by $index" class="endpoint" ng-class="{active:api.open}" ng-include="\'templates/endpoint.html\'"></li> </ul> <div class="api-version clearfix" ng-if="infos"> [BASE URL: <span class="h4" ng-bind="infos.basePath"></span>, API VERSION: <span class="h4" ng-bind="infos.version"></span>, HOST: <span class="h4" ng-bind="infos.scheme"></span>://<span class="h4" ng-bind="infos.host"></span>] <a ng-if="validatorUrl!=\'false\'" target="_blank" href="{{validatorUrl}}/debug?url={{url}}"><img class="pull-right swagger-validator" ng-src="{{validatorUrl}}?url={{url}}"></a> </div> </div>')}]);