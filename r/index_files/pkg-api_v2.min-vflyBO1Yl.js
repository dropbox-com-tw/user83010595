define("modules/clean/api_v2/client_base",["require","exports","tslib","jquery","modules/clean/api_v2/error","modules/clean/devtools/panels/performance/perf_hub_actions","modules/constants/debug","modules/constants/request","modules/core/browser","modules/core/cookies","modules/core/uri"],function(e,r,t,n,o,s,i,u,a,c,p){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),n=t.__importDefault(n),i=t.__importStar(i),a=t.__importStar(a);var l;(function(e){e.DropboxApiArg="Dropbox-API-Arg",e.DropboxApiSelectAdmin="Dropbox-API-Select-Admin",e.DropboxPathRoot="X-Dropbox-Path-Root",e.DropboxUid="X-Dropbox-Uid",e.CsrfToken="X-CSRF-Token"})(l=r.ApiV2HeaderNames||(r.ApiV2HeaderNames={}));var d=(function(){function e(e,r){if(void 0===e&&(e="async"),"async"===e){if(void 0!==r)throw new Error("syncMode is 'async'; do not specify a syncTimeout")}else{if("syncOrServiceWorker"===e)throw new Error("syncOrServiceWorker mode not yet supported");if(void 0===r)throw new Error("syncMode is "+e+", but syncTimeout was not specified");if(r<=0)throw new Error("syncMode is "+e+", and you passed syncTimeout="+r+". syncTimeout must be a positive number")}this.syncMode=e,this.syncTimeout=r}return e.prototype._upload=function(e,r,n,o){var s=this.uriStringAndPath(e),i=s.uriString,u=s.path,a=t.__assign((c={},c[l.CsrfToken]=this.csrfToken(),c[l.DropboxApiArg]=JSON.stringify(r),c),this._headers(o));return this.executeRpc(i,u,a,n,"application/octet-stream");var c},e.prototype._rpc=function(e,r,n){var o=this.uriStringAndPath(e),s=o.uriString,i=o.path,u=t.__assign((c={},c[l.CsrfToken]=this.csrfToken(),c),this._headers(n)),a=JSON.stringify(r||null);return this.executeRpc(s,i,u,a);var c},e.prototype.csrfToken=function(){return c.Cookies.read("__Host-js_csrf")||""},e.prototype.uriStringAndPath=function(e){var r="client-web.dropbox.com"===a.get_hostname()?"client-web.dropbox.com":"www.dropbox.com",t=new p.URI({scheme:"https",authority:r,path:"/2/"+e});return i.CPROFILE_ENABLED&&t.setQuery({cProfile:i.CPROFILE_PARAMETER,parent_request_id:u.REQUEST_ID}),{uriString:t.toString(),path:t.getPath()}},e.prototype.executeRpc=function(e,r,t,n,o){switch(void 0===n&&(n=""),void 0===o&&(o="application/json"),this.syncMode){case"async":return this.executeAsyncRpc(e,r,t,n,o);case"sync":return this.executeSyncRpc(e,r,t,n,o);case"syncOrServiceWorker":throw new Error("syncOrServiceWorker mode not yet supported")}},e.prototype.executeAsyncRpc=function(r,t,o,s,i){return new Promise(function(u,a){return n.default.ajax({type:"POST",url:r,contentType:i,headers:o,data:s}).done(function(r,n,o){return u(e.processXHRSuccess(t,r,n,o))}).fail(function(r){return a(e.processXHRError(r))})})},e.prototype.executeSyncRpc=function(r,t,o,s,i){var u=Promise.resolve(null),a=function(r,n,o){u=Promise.resolve(e.processXHRSuccess(t,r,n,o))},c=function(r){u=Promise.reject(e.processXHRError(r))};return n.default.ajax({type:"POST",url:r,contentType:i,headers:o,data:s,async:!1,timeout:this.syncTimeout,success:a,error:c}),u},e.processXHRSuccess=function(e,r,t,n){return i.CPROFILE_ENABLED&&s.PerfHubActions.add_ajax_profile(n,e),null!=n.responseText?JSON.parse(n.responseText):null},e.processXHRError=function(e){return o.ApiError.parseResponse(e.status,e.getAllResponseHeaders(),e.responseText)},e})();r.ApiV2ClientBase=d,d.prototype.ns=function(e){var r=this;return{rpc:function(t,n,o){return r._rpc(e+"/"+t,n,o)},upload:function(t,n,o,s){return r._upload(e+"/"+t,n,o,s)}}}}),define("modules/clean/api_v2/error",["require","exports","tslib","modules/core/html","modules/core/i18n","external/lodash"],function(e,r,t,n,o,s){"use strict";function i(e){return function(r){if(r instanceof u)return e(r);throw r}}Object.defineProperty(r,"__esModule",{value:!0}),s=t.__importStar(s);var u=(function(){function e(e){this.message=e}return e.parseResponse=function(r,t,i,u){void 0===u&&(u=null);var a="";null==u&&(u=r in f?f[r]:r>=500?l:e);var c={};if(t){var p=t.split("\n").map(function(e){return e.split(": ")});c=s.zipObject(s.map(p,s.first),s.map(p,function(e){return null!=e&&e[1]}))}var d={raw:{status:r,headerString:t,responseBody:i},summary:null,error:{},headers:c};try{var _=JSON.parse(i)||{};d.error=_.error,d.summary=_.error_summary,a=null!=_.user_message?_.user_message.text:""}catch(e){}429!==r||a||(a=o._('Folder updates in progress — please try again later.\n<a href="/help/9259" target="_blank" rel="noopener">Learn more</a>'));var h=void 0;return a&&(h=new n.HTML(a)),s.assignIn(new u(h),d)},e})();r.ApiError=u;var a=(function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return t.__extends(r,e),r})(u);r.BadRequestError=a;var c=(function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return t.__extends(r,e),r})(u);r.AuthError=c;var p=(function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return t.__extends(r,e),r})(u);r.AppError=p;var l=(function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return t.__extends(r,e),r})(u);r.ServerError=l;var d=(function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return t.__extends(r,e),r})(u);r.RateLimitError=d,r.catchApiError=i;var f={400:a,401:c,409:p,429:d}}),define("modules/clean/api_v2/user_client",["require","exports","tslib","modules/clean/api_v2/client_base","modules/clean/viewer"],function(e,r,t,n,o){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=(function(e){function r(r,t){return e.call(this,r,t)||this}return t.__extends(r,e),r.prototype._headers=function(e){var r=o.Viewer.get_viewer().get_user_by_id(e.subjectUserId);return t.__assign((s={},s[n.ApiV2HeaderNames.DropboxUid]=String(r.id),s[n.ApiV2HeaderNames.DropboxPathRoot]=String(r.root_ns_id),s),e.headers);var s},r})(n.ApiV2ClientBase);r.UserApiV2Client=s});
//# sourceMappingURL=pkg-api_v2.min.js-vflvgNq0X.map