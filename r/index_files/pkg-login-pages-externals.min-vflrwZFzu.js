define("external/u2f-api",[],function(){"use strict";var e,t=t||{};return t.EXTENSION_ID="kmendfapggjehodndflmmgagdbamhnfd",t.MessageTypes={U2F_REGISTER_REQUEST:"u2f_register_request",U2F_REGISTER_RESPONSE:"u2f_register_response",U2F_SIGN_REQUEST:"u2f_sign_request",U2F_SIGN_RESPONSE:"u2f_sign_response",U2F_GET_API_VERSION_REQUEST:"u2f_get_api_version_request",U2F_GET_API_VERSION_RESPONSE:"u2f_get_api_version_response"},t.ErrorCodes={OK:0,OTHER_ERROR:1,BAD_REQUEST:2,CONFIGURATION_UNSUPPORTED:3,DEVICE_INELIGIBLE:4,TIMEOUT:5},t.U2fRequest,t.U2fResponse,t.Error,t.Transport,t.Transports,t.SignRequest,t.SignResponse,t.RegisterRequest,t.RegisterResponse,t.RegisteredKey,t.GetJsApiVersionResponse,t.getMessagePort=function(e){if("undefined"!=typeof chrome&&chrome.runtime){var o={type:t.MessageTypes.U2F_SIGN_REQUEST,signRequests:[]};chrome.runtime.sendMessage(t.EXTENSION_ID,o,function(){chrome.runtime.lastError?t.getIframePort_(e):t.getChromeRuntimePort_(e)})}else t.isAndroidChrome_()?t.getAuthenticatorPort_(e):t.isIosChrome_()?t.getIosPort_(e):t.getIframePort_(e)},t.isAndroidChrome_=function(){var e=navigator.userAgent;return e.indexOf("Chrome")!=-1&&e.indexOf("Android")!=-1},t.isIosChrome_=function(){return["iPhone","iPad","iPod"].indexOf(navigator.platform)>-1},t.getChromeRuntimePort_=function(e){var o=chrome.runtime.connect(t.EXTENSION_ID,{includeTlsChannelId:!0});setTimeout(function(){e(new t.WrappedChromeRuntimePort_(o))},0)},t.getAuthenticatorPort_=function(e){setTimeout(function(){e(new t.WrappedAuthenticatorPort_)},0)},t.getIosPort_=function(e){setTimeout(function(){e(new t.WrappedIosPort_)},0)},t.WrappedChromeRuntimePort_=function(e){this.port_=e},t.formatSignRequest_=function(o,r,n,i,s){if(void 0===e||e<1.1){for(var a=[],c=0;c<n.length;c++)a[c]={version:n[c].version,challenge:r,keyHandle:n[c].keyHandle,appId:o};return{type:t.MessageTypes.U2F_SIGN_REQUEST,signRequests:a,timeoutSeconds:i,requestId:s}}return{type:t.MessageTypes.U2F_SIGN_REQUEST,appId:o,challenge:r,registeredKeys:n,timeoutSeconds:i,requestId:s}},t.formatRegisterRequest_=function(o,r,n,i,s){if(void 0===e||e<1.1){for(var a=0;a<n.length;a++)n[a].appId=o;for(var c=[],a=0;a<r.length;a++)c[a]={version:r[a].version,challenge:n[0],keyHandle:r[a].keyHandle,appId:o};return{type:t.MessageTypes.U2F_REGISTER_REQUEST,signRequests:c,registerRequests:n,timeoutSeconds:i,requestId:s}}return{type:t.MessageTypes.U2F_REGISTER_REQUEST,appId:o,registerRequests:n,registeredKeys:r,timeoutSeconds:i,requestId:s}},t.WrappedChromeRuntimePort_.prototype.postMessage=function(e){this.port_.postMessage(e)},t.WrappedChromeRuntimePort_.prototype.addEventListener=function(e,t){var o=e.toLowerCase();"message"==o||"onmessage"==o?this.port_.onMessage.addListener(function(e){t({data:e})}):console.error("WrappedChromeRuntimePort only supports onMessage")},t.WrappedAuthenticatorPort_=function(){this.requestId_=-1,this.requestObject_=null},t.WrappedAuthenticatorPort_.prototype.postMessage=function(e){var o=t.WrappedAuthenticatorPort_.INTENT_URL_BASE_+";S.request="+encodeURIComponent(JSON.stringify(e))+";end";document.location=o},t.WrappedAuthenticatorPort_.prototype.getPortType=function(){return"WrappedAuthenticatorPort_"},t.WrappedAuthenticatorPort_.prototype.addEventListener=function(e,t){if("message"==e.toLowerCase()){var o=this;window.addEventListener("message",o.onRequestUpdate_.bind(o,t),!1)}else console.error("WrappedAuthenticatorPort only supports message")},t.WrappedAuthenticatorPort_.prototype.onRequestUpdate_=function(e,t){var o=JSON.parse(t.data),r=(o.intentURL,o.errorCode,null);o.hasOwnProperty("data")&&(r=JSON.parse(o.data)),e({data:r})},t.WrappedAuthenticatorPort_.INTENT_URL_BASE_="intent:#Intent;action=com.google.android.apps.authenticator.AUTHENTICATE",t.WrappedIosPort_=function(){},t.WrappedIosPort_.prototype.postMessage=function(e){var t=JSON.stringify(e),o="u2f://auth?"+encodeURI(t);location.replace(o)},t.WrappedIosPort_.prototype.getPortType=function(){return"WrappedIosPort_"},t.WrappedIosPort_.prototype.addEventListener=function(e,t){"message"!==e.toLowerCase()&&console.error("WrappedIosPort only supports message")},t.getIframePort_=function(e){var o="chrome-extension://"+t.EXTENSION_ID,r=document.createElement("iframe");r.src=o+"/u2f-comms.html",r.setAttribute("style","display:none"),document.body.appendChild(r);var n=new MessageChannel,i=function(t){"ready"==t.data?(n.port1.removeEventListener("message",i),e(n.port1)):console.error('First event on iframe port was not "ready"')};n.port1.addEventListener("message",i),n.port1.start(),r.addEventListener("load",function(){r.contentWindow.postMessage("init",o,[n.port2])})},t.EXTENSION_TIMEOUT_SEC=30,t.port_=null,t.waitingForPort_=[],t.reqCounter_=0,t.callbackMap_={},t.getPortSingleton_=function(e){t.port_?e(t.port_):(0==t.waitingForPort_.length&&t.getMessagePort(function(e){for(t.port_=e,t.port_.addEventListener("message",t.responseHandler_);t.waitingForPort_.length;)t.waitingForPort_.shift()(t.port_)}),t.waitingForPort_.push(e))},t.responseHandler_=function(e){var o=e.data,r=o.requestId;if(!r||!t.callbackMap_[r])return void console.error("Unknown or missing requestId in response.");var n=t.callbackMap_[r];delete t.callbackMap_[r],n(o.responseData)},t.sign=function(o,r,n,i,s){void 0===e?t.getApiVersion(function(a){e=void 0===a.js_api_version?0:a.js_api_version,console.log("Extension JS API Version: ",e),t.sendSignRequest(o,r,n,i,s)}):t.sendSignRequest(o,r,n,i,s)},t.sendSignRequest=function(e,o,r,n,i){t.getPortSingleton_(function(s){var a=++t.reqCounter_;t.callbackMap_[a]=n;var c=void 0!==i?i:t.EXTENSION_TIMEOUT_SEC,u=t.formatSignRequest_(e,o,r,c,a);s.postMessage(u)})},t.register=function(o,r,n,i,s){void 0===e?t.getApiVersion(function(a){e=void 0===a.js_api_version?0:a.js_api_version,console.log("Extension JS API Version: ",e),t.sendRegisterRequest(o,r,n,i,s)}):t.sendRegisterRequest(o,r,n,i,s)},t.sendRegisterRequest=function(e,o,r,n,i){t.getPortSingleton_(function(s){var a=++t.reqCounter_;t.callbackMap_[a]=n;var c=void 0!==i?i:t.EXTENSION_TIMEOUT_SEC,u=t.formatRegisterRequest_(e,r,o,c,a);s.postMessage(u)})},t.getApiVersion=function(e,o){t.getPortSingleton_(function(r){if(r.getPortType){var n;switch(r.getPortType()){case"WrappedIosPort_":case"WrappedAuthenticatorPort_":n=1.1;break;default:n=0}return void e({js_api_version:n})}var i=++t.reqCounter_;t.callbackMap_[i]=e;var s={type:t.MessageTypes.U2F_GET_API_VERSION_REQUEST,timeoutSeconds:void 0!==o?o:t.EXTENSION_TIMEOUT_SEC,requestId:i};r.postMessage(s)})},t}.bind(Object.create(null))),define("modules/clean/abuse/funcaptcha_modal",["require","exports","tslib","react","modules/clean/ajax","external/classnames","modules/clean/flux/base_store","modules/clean/flux/dispatcher","modules/clean/flux/store_listener","modules/constants/env","modules/constants/login_and_register","modules/core/browser_detection","modules/core/uri","external/react-dom","modules/core/dom"],function(e,t,o,r,n,i,s,a,c,u,l,d,h,p,_){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),r=o.__importDefault(r),n=o.__importStar(n),i=o.__importDefault(i),l=o.__importStar(l),d=o.__importStar(d),p=o.__importStar(p),_=o.__importStar(_);var f=function(e,t){a.Dispatcher.dispatch({type:e,data:t})},m=function(e,t,o){n.BackgroundRequest({url:"/log_invisible_recaptcha_event",data:{event:e,email:t,source:o}})};t.loadFuncaptchaModal=function(){var e=new g,t=c.listenToStores(E,{fs:e},function(){return{show:e.show,email:e.email,firstTime:e.firstTime,onSuccess:e.onSuccess,runningFuncaptcha:e.runningFuncaptcha,source:e.source}}),o=document.createElement("div");document.body.insertBefore(o,document.body.firstChild||null),p.render(r.default.createElement(t,null),o)},t.openFuncaptchaModal=function(e,t,o){m("FUNCAPTCHA_START",e,t),f("FUNCAPTCHA_START",{email:e,source:t,onSuccess:o})};var g=(function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.show=!1,t.email="",t.runningFuncaptcha=!1,t.firstTime=!0,t.source="",t}return o.__extends(t,e),t.prototype._new_payload=function(e){if(e&&e.action&&e.action.type)switch(e.action.type){case"FUNCAPTCHA_START":this.runningFuncaptcha=!0,this.firstTime=!1;var t=e.action.data;this.email=t.email,this.onSuccess=t.onSuccess,this.source=t.source,this.emit_change();break;case"FUNCAPTCHA_OPEN_MODAL":this.show=!0,this.emit_change();break;case"FUNCAPTCHA_FINISH":this.show=!1,this.runningFuncaptcha=!1,this.onSuccess=void 0,this.emit_change()}},t})(s.Store),E=(function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return o.__extends(t,e),t.prototype.getIFrame=function(){return p.findDOMNode(this.refs.iframe)},t.prototype.componentDidMount=function(){var e=this;window.addEventListener("message",function(t){if(t.data&&"funcaptcha-component"===t.data.origin&&h.URI.parse(t.origin).getAuthority()===u.FUNCAPTCHA_SERVER)if("loaded"===t.data.event)m("FUNCAPTCHA_CHALLENGE_SHOWN",e.props.email,e.props.source),f("FUNCAPTCHA_OPEN_MODAL");else if("played"===t.data.event){var o=e.props.show?"FUNCAPTCHA_SOLVED":"FUNCAPTCHA_SUCCESS";m(o,e.props.email,e.props.source),e.props.onSuccess(t.data.fc_token),f("FUNCAPTCHA_FINISH")}})},t.prototype.componentWillReceiveProps=function(e){if(!this.props.runningFuncaptcha&&e.runningFuncaptcha){var t=this.props.firstTime?"load":"play",o=e.source,r=void 0;r="LOGIN"===o?l.FUNCAPTCHA_PUBLIC_KEY:l.FUNCAPTCHA_REGISTER_PUBLIC_KEY;this.getIFrame().contentWindow.postMessage({event:t,origin:"funcaptcha-component",public_key:r,source:o},"*")}},t.prototype.componentDidUpdate=function(e,t){!e.show&&this.props.show?_.scroll_lock_document():e.show&&!this.props.show&&_.scroll_unlock_document()},t.prototype.render=function(){var e=new h.URI({scheme:"https",authority:u.FUNCAPTCHA_SERVER,query:{fc_nosuppress:h.URI.parse(window.location.href).getQuery().fc_nosuppress}}).toString(),t=r.default.createElement("iframe",{frameBorder:0,height:"100%",width:"100%",sandbox:"allow-scripts allow-same-origin allow-forms",className:"funcaptcha-frame",src:e,ref:"iframe",key:"iframe-id"});return r.default.createElement("div",{className:i.default({"funcaptcha-modal--hidden-firefox":!this.props.show&&d.mozilla,"funcaptcha-modal--hidden-non-firefox":!this.props.show&&!d.mozilla,"funcaptcha-modal":!0})},r.default.createElement("div",{className:"funcaptcha-div"},t))},t})(r.default.Component)}),define("modules/clean/abuse/invisible_recaptcha",["require","exports","tslib","modules/clean/abuse/recaptcha_helper","modules/clean/ajax","modules/clean/auth_event_logger","modules/clean/legacy_pyxl_controllers/ajax_form","modules/constants/login_and_register"],function(e,t,o,r,n,i,s,a){"use strict";function c(c,u,l,d,h){var p=u.find(".recaptcha_v2_challenge");if(p[0]){var _,f,m=function(e){e.reset(_),f.querySelector(".g-recaptcha-response").setAttribute("name","g-recaptcha-response-v3")},g=function(){return u.find("input[name='"+l+"']").val()},E=r.LoadRecaptcha(h,!0).then(function(t){return p.parent().show(),p.empty(),f=document.createElement("span"),p[0].appendChild(f),_=t.render(f,{action:d,size:"invisible",sitekey:a.RECAPTCHA_V3_SITE_KEY}),m(t),u.on(s.default.ERROR_EVENT,function(r,s){if(s&&s.recaptcha_response_v3){c.set_pending_state(),n.BackgroundRequest({url:"/log_invisible_recaptcha_event",data:{email:g(),event:"INVISIBLE_RECAPTCHA_START_"+d}}),"LOGIN"===d?i.AuthEventLogger.log_web_login_captcha():i.AuthEventLogger.log_web_signup_captcha();var u=document.createElement("span");p[0].appendChild(u),new Promise(function(e,o){t.execute(t.render(u,{size:"invisible",sitekey:a.INVISIBLE_RECAPTCHA_SITE_KEY,callback:e}))}).then(function(e){n.BackgroundRequest({url:"/log_invisible_recaptcha_event",data:{email:g(),event:"INVISIBLE_RECAPTCHA_PASSED_"+d}}),c.send_request(),p[0].removeChild(u)})}else s&&s.funcaptcha_response&&(c.set_pending_state(),new Promise(function(t,o){e(["modules/clean/abuse/funcaptcha_modal"],t,o)}).then(o.__importStar).then(function(e){(0,e.openFuncaptchaModal)(g(),d,function(e){var t=document.createElement("input");t.setAttribute("name","funcaptcha-response"),t.setAttribute("value",e),t.setAttribute("type","hidden"),c.$form.append(t),c.send_request(),c.$form.find("[name='funcaptcha-response']").remove()})}))}),t});c.send_request_wrapper=function(){t.invisibleRecaptchaSubmitPromise=E.then(function(e){e.execute(_).then(function(){c.send_request(),m(e)})})}}}Object.defineProperty(t,"__esModule",{value:!0}),n=o.__importStar(n),s=o.__importDefault(s),a=o.__importStar(a),t.loadRecaptchaAndSetupInvisibleRecaptcha=c}),define("modules/clean/auth/authenticator",["require","exports","tslib","modules/core/browser_detection","modules/clean/auth/u2f","modules/clean/auth/webauthn"],function(e,t,o,r,n,i){"use strict";function s(e){return!!e&&!!e[i.LATEST_PROTOCOL]}function a(e){return!r.is_mobile_or_tablet()&&(void 0===e?n.isSupportedOnBrowser():null!==l(e))}function c(e){return!r.is_mobile_or_tablet()&&null!==d(e)}function u(){return n.isSupportedOnBrowser()||i.isSupportedOnBrowser()}function l(e){return i.canRegisterAuthenticator(e[i.LATEST_PROTOCOL])?i.LATEST_PROTOCOL:n.canRegisterAuthenticator(e[n.LATEST_PROTOCOL])?n.LATEST_PROTOCOL:null}function d(e){return i.canUseAuthenticator(e[i.LATEST_PROTOCOL])?i.LATEST_PROTOCOL:n.canUseAuthenticator(e[n.LATEST_PROTOCOL])?n.LATEST_PROTOCOL:null}function h(e,t){var o;return o="register"===e?l(t):d(t),null!==o?Promise.resolve(o):u()?Promise.reject(m):Promise.reject(f)}function p(e){return h("register",e).then(function(t){return t in i.PROTOCOLS?i.register(e[t]).then(function(e){return{protocol:t,response:e}}):t in n.PROTOCOLS?n.register(e[t]).then(function(e){return{protocol:t,response:e}}):Promise.reject(m)})}function _(e){return h("sign",e).then(function(t){return t in i.PROTOCOLS?i.sign(e[t]).then(function(e){return{protocol:t,response:e}}):t in n.PROTOCOLS?n.sign(e[t]).then(function(e){return{protocol:t,response:e}}):Promise.reject(m)})}Object.defineProperty(t,"__esModule",{value:!0}),r=o.__importStar(r),n=o.__importStar(n),i=o.__importStar(i),t.PROTOCOLS=o.__assign({},n.PROTOCOLS,i.PROTOCOLS),t.isWebAuthnEnabled=s,t.canRegisterAuthenticator=a,t.canUseAuthenticator=c;var f={error:"Authenticator devices are not supported on this browser"},m={error:"Authenticator protocol not supported"};t.register=p,t.sign=_}),define("modules/clean/auth/u2f",["require","exports","tslib","external/u2f-api","modules/core/browser_detection"],function(e,t,o,r,n){"use strict";function i(){return n.chrome===!0&&parseInt(n.version,10)>=38||Boolean(l)}function s(e){return!!e&&i()}function a(e){return!!e&&i()}function c(e){return new Promise(function(t,o){(l?l:r.default).register(e.appId,e.registerRequests,e.registeredKeys,t,e.opt_timeoutSeconds)})}function u(e){return new Promise(function(t,o){(l?l:r.default).sign(e.appId,e.challenge,e.registeredKeys,t,e.opt_timeoutSeconds)})}Object.defineProperty(t,"__esModule",{value:!0}),r=o.__importDefault(r),n=o.__importStar(n);(function(e){var t;(function(e){e.bt="bt",e.ble="ble",e.nfc="nfc",e.usb="usb"})(t||(t={}));(function(e){e[e.OK=0]="OK",e[e.OTHER_ERROR=1]="OTHER_ERROR",e[e.BAD_REQUEST=2]="BAD_REQUEST",e[e.CONFIGURATION_UNSUPPORTED=3]="CONFIGURATION_UNSUPPORTED",e[e.DEVICE_INELIGIBLE=4]="DEVICE_INELIGIBLE",e[e.TIMEOUT=5]="TIMEOUT"})(e.ErrorCode||(e.ErrorCode={}))})(t.FidoU2f||(t.FidoU2f={})),t.PROTOCOLS={"u2f_js1.1":""},t.LATEST_PROTOCOL="u2f_js1.1";var l=window.u2f;t.isSupportedOnBrowser=i,t.canRegisterAuthenticator=s,t.canUseAuthenticator=a,t.register=c,t.sign=u}),define("modules/clean/auth/webauthn",["require","exports","tslib","modules/core/browser_detection"],function(e,t,o,r){"use strict";function n(){return window.PublicKeyCredential&&(r.mozilla===!0&&parseInt(r.version,10)>=60||r.chrome===!0&&parseInt(r.version,10)>=66||r.edge===!0&&parseFloat(r.version)>=17.17682)}function i(e){return!(!e||!n())&&(r.edge!==!0||e.disable_on_edge!==!0)}function s(e){if(r.edge===!0&&parseFloat(r.version)>=17.17682&&parseFloat(r.version)<17.17713||r.chrome===!0&&69===parseInt(r.version,10)){if(e.allowCredentials)for(var t=0,o=e.allowCredentials;t<o.length;t++){var n=o[t];if(n.key_format===g.COSE)return!0}return!1}return!0}function a(e){return i(e)}function c(e){return i(e)&&s(e)}function u(e){var t={challenge:p(e.challenge),timeout:e.timeout,rp:{id:e.rp.id,name:e.rp.name,icon:e.rp.icon},user:{id:p(e.user.id),name:e.user.name,displayName:e.user.displayName,icon:e.user.icon}};return void 0!==e.excludeCredentials&&(t.excludeCredentials=e.excludeCredentials.map(function(e){return{type:e.type,id:p(e.id),transports:e.transports}})),void 0!==e.pubKeyCredParams&&(t.pubKeyCredParams=e.pubKeyCredParams.map(function(e){return{type:e.type,alg:e.alg}})),void 0===e.attestation&&(t.attestation="direct"),navigator.credentials.create({publicKey:t}).then(function(e){return{response:{clientDataJSON:h(e.response.clientDataJSON),attestationObject:h(e.response.attestationObject)}}}).catch(function(e){return d(e)})}function l(e){var t={challenge:p(e.challenge),timeout:e.timeout,rpId:e.rpId,userVerification:e.userVerification,extensions:e.extensions};return void 0!==e.allowCredentials&&(t.allowCredentials=e.allowCredentials.map(function(e){var t=void 0;return e.transports&&e.transports.length>0&&(t=e.transports),{type:e.type,id:p(e.id),transports:t}})),navigator.credentials.get({publicKey:t}).then(function(e){return{id:e.id,response:{clientDataJSON:h(e.response.clientDataJSON),authenticatorData:h(e.response.authenticatorData),signature:h(e.response.signature),userHandle:e.response.userHandle&&h(e.response.userHandle)}}}).catch(function(e){return d(e)})}function d(e){if(e instanceof DOMException){var t=E[e.name];if(void 0!==t)return{errorCode:t,errorData:e.toString&&e.toString()}}return{errorCode:m.OtherError,errorData:e.toString&&e.toString()}}function h(e){return btoa(_(e)).replace(/\//g,"_").replace(/\+/g,"-")}function p(e){return f(atob(e.replace(/_/g,"/").replace(/-/g,"+")))}function _(e){return String.fromCharCode.apply(null,new Uint8Array(e))}function f(e){return Uint8Array.from(Array.prototype.map.call(e,function(e){return e.charCodeAt(0)}))}Object.defineProperty(t,"__esModule",{value:!0}),r=o.__importStar(r),t.PROTOCOLS={webauthn_wd07:""},t.LATEST_PROTOCOL="webauthn_wd07";var m;(function(e){e[e.OtherError=1]="OtherError",e[e.SecurityError=2]="SecurityError",e[e.NotAllowedError=3]="NotAllowedError",e[e.InvalidStateError=4]="InvalidStateError",e[e.Canceled=5]="Canceled",e[e.Timeout=6]="Timeout",e[e.NotSupportedError=7]="NotSupportedError"})(m||(m={}));var g,E={SecurityError:m.SecurityError,NotAllowedError:m.NotAllowedError,InvalidStateError:m.InvalidStateError,AbortError:m.Canceled,TimeoutError:m.Timeout,NotSupportedError:m.NotSupportedError};(function(e){e[e.COSE=0]="COSE",e[e.DER=1]="DER"})(g||(g={})),t.isSupportedOnBrowser=n,t.canRegisterAuthenticator=a,t.canUseAuthenticator=c,t.register=u,t.sign=l}),define("modules/clean/legacy_pyxl_controllers/login_form",["require","exports","tslib","jquery","modules/clean/abuse/invisible_recaptcha","modules/clean/ajax","modules/clean/legacy_pyxl_controllers/ajax_form","modules/clean/profile_services/profile_services_constants","modules/clean/profile_services/profile_services_link","modules/clean/sso_login_checks","modules/core/browser","modules/core/html","modules/core/i18n","modules/core/notify","modules/core/uri","modules/clean/auth/authenticator"],function(e,t,o,r,n,i,s,a,c,u,l,d,h,p,_,f){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),r=o.__importDefault(r),i=o.__importStar(i),s=o.__importDefault(s),a=o.__importDefault(a),l=o.__importStar(l),f=o.__importStar(f);var m=(function(){function t(t,i,a,c,d,h,p,f,m,g,E,S){void 0===c&&(c=!1),void 0===d&&(d=!0),void 0===h&&(h=!1),void 0===p&&(p=null),void 0===f&&(f=null),void 0===m&&(m=!0),void 0===g&&(g=!0),void 0===E&&(E=!1),void 0===S&&(S=!1);var v=this;this.loginType=i,this.inlineGoogleLoginErrors=h,this.signupTag=p,this.signupEndpoint=f,this.canRedirect=m,this.keepUrlFragment=g,this.useCurrentUri=E,this.multiLogin="multi"===this.loginType,this.pairing="pairing"===this.loginType,this.$loginForm=t.find(".login-form"),this.$rebrandLoginSubContainer=t.find(".login-form-container--subcontainer"),this.$googleAuthContainer=t.find(".login-form-container__google-div"),this.$allTwoFactorForms=t.find(".two-factor-form"),this.$twoFactorPhoneForm=t.find(".two-factor-form.2fa-phone-form"),this.$twoFactorSeckeyForm=t.find(".two-factor-form.2fa-seckey-form"),this.$loginViaEmailForm=t.find(".login-via-email-link"),this.$twoFactorForm=this.$twoFactorPhoneForm,c||new Promise(function(t,o){e(["modules/clean/unity/features/web_destiny_ui"],t,o)}).then(o.__importStar).then(function(e){new(0,e.default)(t).maybe_show_web_destiny()}),this.loginController=new s.default(this.$loginForm,this.beforeSubmit.bind(this),{should_submit_once:!0}),n.loadRecaptchaAndSetupInvisibleRecaptcha(this.loginController,this.$loginForm,"login_email","LOGIN",S),this.$loginForm.on(s.default.SUCCESS_EVENT,this.loginSuccess.bind(this)),this.$loginForm.on(s.default.ERROR_EVENT,function(e,t){return v.$loginForm.find(".login-via-email-blade-link").click(v.loginViaEmailStart.bind(v))});var w=_.URI.parse(this.$loginForm.find("input[name='cont']").val());this.useCurrentUri&&(w=_.URI.parse(l.get_href())),this.keepUrlFragment&&w.setFragment(window.location.hash.substr(1)),this.cont=w.toString(),this.twoFactorPhoneController=new s.default(this.$twoFactorPhoneForm,function(){return null},{should_submit_once:!0}),this.twoFactorSeckeyController=new s.default(this.$twoFactorSeckeyForm,function(){return null},{should_submit_once:!0}),this.twoFactorController=this.twoFactorPhoneController,this.$twoFactorPhoneForm.on(s.default.SUCCESS_EVENT,this.twoFactorSuccess.bind(this)),this.$twoFactorSeckeyForm.on(s.default.SUCCESS_EVENT,this.twoFactorSuccess.bind(this)),this.$twoFactorSeckeyForm.on(s.default.ERROR_EVENT,function(e,t){return v.$twoFactorSeckeyForm.find(".two-factor-seckey-instructions .error-msg").text(t.u2f.message_text),v.$twoFactorSeckeyForm.find(".two-factor-seckey-instructions").toggle()}),this.$twoFactorPhoneForm.find(".resend-two-factor-code").click(this.resendCode.bind(this)),this.$twoFactorSeckeyForm.find(".two-factor-use-phone-instead").click(this.usePhoneInstead.bind(this)),this.$twoFactorSeckeyForm.find(".two-factor-seckey-retry").click(this.retryU2fChallenge.bind(this)),null!=this.$loginViaEmailForm&&this.$loginViaEmailForm.click(this.loginViaEmailStart.bind(this)),this.$googleAuthContainer.find(".auth-google").click(this.googleLogin.bind(this)),this.$googleAuthContainer.find(".auth-google").prop("disabled",!1);var T=this.$twoFactorSeckeyForm.find("input[name='u2f_challenge']").val();if(T){var y=this.parseU2fChallenge(T);void 0!==y&&this.signU2fChallenge(y)}this.$loginForm.find(".sso-optout a").click(function(){return v.hideSso(!0)}),this.$loginForm.find(".login-button").attr("disabled",null),this.$loginForm.find(".login-button.disabled-button").prop("disabled",!0),d&&t.find(".login-need-help a").click(function(e){e.preventDefault();var t=r.default(e.target).attr("href"),o=encodeURIComponent(v.$loginForm.find("input[name='login_email']").val());return l.redirect(t+"?email_from_login="+o)}),this.setFocusToPassword(),new u.SsoLoginChecks(this.$loginForm.find("input[name='login_email']"),this.showSso.bind(this),this.hideSso.bind(this))}return t.prototype.ie8SafeFocus=function(e){try{e.focus()}catch(e){}},t.prototype.setFocusToPassword=function(){this.$loginForm.find("input[name='login_email']").first().val()&&this.ie8SafeFocus(this.$loginForm.find("input[name='login_password']")[0])},t.prototype.isRememberMeChecked=function(){return"on"===this.$loginForm.find("input[name='remember_me']:checked").val()},t.prototype.setFocusToTwofactor=function(){this.ie8SafeFocus(this.$twoFactorForm.find("input[name='code']").val(""))},t.prototype.googleLogin=function(){s.default.clear_errors(this.$loginForm);var e=this.isRememberMeChecked(),t=new c.ProfileServicesLinkingHandler,o=this.$googleAuthContainer.find(".auth-google").data("is-popup");t.auth_service_login_web(a.default.GOOGLE,this.googleLoginCallback.bind(this),"login_form",o,e,this.cont,this.pairing)},t.prototype.googleLoginCallback=function(e){if(e.success)p.Notify.success(h._("Log in successful! Your browser will be redirected in a few seconds.")),i.SilentBackgroundRequest({url:"/profile_services/log",data:{event_name:"login_callback_success"}}),l.redirect(this.cont?this.cont:"/h");else if(i.SilentBackgroundRequest({url:"/profile_services/log",data:{event_name:"login_callback_error"}}),"emails_do_not_match_redirect"===e.err_msg){var t=this.getThirdPartyAuthUrl(e,!0);l.redirect(t)}else"emails_do_not_match"===e.err_msg&&this.inlineGoogleLoginErrors&&!this.pairing?this.handleEmailsDoNotMatch(e):"tfa_required"===e.err_msg?this.redirectToPath(e,"/verify_code"):"not_verified"===e.err_msg?this.redirectToPath(e,"/show_password_form"):(e.localized_error&&p.Notify.error(e.localized_error),"google_login_not_allowed"!==e.err_msg&&"sso_required"!==e.err_msg||this.fillInEmail(e.profile.email))},t.prototype.handleEmailsDoNotMatch=function(e){var t=this.getThirdPartyAuthUrl(e,!1);this.$googleAuthContainer.find(".third-party-signup-link").attr("href",t),this.$googleAuthContainer.find(".google-login-error").removeClass("u-l-dn")},t.prototype.getThirdPartyAuthUrl=function(e,t){var o={fname:e.profile.given_name,lname:e.profile.family_name,email:e.profile.email,picture_url:e.profile.picture_url,refresh_token:e.refresh_token,email_sig:e.email_sig,automatic_redirect:t.toString(),cont:this.cont};return this.signupTag&&(o.signup_tag=this.signupTag),this.signupEndpoint&&(o.signup_endpoint=this.signupEndpoint),String(new _.URI({path:"/third_party_signup"}).updateQuery(o))},t.prototype.fillInEmail=function(e){this.$loginForm.find("input[name='login_email']").val(e),this.$loginForm.find("input[name='login_email']").trigger("input"),this.setFocusToPassword()},t.prototype.redirectToPath=function(e,t){var o=new _.URI({path:t}).updateQuery({cont:this.cont,remember_me:e.remember_me.toString(),pair_user:e.pair_user.toString()});l.redirect(o.toString())},t.prototype.beforeSubmit=function(){},t.prototype.showSso=function(e){this.$loginForm.find("input[name='login_password']").val(""),this.$loginForm.addClass("sso-required"),this.$rebrandLoginSubContainer.addClass("sso-required"),e&&(this.$loginForm.addClass("sso-optional"),this.$rebrandLoginSubContainer.addClass("sso-optional"))},t.prototype.hideSso=function(e){if(void 0===e&&(e=!1),this.$loginForm.removeClass("sso-required sso-optional"),this.$rebrandLoginSubContainer.removeClass("sso-required sso-optional"),e)try{this.$loginForm.find("input[name='login_password']").focus()}catch(e){}},t.prototype.browserSupportsU2f=function(e){return f.canUseAuthenticator(e)},t.prototype.showLogin=function(){this.$twoFactorForm.hide(),this.$loginForm.show(),this.$loginForm.find("input[name='login_password']").val(""),this.$googleAuthContainer.show()},t.prototype.setupTwoFactor=function(e){if(e.u2f_challenge){var t=this.parseU2fChallenge(e.u2f_challenge);void 0!==t&&(this.$twoFactorForm=this.$twoFactorSeckeyForm,this.twoFactorController=this.twoFactorSeckeyController,this.signU2fChallenge(t))}e.last_two_digits?(this.$allTwoFactorForms.addClass("hide-authenticator"),this.$allTwoFactorForms.addClass("hide-other-authentication"),this.$twoFactorPhoneForm.find(".last-two-digits").text(e.last_two_digits)):e.use_email_2fa?(this.$allTwoFactorForms.addClass("hide-sms-info"),this.$allTwoFactorForms.addClass("hide-authenticator"),this.$twoFactorPhoneForm.find(".2fa-code-sent-location").text(h._("We sent a code to %(email)s and any devices you’ve linked to this account. Enter the code to continue.").format({email:e.email})),this.$twoFactorPhoneForm.addClass("hide-recovery-url"),this.$twoFactorPhoneForm.addClass("hide-remember-me")):(this.$allTwoFactorForms.addClass("hide-sms"),this.$allTwoFactorForms.addClass("hide-other-authentication")),this.$twoFactorForm.find("input[name='remember_me']").val(e.remember_me),e.remember_me&&this.$twoFactorForm.find("a[class='twofactor_recovery_url']").attr("href",function(e,t){return _.URI.parse(t).updateQuery({remember_me:"true"}).toString()}),this.showTwoFactor()},t.prototype.showTwoFactor=function(){this.$loginForm.hide(),this.$googleAuthContainer.hide(),this.$twoFactorForm.show(),this.setFocusToTwofactor()},t.prototype.loginSuccess=function(e,t){switch(t.status){case"OK":return this.finishLogin(t);case"TWOFACTOR":return this.setupTwoFactor(t);case"TWOFACTOR_REQUIRED":return l.redirect(t.cont);case"LOGIN_VIA_EMAIL_REQUIRED":var o=t.email,r=new _.URI({path:t.cont}).updateQuery({email:o});return l.redirect(r.toString());case"SSO":return l.unsafeRedirect(t.sso_url);case"RATELIMIT":return this.fillLoginError(h._("You’ve tried to log in too many times. Please try again in a few minutes."));case"ERROR":var n=t.html_response?new d.HTML(t.message):t.message;return p.Notify.error(n),this.loginController._clear_pending(!0);case"PASSWORD_EXPIRED":return this.fillLoginError(h._("The password of the account associated with this email has expired.\n             Please login to this account and update its password before pairing."));case"EXPIRED":return l.redirect(t.cont);default:return p.Notify.error(h._("There was a problem completing this request."))}},t.prototype.twoFactorSuccess=function(e,t){switch(t.status){case"OK":return this.$twoFactorSeckeyForm.find(".seckey-loading-status").toggle(),this.finishLogin(t);case"EXPIRED":return this.switchFromTwoFactorToLoginError(t.message);case"INVALID_CREDENTIALS":return this.switchFromTwoFactorToLoginError(t.message);case"REQUIRES_ROLE":return this.switchFromTwoFactorToLoginError(t.message);case"ERROR":return p.Notify.error(t.message);default:return p.Notify.error(h._("There was a problem completing this request."))}},t.prototype.switchFromTwoFactorToLoginError=function(e){this.twoFactorController._clear_pending(!0),this.loginController._clear_pending(!0),this.showLogin(),this.fillLoginError(e),this.setFocusToPassword()},t.prototype.resendCodeSuccess=function(e){switch(e){case"OK":return p.Notify.success(h._("We sent you a code. It may take a few minutes to arrive."));case"RATELIMIT":return this.fillTwoFactorError(h._("You’ve tried to log in too many times. Please try again in a few minutes."));case"UNREACHABLE":return this.fillTwoFactorError(h._("We couldn’t reach your phone number. Are you sure it’s correct?"));case"EXPIRED":return this.fillTwoFactorError(h._("Sorry, your phone code has expired. Please log in again."));case"BADCARRIER":return this.fillTwoFactorError(h._("Unfortunately, your carrier isn’t supported at this time."));case"INVALIDNUMBER":return this.fillTwoFactorError(h._("That isn’t a valid phone number."));case"NOTAMOBILE":return this.fillTwoFactorError(h._("That phone number doesn’t appear to be a valid mobile number."));default:return p.Notify.error(h._("There was a problem completing this request."))}},t.prototype.resendCode=function(){return i.WebRequest({url:"/twofactor_resend",data:{backup:this.$twoFactorForm.find("input[name='backup']").val(),mobile_push:this.$twoFactorForm.find("input[name='mobile_push']").val()},success:this.resendCodeSuccess.bind(this),error:function(){return p.Notify.error(h._("There was a problem completing this request."))}}),!1},t.prototype.usePhoneInstead=function(){return this.$twoFactorSeckeyForm.hide(),this.$twoFactorPhoneForm.show(),this.$twoFactorForm=this.$twoFactorPhoneForm,this.$twoFactorPhoneForm.hasClass("hide-authenticator")&&this.resendCode(),this.setFocusToTwofactor(),!1},t.prototype.retryU2fChallenge=function(){var e=this;return i.WebRequest({url:"/account/twofactor/u2f_start_authentication",success:function(t){e.$twoFactorSeckeyForm.find(".two-factor-seckey-instructions").toggle();var o=e.parseU2fChallenge(t);void 0!==o&&e.signU2fChallenge(o)},error:function(){p.Notify.error(h._("There was a problem completing this request."))}}),!1},t.prototype.parseU2fChallenge=function(e){
for(var t=JSON.parse(e),o={},r=0,n=Object.keys(f.PROTOCOLS);r<n.length;r++){var i=n[r];o[i]=t[i]&&JSON.parse(t[i])}if(this.browserSupportsU2f(o))return o},t.prototype.signU2fChallenge=function(e){var t=this;f.sign(e).catch(function(e){return{error:e.toString()}}).then(function(e){t.$twoFactorSeckeyForm.find(".text-input-input").val(JSON.stringify(e)),t.$twoFactorSeckeyForm.submit()})},t.prototype.loginViaEmailStart=function(){var e=this;return s.default.clear_errors(this.$loginForm),i.WebRequest({url:"/ajax_login_via_email_start",data:{login_email:this.$loginForm.find("input[name='login_email']").val(),remember_me:this.isRememberMeChecked()},success:function(){p.Notify.success(h._("We emailed you a sign in link. Please check your inbox."))},error:function(t,o,r){return s.default.fill_errors(e.$loginForm,JSON.parse(r))}}),!1},t.prototype.fillLoginError=function(e){s.default.fill_errors(this.$loginForm,{login_email:{message_text:e}})},t.prototype.fillTwoFactorError=function(e){s.default.fill_errors(this.$twoFactorForm,{code:{message_text:e}})},t.prototype.finishLogin=function(e){var o=this.$loginForm.find("input[type='hidden'][name=refresh_token]").val(),r=this.$loginForm.find("input[type='hidden'][name=email_sig]").val();o&&r&&i.WebRequest({url:"/profile_services/link_google_service_with_user",subject_user:e.id,data:{service:a.default.GOOGLE,refresh_token:o,email_sig:r}});var n=this.multiLogin?t.MULTI_LOGIN_SUCCESS:t.LOGIN_SUCCESS;this.$loginForm.trigger(n,e),this.cont&&this.canRedirect&&l.redirect(this.cont)},t.LOGIN_SUCCESS="db:login:success",t.MULTI_LOGIN_SUCCESS="db:multilogin:success",t})();t.default=m}),define("modules/clean/sso_login_checks",["require","exports","tslib","modules/clean/ajax"],function(e,t,o,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),r=o.__importStar(r);var n=(function(){function e(e,t,o,r){void 0===r&&(r=!0),this._trigger_check_sso_state=this._trigger_check_sso_state.bind(this),this.check_sso_state=this.check_sso_state.bind(this),this.$email_input=e,this.show_sso_fn=t,this.hide_sso_fn=o,this.should_trigger_check=r,this.should_trigger_check&&(this._trigger_check_sso_state(),this.$email_input.on("input keyup change",this._trigger_check_sso_state))}return e.initClass=function(){this._sso_check_in_flight={},this._sso_check_cache={}},e.prototype._trigger_check_sso_state=function(){var e=this.$email_input.val();return this.check_sso_state(e)},e.prototype.check_sso_state=function(t){var o=this,n=t.trim();if(!n.match(/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/))return this.hide_sso_fn();var i=n.toLowerCase();return i in e._sso_check_cache?this._handle_sso_state(e._sso_check_cache[i]):e._sso_check_in_flight[i]?void 0:(e._sso_check_in_flight[i]=!0,r.WebRequest({url:"/sso_state",data:{email:n},success:function(r){return r=JSON.parse(r),delete e._sso_check_in_flight[i],e._sso_check_cache[i]=r.user_sso_state,o.should_trigger_check&&o.$email_input.val()!==t?o._trigger_check_sso_state():o._handle_sso_state(r.user_sso_state)},error:function(){return delete e._sso_check_in_flight[i],o.hide_sso_fn()}}))},e.prototype._handle_sso_state=function(e){return"required"===e?this.show_sso_fn(!1):"optional"===e?this.show_sso_fn(!0):this.hide_sso_fn()},e})();t.SsoLoginChecks=n,n.initClass()});
//# sourceMappingURL=pkg-login-pages-externals.min.js-vflSih1lz.map