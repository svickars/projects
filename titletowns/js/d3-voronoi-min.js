!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.d3=e.d3||{})}(this,function(e){"use strict";function t(e){return function(){return e}}function n(e){return e[0]}function i(e){return e[1]}function r(){this._=null}function f(e){e.U=e.C=e.L=e.R=e.P=e.N=null}function u(e,t){var n=t,i=t.R,r=n.U;r?r.L===n?r.L=i:r.R=i:e._=i,i.U=r,n.U=i,n.R=i.L,n.R&&(n.R.U=n),i.L=n}function s(e,t){var n=t,i=t.L,r=n.U;r?r.L===n?r.L=i:r.R=i:e._=i,i.U=r,n.U=i,n.L=i.R,n.L&&(n.L.U=n),i.R=n}function l(e){for(;e.L;)e=e.L;return e}function a(e,t,n,i){var r=[null,null],f=F.push(r)-1;return r.left=e,r.right=t,n&&h(r,e,t,n),i&&h(r,t,e,i),B[e.index].halfedges.push(f),B[t.index].halfedges.push(f),r}function o(e,t,n){var i=[t,n];return i.left=e,i}function h(e,t,n,i){e[0]||e[1]?e.left===n?e[1]=i:e[0]=i:(e[0]=i,e.left=t,e.right=n)}function c(e,t,n,i,r){var f,u=e[0],s=e[1],l=u[0],a=u[1],o=s[0],h=s[1],c=0,d=1,v=o-l,g=h-a;if(f=t-l,v||!(f>0)){if(f/=v,v<0){if(f<c)return;f<d&&(d=f)}else if(v>0){if(f>d)return;f>c&&(c=f)}if(f=i-l,v||!(f<0)){if(f/=v,v<0){if(f>d)return;f>c&&(c=f)}else if(v>0){if(f<c)return;f<d&&(d=f)}if(f=n-a,g||!(f>0)){if(f/=g,g<0){if(f<c)return;f<d&&(d=f)}else if(g>0){if(f>d)return;f>c&&(c=f)}if(f=r-a,g||!(f<0)){if(f/=g,g<0){if(f>d)return;f>c&&(c=f)}else if(g>0){if(f<c)return;f<d&&(d=f)}return!(c>0||d<1)||(c>0&&(e[0]=[l+c*v,a+c*g]),d<1&&(e[1]=[l+d*v,a+d*g]),!0)}}}}}function d(e,t,n,i,r){var f=e[1];if(f)return!0;var u,s,l=e[0],a=e.left,o=e.right,h=a[0],c=a[1],d=o[0],v=o[1],g=(h+d)/2,C=(c+v)/2;if(v===c){if(g<t||g>=i)return;if(h>d){if(l){if(l[1]>=r)return}else l=[g,n];f=[g,r]}else{if(l){if(l[1]<n)return}else l=[g,r];f=[g,n]}}else if(u=(h-d)/(v-c),s=C-u*g,u<-1||u>1)if(h>d){if(l){if(l[1]>=r)return}else l=[(n-s)/u,n];f=[(r-s)/u,r]}else{if(l){if(l[1]<n)return}else l=[(r-s)/u,r];f=[(n-s)/u,n]}else if(c<v){if(l){if(l[0]>=i)return}else l=[t,u*t+s];f=[i,u*i+s]}else{if(l){if(l[0]<t)return}else l=[i,u*i+s];f=[t,u*t+s]}return e[0]=l,e[1]=f,!0}function v(e,t,n,i){for(var r,f=F.length;f--;)d(r=F[f],e,t,n,i)&&c(r,e,t,n,i)&&(Math.abs(r[0][0]-r[1][0])>I||Math.abs(r[0][1]-r[1][1])>I)||delete F[f]}function g(e){return B[e.index]={site:e,halfedges:[]}}function C(e,t){var n=e.site,i=t.left,r=t.right;return n===r&&(r=i,i=n),r?Math.atan2(r[1]-i[1],r[0]-i[0]):(n===i?(i=t[1],r=t[0]):(i=t[0],r=t[1]),Math.atan2(i[0]-r[0],r[1]-i[1]))}function p(e,t){return t[+(t.left!==e.site)]}function L(e,t){return t[+(t.left===e.site)]}function R(){for(var e,t,n,i,r=0,f=B.length;r<f;++r)if((e=B[r])&&(i=(t=e.halfedges).length)){var u=new Array(i),s=new Array(i);for(n=0;n<i;++n)u[n]=n,s[n]=C(e,F[t[n]]);for(u.sort(function(e,t){return s[t]-s[e]}),n=0;n<i;++n)s[n]=t[u[n]];for(n=0;n<i;++n)t[n]=s[n]}}function y(e,t,n,i){var r,f,u,s,l,a,h,c,d,v,g,C,R=B.length,y=!0;for(r=0;r<R;++r)if(f=B[r]){for(u=f.site,l=f.halfedges,s=l.length;s--;)F[l[s]]||l.splice(s,1);for(s=0,a=l.length;s<a;)v=L(f,F[l[s]]),g=v[0],C=v[1],h=p(f,F[l[++s%a]]),c=h[0],d=h[1],(Math.abs(g-c)>I||Math.abs(C-d)>I)&&(l.splice(s,0,F.push(o(u,v,Math.abs(g-e)<I&&i-C>I?[e,Math.abs(c-e)<I?d:i]:Math.abs(C-i)<I&&n-g>I?[Math.abs(d-i)<I?c:n,i]:Math.abs(g-n)<I&&C-t>I?[n,Math.abs(c-n)<I?d:t]:Math.abs(C-t)<I&&g-e>I?[Math.abs(d-t)<I?c:e,t]:null))-1),++a);a&&(y=!1)}if(y){var b,M,U,x=1/0;for(r=0,y=null;r<R;++r)(f=B[r])&&(u=f.site,b=u[0]-e,M=u[1]-t,(U=b*b+M*M)<x&&(x=U,y=f));if(y){var N=[e,t],P=[e,i],_=[n,i],k=[n,t];y.halfedges.push(F.push(o(u=y.site,N,P))-1,F.push(o(u,P,_))-1,F.push(o(u,_,k))-1,F.push(o(u,k,N))-1)}}for(r=0;r<R;++r)(f=B[r])&&(f.halfedges.length||delete B[r])}function b(){f(this),this.x=this.y=this.arc=this.site=this.cy=null}function M(e){var t=e.P,n=e.N;if(t&&n){var i=t.site,r=e.site,f=n.site;if(i!==f){var u=r[0],s=r[1],l=i[0]-u,a=i[1]-s,o=f[0]-u,h=f[1]-s,c=2*(l*h-a*o);if(!(c>=-J)){var d=l*l+a*a,v=o*o+h*h,g=(h*d-a*v)/c,C=(l*v-o*d)/c,p=G.pop()||new b;p.arc=e,p.site=r,p.x=g+u,p.y=(p.cy=C+s)+Math.sqrt(g*g+C*C),e.circle=p;for(var L=null,R=D._;R;)if(p.y<R.y||p.y===R.y&&p.x<=R.x){if(!R.L){L=R.P;break}R=R.L}else{if(!R.R){L=R;break}R=R.R}D.insert(L,p),L||(z=p)}}}}function U(e){var t=e.circle;t&&(t.P||(z=t.N),D.remove(t),G.push(t),f(t),e.circle=null)}function x(){f(this),this.edge=this.site=this.circle=null}function N(e){var t=H.pop()||new x;return t.site=e,t}function P(e){U(e),O.remove(e),H.push(e),f(e)}function _(e){var t=e.circle,n=t.x,i=t.cy,r=[n,i],f=e.P,u=e.N,s=[e];P(e);for(var l=f;l.circle&&Math.abs(n-l.circle.x)<I&&Math.abs(i-l.circle.cy)<I;)f=l.P,s.unshift(l),P(l),l=f;s.unshift(l),U(l);for(var o=u;o.circle&&Math.abs(n-o.circle.x)<I&&Math.abs(i-o.circle.cy)<I;)u=o.N,s.push(o),P(o),o=u;s.push(o),U(o);var c,d=s.length;for(c=1;c<d;++c)o=s[c],l=s[c-1],h(o.edge,l.site,o.site,r);l=s[0],o=s[d-1],o.edge=a(l.site,o.site,null,r),M(l),M(o)}function k(e){for(var t,n,i,r,f=e[0],u=e[1],s=O._;s;)if((i=w(s,u)-f)>I)s=s.L;else{if(!((r=f-m(s,u))>I)){i>-I?(t=s.P,n=s):r>-I?(t=s,n=s.N):t=n=s;break}if(!s.R){t=s;break}s=s.R}g(e);var l=N(e);if(O.insert(t,l),t||n){if(t===n)return U(t),n=N(t.site),O.insert(l,n),l.edge=n.edge=a(t.site,l.site),M(t),void M(n);if(!n)return void(l.edge=a(t.site,l.site));U(t),U(n);var o=t.site,c=o[0],d=o[1],v=e[0]-c,C=e[1]-d,p=n.site,L=p[0]-c,R=p[1]-d,y=2*(v*R-C*L),b=v*v+C*C,x=L*L+R*R,P=[(R*b-C*x)/y+c,(v*x-L*b)/y+d];h(n.edge,o,p,P),l.edge=a(o,e,null,P),n.edge=a(e,p,null,P),M(t),M(n)}}function w(e,t){var n=e.site,i=n[0],r=n[1],f=r-t;if(!f)return i;var u=e.P;if(!u)return-1/0;n=u.site;var s=n[0],l=n[1],a=l-t;if(!a)return s;var o=s-i,h=1/f-1/a,c=o/a;return h?(-c+Math.sqrt(c*c-2*h*(o*o/(-2*a)-l+a/2+r-f/2)))/h+i:(i+s)/2}function m(e,t){var n=e.N;if(n)return w(n,t);var i=e.site;return i[1]===t?i[0]:1/0}function A(e,t,n){return(e[0]-n[0])*(t[1]-e[1])-(e[0]-t[0])*(n[1]-e[1])}function j(e,t){return t[1]-e[1]||t[0]-e[0]}function q(e,t){var n,i,f,u=e.sort(j).pop();for(F=[],B=new Array(e.length),O=new r,D=new r;;)if(f=z,u&&(!f||u[1]<f.y||u[1]===f.y&&u[0]<f.x))u[0]===n&&u[1]===i||(k(u),n=u[0],i=u[1]),u=e.pop();else{if(!f)break;_(f.arc)}if(R(),t){var s=+t[0][0],l=+t[0][1],a=+t[1][0],o=+t[1][1];v(s,l,a,o),y(s,l,a,o)}this.edges=F,this.cells=B,O=D=F=B=null}function E(){function e(e){return new q(e.map(function(t,n){var i=[Math.round(r(t,n,e)/I)*I,Math.round(f(t,n,e)/I)*I];return i.index=n,i.data=t,i}),u)}var r=n,f=i,u=null;return e.polygons=function(t){return e(t).polygons()},e.links=function(t){return e(t).links()},e.triangles=function(t){return e(t).triangles()},e.x=function(n){return arguments.length?(r="function"==typeof n?n:t(+n),e):r},e.y=function(n){return arguments.length?(f="function"==typeof n?n:t(+n),e):f},e.extent=function(t){return arguments.length?(u=null==t?null:[[+t[0][0],+t[0][1]],[+t[1][0],+t[1][1]]],e):u&&[[u[0][0],u[0][1]],[u[1][0],u[1][1]]]},e.size=function(t){return arguments.length?(u=null==t?null:[[0,0],[+t[0],+t[1]]],e):u&&[u[1][0]-u[0][0],u[1][1]-u[0][1]]},e}r.prototype={constructor:r,insert:function(e,t){var n,i,r;if(e){if(t.P=e,t.N=e.N,e.N&&(e.N.P=t),e.N=t,e.R){for(e=e.R;e.L;)e=e.L;e.L=t}else e.R=t;n=e}else this._?(e=l(this._),t.P=null,t.N=e,e.P=e.L=t,n=e):(t.P=t.N=null,this._=t,n=null);for(t.L=t.R=null,t.U=n,t.C=!0,e=t;n&&n.C;)i=n.U,n===i.L?(r=i.R,r&&r.C?(n.C=r.C=!1,i.C=!0,e=i):(e===n.R&&(u(this,n),e=n,n=e.U),n.C=!1,i.C=!0,s(this,i))):(r=i.L,r&&r.C?(n.C=r.C=!1,i.C=!0,e=i):(e===n.L&&(s(this,n),e=n,n=e.U),n.C=!1,i.C=!0,u(this,i))),n=e.U;this._.C=!1},remove:function(e){e.N&&(e.N.P=e.P),e.P&&(e.P.N=e.N),e.N=e.P=null;var t,n,i,r=e.U,f=e.L,a=e.R;if(n=f?a?l(a):f:a,r?r.L===e?r.L=n:r.R=n:this._=n,f&&a?(i=n.C,n.C=e.C,n.L=f,f.U=n,n!==a?(r=n.U,n.U=e.U,e=n.R,r.L=e,n.R=a,a.U=n):(n.U=r,r=n,e=n.R)):(i=e.C,e=n),e&&(e.U=r),!i){if(e&&e.C)return void(e.C=!1);do{if(e===this._)break;if(e===r.L){if(t=r.R,t.C&&(t.C=!1,r.C=!0,u(this,r),t=r.R),t.L&&t.L.C||t.R&&t.R.C){t.R&&t.R.C||(t.L.C=!1,t.C=!0,s(this,t),t=r.R),t.C=r.C,r.C=t.R.C=!1,u(this,r),e=this._;break}}else if(t=r.L,t.C&&(t.C=!1,r.C=!0,s(this,r),t=r.L),t.L&&t.L.C||t.R&&t.R.C){t.L&&t.L.C||(t.R.C=!1,t.C=!0,u(this,t),t=r.L),t.C=r.C,r.C=t.L.C=!1,s(this,r),e=this._;break}t.C=!0,e=r,r=r.U}while(!e.C);e&&(e.C=!1)}}};var z,O,B,D,F,G=[],H=[],I=1e-6,J=1e-12;q.prototype={constructor:q,polygons:function(){var e=this.edges;return this.cells.map(function(t){var n=t.halfedges.map(function(n){return p(t,e[n])});return n.data=t.site.data,n})},triangles:function(){var e=[],t=this.edges;return this.cells.forEach(function(n,i){for(var r,f=n.site,u=n.halfedges,s=-1,l=u.length,a=t[u[l-1]],o=a.left===f?a.right:a.left;++s<l;)r=o,a=t[u[s]],o=a.left===f?a.right:a.left,i<r.index&&i<o.index&&A(f,r,o)<0&&e.push([f.data,r.data,o.data])}),e},links:function(){return this.edges.filter(function(e){return e.right}).map(function(e){return{source:e.left.data,target:e.right.data}})},_found:0,find:function(e,t,n){var i,r=this,f=r._found,u=r.cells[f]||r.cells[f=0],s=e-u.site[0],l=t-u.site[1],a=s*s+l*l;do{u=r.cells[i=f],f=null,u.halfedges.forEach(function(n){var i=r.edges[n],s=i.left;if(s!==u.site&&s||(s=i.right),s){var l=e-s[0],o=t-s[1],h=l*l+o*o;if(h<a)return a=h,void(f=s.index)}})}while(null!==f);return r._found=i,!n||a<n*n?u.site:null}},e.voronoi=E,Object.defineProperty(e,"__esModule",{value:!0})});