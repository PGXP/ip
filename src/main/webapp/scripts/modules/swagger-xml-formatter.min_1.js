/*
 * Orange angular-swagger-ui - v0.2.7
 *
 * (C) 2015 Orange, all right reserved
 * MIT Licensed
 */
"use strict";angular.module("swaggerUi").service("swaggerUiXmlFormatter",["$q",function(a){function b(a){var b="",c=/(>)(<)(\/*)/g,d=0;return a=a.replace(c,"$1\r\n$2$3"),angular.forEach(a.split("\r\n"),function(a){var c=0,e="";a.match(/.+<\/\w[^>]*>$/)?c=0:a.match(/^<\/\w/)?0!==d&&(d-=1):c=a.match(/^<\w[^>]*[^\/]>.*$/)?1:0;for(var f=0;d>f;f++)e+="    ";b+=e+a+"\r\n",d+=c}),b}this.execute=function(c){var d=!1,e=a.defer();return c.headers&&"application/xml"===c.headers()["content-type"]&&(c.data=b(c.data),d=!0),e.resolve(d),e.promise}}]);