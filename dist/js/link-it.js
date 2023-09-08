(()=>{"use strict";function t(t){return t.split("-")[1]}function e(t){return"y"===t?"height":"width"}function n(t){return t.split("-")[0]}function i(t){return["top","bottom"].includes(n(t))?"x":"y"}function l(l,o,a){let{reference:r,floating:s}=l;const c=r.x+r.width/2-s.width/2,u=r.y+r.height/2-s.height/2,f=i(o),d=e(f),p=r[d]/2-s[d]/2,h="x"===f;let m;switch(n(o)){case"top":m={x:c,y:r.y-s.height};break;case"bottom":m={x:c,y:r.y+r.height};break;case"right":m={x:r.x+r.width,y:u};break;case"left":m={x:r.x-s.width,y:u};break;default:m={x:r.x,y:r.y}}switch(t(o)){case"start":m[f]-=p*(a&&h?-1:1);break;case"end":m[f]+=p*(a&&h?-1:1)}return m}const o=async(t,e,n)=>{const{placement:i="bottom",strategy:o="absolute",middleware:a=[],platform:r}=n,s=a.filter(Boolean),c=await(null==r.isRTL?void 0:r.isRTL(e));let u=await r.getElementRects({reference:t,floating:e,strategy:o}),{x:f,y:d}=l(u,i,c),p=i,h={},m=0;for(let n=0;n<s.length;n++){const{name:a,fn:y}=s[n],{x,y:g,data:v,reset:w}=await y({x:f,y:d,initialPlacement:i,placement:p,strategy:o,middlewareData:h,rects:u,platform:r,elements:{reference:t,floating:e}});f=null!=x?x:f,d=null!=g?g:d,h={...h,[a]:{...h[a],...v}},w&&m<=50&&(m++,"object"==typeof w&&(w.placement&&(p=w.placement),w.rects&&(u=!0===w.rects?await r.getElementRects({reference:t,floating:e,strategy:o}):w.rects),({x:f,y:d}=l(u,p,c))),n=-1)}return{x:f,y:d,placement:p,strategy:o,middlewareData:h}};function a(t){return"number"!=typeof t?function(t){return{top:0,right:0,bottom:0,left:0,...t}}(t):{top:t,right:t,bottom:t,left:t}}function r(t){return{...t,top:t.y,left:t.x,right:t.x+t.width,bottom:t.y+t.height}}async function s(t,e){var n;void 0===e&&(e={});const{x:i,y:l,platform:o,rects:s,elements:c,strategy:u}=t,{boundary:f="clippingAncestors",rootBoundary:d="viewport",elementContext:p="floating",altBoundary:h=!1,padding:m=0}=e,y=a(m),x=c[h?"floating"===p?"reference":"floating":p],g=r(await o.getClippingRect({element:null==(n=await(null==o.isElement?void 0:o.isElement(x)))||n?x:x.contextElement||await(null==o.getDocumentElement?void 0:o.getDocumentElement(c.floating)),boundary:f,rootBoundary:d,strategy:u})),v="floating"===p?{...s.floating,x:i,y:l}:s.reference,w=await(null==o.getOffsetParent?void 0:o.getOffsetParent(c.floating)),_=await(null==o.isElement?void 0:o.isElement(w))&&await(null==o.getScale?void 0:o.getScale(w))||{x:1,y:1},b=r(o.convertOffsetParentRelativeRectToViewportRelativeRect?await o.convertOffsetParentRelativeRectToViewportRelativeRect({rect:v,offsetParent:w,strategy:u}):v);return{top:(g.top-b.top+y.top)/_.y,bottom:(b.bottom-g.bottom+y.bottom)/_.y,left:(g.left-b.left+y.left)/_.x,right:(b.right-g.right+y.right)/_.x}}Math.min,Math.max;const c=["top","right","bottom","left"],u=(c.reduce(((t,e)=>t.concat(e,e+"-start",e+"-end")),[]),{left:"right",right:"left",bottom:"top",top:"bottom"});function f(t){return t.replace(/left|right|bottom|top/g,(t=>u[t]))}function d(n,l,o){void 0===o&&(o=!1);const a=t(n),r=i(n),s=e(r);let c="x"===r?a===(o?"end":"start")?"right":"left":"start"===a?"bottom":"top";return l.reference[s]>l.floating[s]&&(c=f(c)),{main:c,cross:f(c)}}const p={start:"end",end:"start"};function h(t){return t.replace(/start|end/g,(t=>p[t]))}const m=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(i){var l;const{placement:o,middlewareData:a,rects:r,initialPlacement:c,platform:u,elements:p}=i,{mainAxis:m=!0,crossAxis:y=!0,fallbackPlacements:x,fallbackStrategy:g="bestFit",fallbackAxisSideDirection:v="none",flipAlignment:w=!0,..._}=e,b=n(o),k=n(c)===c,C=await(null==u.isRTL?void 0:u.isRTL(p.floating)),R=x||(k||!w?[f(c)]:function(t){const e=f(t);return[h(t),e,h(e)]}(c));x||"none"===v||R.push(...function(e,i,l,o){const a=t(e);let r=function(t,e,n){const i=["left","right"],l=["right","left"],o=["top","bottom"],a=["bottom","top"];switch(t){case"top":case"bottom":return n?e?l:i:e?i:l;case"left":case"right":return e?o:a;default:return[]}}(n(e),"start"===l,o);return a&&(r=r.map((t=>t+"-"+a)),i&&(r=r.concat(r.map(h)))),r}(c,w,v,C));const E=[c,...R],T=await s(i,_),L=[];let O=(null==(l=a.flip)?void 0:l.overflows)||[];if(m&&L.push(T[b]),y){const{main:t,cross:e}=d(o,r,C);L.push(T[t],T[e])}if(O=[...O,{placement:o,overflows:L}],!L.every((t=>t<=0))){var A,S;const t=((null==(A=a.flip)?void 0:A.index)||0)+1,e=E[t];if(e)return{data:{index:t,overflows:O},reset:{placement:e}};let n=null==(S=O.filter((t=>t.overflows[0]<=0)).sort(((t,e)=>t.overflows[1]-e.overflows[1]))[0])?void 0:S.placement;if(!n)switch(g){case"bestFit":{var W;const t=null==(W=O.map((t=>[t.placement,t.overflows.filter((t=>t>0)).reduce(((t,e)=>t+e),0)])).sort(((t,e)=>t[1]-e[1]))[0])?void 0:W[0];t&&(n=t);break}case"initialPlacement":n=c}if(o!==n)return{reset:{placement:n}}}return{}}}};const y=function(e){return void 0===e&&(e=0),{name:"offset",options:e,async fn(l){const{x:o,y:a}=l,r=await async function(e,l){const{placement:o,platform:a,elements:r}=e,s=await(null==a.isRTL?void 0:a.isRTL(r.floating)),c=n(o),u=t(o),f="x"===i(o),d=["left","top"].includes(c)?-1:1,p=s&&f?-1:1,h="function"==typeof l?l(e):l;let{mainAxis:m,crossAxis:y,alignmentAxis:x}="number"==typeof h?{mainAxis:h,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...h};return u&&"number"==typeof x&&(y="end"===u?-1*x:x),f?{x:y*p,y:m*d}:{x:m*d,y:y*p}}(l,e);return{x:o+r.x,y:a+r.y,data:r}}}};function x(t){var e;return(null==(e=t.ownerDocument)?void 0:e.defaultView)||window}function g(t){return x(t).getComputedStyle(t)}function v(t){return t instanceof x(t).Node}function w(t){return v(t)?(t.nodeName||"").toLowerCase():""}let b;function k(){if(b)return b;const t=navigator.userAgentData;return t&&Array.isArray(t.brands)?(b=t.brands.map((t=>t.brand+"/"+t.version)).join(" "),b):navigator.userAgent}function C(t){return t instanceof x(t).HTMLElement}function R(t){return t instanceof x(t).Element}function E(t){return"undefined"!=typeof ShadowRoot&&(t instanceof x(t).ShadowRoot||t instanceof ShadowRoot)}function T(t){const{overflow:e,overflowX:n,overflowY:i,display:l}=g(t);return/auto|scroll|overlay|hidden|clip/.test(e+i+n)&&!["inline","contents"].includes(l)}function L(t){return["table","td","th"].includes(w(t))}function O(t){const e=/firefox/i.test(k()),n=g(t),i=n.backdropFilter||n.WebkitBackdropFilter;return"none"!==n.transform||"none"!==n.perspective||!!i&&"none"!==i||e&&"filter"===n.willChange||e&&!!n.filter&&"none"!==n.filter||["transform","perspective"].some((t=>n.willChange.includes(t)))||["paint","layout","strict","content"].some((t=>{const e=n.contain;return null!=e&&e.includes(t)}))}function A(){return/^((?!chrome|android).)*safari/i.test(k())}function S(t){return["html","body","#document"].includes(w(t))}const W=Math.min,P=Math.max,$=Math.round;function D(t){const e=g(t);let n=parseFloat(e.width),i=parseFloat(e.height);const l=C(t),o=l?t.offsetWidth:n,a=l?t.offsetHeight:i,r=$(n)!==o||$(i)!==a;return r&&(n=o,i=a),{width:n,height:i,fallback:r}}function F(t){return R(t)?t:t.contextElement}const V={x:1,y:1};function N(t){const e=F(t);if(!C(e))return V;const n=e.getBoundingClientRect(),{width:i,height:l,fallback:o}=D(e);let a=(o?$(n.width):n.width)/i,r=(o?$(n.height):n.height)/l;return a&&Number.isFinite(a)||(a=1),r&&Number.isFinite(r)||(r=1),{x:a,y:r}}function B(t,e,n,i){var l,o;void 0===e&&(e=!1),void 0===n&&(n=!1);const a=t.getBoundingClientRect(),s=F(t);let c=V;e&&(i?R(i)&&(c=N(i)):c=N(t));const u=s?x(s):window,f=A()&&n;let d=(a.left+(f&&(null==(l=u.visualViewport)?void 0:l.offsetLeft)||0))/c.x,p=(a.top+(f&&(null==(o=u.visualViewport)?void 0:o.offsetTop)||0))/c.y,h=a.width/c.x,m=a.height/c.y;if(s){const t=x(s),e=i&&R(i)?x(i):i;let n=t.frameElement;for(;n&&i&&e!==t;){const t=N(n),e=n.getBoundingClientRect(),i=getComputedStyle(n);e.x+=(n.clientLeft+parseFloat(i.paddingLeft))*t.x,e.y+=(n.clientTop+parseFloat(i.paddingTop))*t.y,d*=t.x,p*=t.y,h*=t.x,m*=t.y,d+=e.x,p+=e.y,n=x(n).frameElement}}return r({width:h,height:m,x:d,y:p})}function M(t){return((v(t)?t.ownerDocument:t.document)||window.document).documentElement}function j(t){return R(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function H(t){return B(M(t)).left+j(t).scrollLeft}function z(t){if("html"===w(t))return t;const e=t.assignedSlot||t.parentNode||E(t)&&t.host||M(t);return E(e)?e.host:e}function X(t){const e=z(t);return S(e)?e.ownerDocument.body:C(e)&&T(e)?e:X(e)}function U(t,e){var n;void 0===e&&(e=[]);const i=X(t),l=i===(null==(n=t.ownerDocument)?void 0:n.body),o=x(i);return l?e.concat(o,o.visualViewport||[],T(i)?i:[]):e.concat(i,U(i))}function Y(t,e,n){let i;if("viewport"===e)i=function(t,e){const n=x(t),i=M(t),l=n.visualViewport;let o=i.clientWidth,a=i.clientHeight,r=0,s=0;if(l){o=l.width,a=l.height;const t=A();(!t||t&&"fixed"===e)&&(r=l.offsetLeft,s=l.offsetTop)}return{width:o,height:a,x:r,y:s}}(t,n);else if("document"===e)i=function(t){const e=M(t),n=j(t),i=t.ownerDocument.body,l=P(e.scrollWidth,e.clientWidth,i.scrollWidth,i.clientWidth),o=P(e.scrollHeight,e.clientHeight,i.scrollHeight,i.clientHeight);let a=-n.scrollLeft+H(t);const r=-n.scrollTop;return"rtl"===g(i).direction&&(a+=P(e.clientWidth,i.clientWidth)-l),{width:l,height:o,x:a,y:r}}(M(t));else if(R(e))i=function(t,e){const n=B(t,!0,"fixed"===e),i=n.top+t.clientTop,l=n.left+t.clientLeft,o=C(t)?N(t):{x:1,y:1};return{width:t.clientWidth*o.x,height:t.clientHeight*o.y,x:l*o.x,y:i*o.y}}(e,n);else{const n={...e};if(A()){var l,o;const e=x(t);n.x-=(null==(l=e.visualViewport)?void 0:l.offsetLeft)||0,n.y-=(null==(o=e.visualViewport)?void 0:o.offsetTop)||0}i=n}return r(i)}function q(t,e){return C(t)&&"fixed"!==g(t).position?e?e(t):t.offsetParent:null}function I(t,e){const n=x(t);if(!C(t))return n;let i=q(t,e);for(;i&&L(i)&&"static"===g(i).position;)i=q(i,e);return i&&("html"===w(i)||"body"===w(i)&&"static"===g(i).position&&!O(i))?n:i||function(t){let e=z(t);for(;C(e)&&!S(e);){if(O(e))return e;e=z(e)}return null}(t)||n}function G(t,e,n){const i=C(e),l=M(e),o=B(t,!0,"fixed"===n,e);let a={scrollLeft:0,scrollTop:0};const r={x:0,y:0};if(i||!i&&"fixed"!==n)if(("body"!==w(e)||T(l))&&(a=j(e)),C(e)){const t=B(e,!0);r.x=t.x+e.clientLeft,r.y=t.y+e.clientTop}else l&&(r.x=H(l));return{x:o.left+a.scrollLeft-r.x,y:o.top+a.scrollTop-r.y,width:o.width,height:o.height}}const J={getClippingRect:function(t){let{element:e,boundary:n,rootBoundary:i,strategy:l}=t;const o=[..."clippingAncestors"===n?function(t,e){const n=e.get(t);if(n)return n;let i=U(t).filter((t=>R(t)&&"body"!==w(t))),l=null;const o="fixed"===g(t).position;let a=o?z(t):t;for(;R(a)&&!S(a);){const t=g(a),e=O(a);"fixed"===t.position?l=null:(o?e||l:e||"static"!==t.position||!l||!["absolute","fixed"].includes(l.position))?l=t:i=i.filter((t=>t!==a)),a=z(a)}return e.set(t,i),i}(e,this._c):[].concat(n),i],a=o[0],r=o.reduce(((t,n)=>{const i=Y(e,n,l);return t.top=P(i.top,t.top),t.right=W(i.right,t.right),t.bottom=W(i.bottom,t.bottom),t.left=P(i.left,t.left),t}),Y(e,a,l));return{width:r.right-r.left,height:r.bottom-r.top,x:r.left,y:r.top}},convertOffsetParentRelativeRectToViewportRelativeRect:function(t){let{rect:e,offsetParent:n,strategy:i}=t;const l=C(n),o=M(n);if(n===o)return e;let a={scrollLeft:0,scrollTop:0},r={x:1,y:1};const s={x:0,y:0};if((l||!l&&"fixed"!==i)&&(("body"!==w(n)||T(o))&&(a=j(n)),C(n))){const t=B(n);r=N(n),s.x=t.x+n.clientLeft,s.y=t.y+n.clientTop}return{width:e.width*r.x,height:e.height*r.y,x:e.x*r.x-a.scrollLeft*r.x+s.x,y:e.y*r.y-a.scrollTop*r.y+s.y}},isElement:R,getDimensions:function(t){return D(t)},getOffsetParent:I,getDocumentElement:M,getScale:N,async getElementRects(t){let{reference:e,floating:n,strategy:i}=t;const l=this.getOffsetParent||I,o=this.getDimensions;return{reference:G(e,await l(n),i),floating:{x:0,y:0,...await o(n)}}},getClientRects:t=>Array.from(t.getClientRects()),isRTL:t=>"rtl"===g(t).direction};const K=function(t,e,n,i,l,o,a,r){var s,c="function"==typeof t?t.options:t;if(e&&(c.render=e,c.staticRenderFns=n,c._compiled=!0),i&&(c.functional=!0),o&&(c._scopeId="data-v-"+o),a?(s=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),l&&l.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},c._ssrRegister=s):l&&(s=r?function(){l.call(this,(c.functional?this.parent:this).$root.$options.shadowRoot)}:l),s)if(c.functional){c._injectStyles=s;var u=c.render;c.render=function(t,e){return s.call(e),u(t,e)}}else{var f=c.beforeCreate;c.beforeCreate=f?[].concat(f,s):[s]}return{exports:t,options:c}}({mixins:[Fieldtype,{methods:{positionOptions:function(t,e,n){var i=n.width;t.style.width=i;var l=function(t,e,n,i){void 0===i&&(i={});const{ancestorScroll:l=!0,ancestorResize:o=!0,elementResize:a=!0,animationFrame:r=!1}=i,s=l&&!r,c=s||o?[...R(t)?U(t):t.contextElement?U(t.contextElement):[],...U(e)]:[];c.forEach((t=>{s&&t.addEventListener("scroll",n,{passive:!0}),o&&t.addEventListener("resize",n)}));let u,f=null;a&&(f=new ResizeObserver((()=>{n()})),R(t)&&!r&&f.observe(t),R(t)||!t.contextElement||r||f.observe(t.contextElement),f.observe(e));let d=r?B(t):null;return r&&function e(){const i=B(t);!d||i.x===d.x&&i.y===d.y&&i.width===d.width&&i.height===d.height||n(),d=i,u=requestAnimationFrame(e)}(),n(),()=>{var t;c.forEach((t=>{s&&t.removeEventListener("scroll",n),o&&t.removeEventListener("resize",n)})),null==(t=f)||t.disconnect(),f=null,r&&cancelAnimationFrame(u)}}(e.$refs.toggle,t,(function(){((t,e,n)=>{const i=new Map,l={platform:J,...n},a={...l.platform,_c:i};return o(t,e,{...l,platform:a})})(e.$refs.toggle,t,{placement:"bottom",middleware:[y({mainAxis:0,crossAxis:-1}),m()]}).then((function(e){var n=e.x,i=e.y;Object.assign(t.style,{left:"".concat(Math.round(n),"px"),top:"".concat(Math.round(i),"px")})}))}));this.$once("hook:destroyed",l)}}}],data:function(){return{internal:{type:null,url:null,newWindow:null,taxonomy:null,container:null,collection:null,asset:null,term:null,entry:null,text:null,aria:null,title:null,append:null},uuid:this._uid}},mounted:function(){var t=this;null!==this.value&&Object.keys(this.value).forEach((function(e){t.internal[e]=t.value[e]})),1===this.types.length&&(this.internal.type=this.types[0].value)},watch:{value:function(t){var e=this;Object.keys(t).forEach((function(n){e.internal[n]=t[n]}))},internal:{deep:!0,handler:function(t,e){var n=this;Object.keys(t).map((function(e){var i=n.value;null!==i&&0!==i.length||(i={}),i[e]=t[e],n.update(i)}))}},"internal.container":function(t,e){t!==e&&null!==e&&(this.internal.asset=null)},"internal.collection":function(t,e){t!==e&&null!==e&&(this.internal.entry=null)},"internal.taxonomy":function(t,e){t!==e&&null!==e&&(this.internal.term=null)},"internal.type":function(t,e){t!==e&&null!==e&&(this.internal.url="",this.internal.newWindow=!1,this.internal.asset=[],this.internal.term=[],this.internal.page=[],this.internal.entry=[],this.internal.collection="",this.internal.taxonomy="",this.internal.container="",this.internal.text="",this.internal.aria="",this.internal.title="",this.internal.append=""),"entry"===t&&1===this.collections.length&&(this.internal.collection=this.collections[0].value),"term"===t&&1===this.taxonomies.length&&(this.internal.taxonomy=this.taxonomies[0].value),"asset"===t&&1===this.containers.length&&(this.internal.container=this.containers[0].value)}},computed:{replicatorPreview:function(){if(this.value)return __("link-it::fieldtype."+this.value.type)},types:function(){var t=this.config.types||["asset","entry","custom","email","term","tel","url"];return 0===this.containers.length&&-1!==t.indexOf("asset")&&t.splice(t.indexOf("asset"),1),0===this.collections.length&&-1!==t.indexOf("entry")&&t.splice(t.indexOf("entry"),1),0===this.taxonomies.length&&-1!==t.indexOf("term")&&t.splice(t.indexOf("term"),1),t.map((function(t){return{value:t,label:__("link-it::fieldtype."+t)}}))},taxonomies:function(){return this.config.taxonomies?_.map(this.config.taxonomies,(function(t){return{value:t,label:__(t)}})):[]},containers:function(){return this.config.containers?_.map(this.config.containers,(function(t){return{value:t,label:__(t)}})):[]},collections:function(){return this.config.collections?_.map(this.config.collections,(function(t){return{value:t,label:__(t)}})):[]},urlPlaceholder:function(){switch(this.internal.type){case"email":return __("link-it::fieldtype.email_placeholder");case"url":return __("link-it::fieldtype.url_placeholder");case"tel":return __("link-it::fieldtype.tel_placeholder");case"custom":return __("link-it::fieldtype.custom_placeholder")}return""},textPrepend:function(){switch(this.internal.type){case"email":return"mailto:";case"tel":return"tel:"}return""}},ready:function(){this.config=Object.assign({aria:!1,title:!1,append:!1,newWindow:!1},this.config)}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticClass:"flex flex-wrap items-center"},[n("v-select",{directives:[{name:"show",rawName:"v-show",value:t.types.length>1,expression:"types.length > 1"}],staticClass:"w-1/5 mr-2",attrs:{"append-to-body":"","calculate-position":t.positionOptions,options:t.types,reduce:function(t){return t.value}},model:{value:t.internal.type,callback:function(e){t.$set(t.internal,"type",e)},expression:"internal.type"}}),t._v(" "),"term"===t.internal.type?n("v-select",{directives:[{name:"show",rawName:"v-show",value:t.taxonomies.length>1,expression:"taxonomies.length > 1"}],staticClass:"w-1/5",attrs:{"append-to-body":"","calculate-position":t.positionOptions,options:t.taxonomies,reduce:function(t){return t.value}},model:{value:t.internal.taxonomy,callback:function(e){t.$set(t.internal,"taxonomy",e)},expression:"internal.taxonomy"}}):t._e(),t._v(" "),t._l(t.taxonomies,(function(e,i){return"term"===t.internal.type&&t.internal.taxonomy===e.value?n("publish-field-meta",{key:i,staticClass:"ml-2 flex-1",attrs:{config:{handle:"taxonomies",type:"taxonomy",taxonomy:e.value},"initial-value":t.internal.term},scopedSlots:t._u([{key:"default",fn:function(i){var l=i.meta,o=i.value,a=i.loading;i.config;return n("div",{},[a?t._e():n("relationship-fieldtype",{attrs:{config:{handle:"taxonomies",type:"taxonomy",taxonomy:e.value,mode:"select",max_items:1},value:o,meta:l,handle:"taxonomies"},on:{input:function(e){t.internal.term=e}}})],1)}}],null,!0)}):t._e()})),t._v(" "),"asset"===t.internal.type?n("v-select",{directives:[{name:"show",rawName:"v-show",value:t.containers.length>1,expression:"containers.length > 1"}],staticClass:"w-1/5",attrs:{"append-to-body":"","calculate-position":t.positionOptions,options:t.containers,reduce:function(t){return t.value}},model:{value:t.internal.container,callback:function(e){t.$set(t.internal,"container",e)},expression:"internal.container"}}):t._e(),t._v(" "),"asset"===t.internal.type&&t.internal.container?n("publish-field-meta",{staticClass:"w-full assets-fieldtype mt-2",attrs:{config:{type:"assets"},"initial-value":t.internal.asset,"initial-meta":{container:t.internal.container}},scopedSlots:t._u([{key:"default",fn:function(e){var i=e.meta,l=e.value,o=e.loading;return n("div",{},[o?t._e():n("assets-fieldtype",{attrs:{config:{container:t.internal.container,mode:"list",allow_uploads:!0,max_files:1,type:"assets",display:"assets",component:"assets",handle:"assets"},value:l,meta:i,handle:"asset"},on:{input:function(e){t.internal.asset=e}}})],1)}}],null,!1,4262724158)}):t._e(),t._v(" "),"entry"===t.internal.type?n("publish-field-meta",{staticClass:"flex-1",class:t.internal.entry?"-mb-1":"",attrs:{config:{handle:"collections",type:"entries",collections:t.config.collections},"initial-value":t.internal.entry},scopedSlots:t._u([{key:"default",fn:function(e){var i=e.meta,l=e.value,o=e.loading;return n("div",{},[o?t._e():n("relationship-fieldtype",{ref:"entry",attrs:{config:{handle:"collections",type:"entries",collections:t.config.collections,mode:"default",max_items:1},value:l,meta:i,handle:"entry"},on:{input:function(e){t.internal.entry=e},"meta-updated":function(t){i.data=t.data}}})],1)}}],null,!1,2538572409)}):t._e(),t._v(" "),-1!==["url","custom","email","tel"].indexOf(t.internal.type)?n("text-input",{staticClass:"flex-1",attrs:{prepend:t.textPrepend,type:"text",placeholder:t.urlPlaceholder},model:{value:t.internal.url,callback:function(e){t.$set(t.internal,"url",e)},expression:"internal.url"}}):t._e(),t._v(" "),t.internal.type&&t.config.text?n("div",{staticClass:"w-full flex items-center mt-2"},[n("label",{staticClass:"w-1/5 flex-no-shrink",attrs:{for:"text"}},[t._v(t._s(t.__("link-it::fieldtype.text_label")))]),t._v(" "),n("text-input",{staticClass:"flex-1 ml-2",attrs:{type:"text",placeholder:t.__("link-it::fieldtype.text_placeholder")},model:{value:t.internal.text,callback:function(e){t.$set(t.internal,"text",e)},expression:"internal.text"}})],1):t._e(),t._v(" "),t.internal.type&&t.config.aria?n("div",{staticClass:"w-full flex items-center mt-2"},[n("label",{staticClass:"w-1/5 flex-no-shrink",attrs:{for:"aria"}},[t._v(t._s(t.__("link-it::fieldtype.aria_label")))]),t._v(" "),n("text-input",{staticClass:"flex-1 ml-2",attrs:{type:"text",placeholder:t.__("link-it::fieldtype.aria_placeholder")},model:{value:t.internal.aria,callback:function(e){t.$set(t.internal,"aria",e)},expression:"internal.aria"}})],1):t._e(),t._v(" "),t.internal.type&&t.config.title?n("div",{staticClass:"w-full flex items-center mt-2"},[n("label",{staticClass:"w-1/5 flex-no-shrink",attrs:{for:"title"}},[t._v(t._s(t.__("link-it::fieldtype.title_label")))]),t._v(" "),n("text-input",{staticClass:"flex-1 ml-2",attrs:{type:"text",placeholder:t.__("link-it::fieldtype.title_placeholder")},model:{value:t.internal.title,callback:function(e){t.$set(t.internal,"title",e)},expression:"internal.title"}})],1):t._e(),t._v(" "),t.internal.type&&t.config.append&&"custom"!==t.internal.type?n("div",{staticClass:"w-full flex items-center mt-2"},[n("label",{staticClass:"w-1/5 flex-no-shrink",attrs:{for:"append"}},[t._v(t._s(t.__("link-it::fieldtype.append_label")))]),t._v(" "),n("text-input",{staticClass:"flex-1 ml-2",attrs:{type:"text",placeholder:t.__("link-it::fieldtype.append_placeholder")},model:{value:t.internal.append,callback:function(e){t.$set(t.internal,"append",e)},expression:"internal.append"}})],1):t._e(),t._v(" "),t.internal.type&&t.config.newWindow?n("div",{staticClass:"ml-auto w-full mt-2 flex items-center"},[n("toggle-fieldtype",{attrs:{handle:"newWindow"},model:{value:t.internal.newWindow,callback:function(e){t.$set(t.internal,"newWindow",e)},expression:"internal.newWindow"}}),t._v(" "),n("label",{staticClass:"ml-1 font-normal",on:{click:function(e){t.internal.newWindow=!t.internal.newWindow}}},[t._v(t._s(t.__("link-it::fieldtype.new_window")))])],1):t._e()],2)])}),[],!1,null,null,null).exports;Statamic.booting((function(){Statamic.component("link_it-fieldtype",K)}))})();