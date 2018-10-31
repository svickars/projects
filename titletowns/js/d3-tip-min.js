/**
 * d3.tip
 * Copyright (c) 2013-2017 Justin Palmer
 *
 * Tooltips for d3.js SVG visualizations
 */
// eslint-disable-next-line no-extra-semi
!function(t,e){if("function"==typeof define&&define.amd)
// AMD. Register as an anonymous module with d3 as a dependency.
define(["d3-collection","d3-selection"],e);else if("object"==typeof module&&module.exports){
/* eslint-disable global-require */
// CommonJS
var n=require("d3-collection"),o=require("d3-selection");module.exports=e(n,o)
/* eslint-enable global-require */}else{
// Browser global.
var f=t.d3;
// eslint-disable-next-line no-param-reassign
t.d3.tip=e(f,f)}}(this,function(S,B){
// Public - contructs a new tooltip
//
// Returns a tip
return function(){function c(t){(H=p(t))&&(T=H.createSVGPoint(),w.appendChild(W))}
// Public - show the tooltip on the screen
//
// Returns a tip
function t(){return"n"}function e(){return[0,0]}function n(){return" "}function o(){var t=h(),e=document.body.getBoundingClientRect();
// check if the tooltip will go overflow right side of the page
return t.n.x+W.offsetWidth/2>e.width?(diff=t.n.x+W.offsetWidth/2-e.width,{top:t.n.y-W.offsetHeight,left:t.n.x-W.offsetWidth/2-diff}):
// check if the tooltip will go overflow left side of the page
t.n.x-W.offsetWidth/2<0?(diff=W.offsetWidth/2-t.n.x,{top:t.n.y-W.offsetHeight,left:t.n.x-W.offsetWidth/2+diff}):{top:t.n.y-W.offsetHeight,left:t.n.x-W.offsetWidth/2}}function f(){var t=h(),e=document.body.getBoundingClientRect();
// oveflow right only
return t.s.x+W.offsetWidth/2>e.width&&t.s.y+250<window.innerHeight?(diff=t.s.x+W.offsetWidth/2-e.width,{top:t.s.y,left:t.s.x-W.offsetWidth/2-diff-10}):
// overflow left only
t.s.x-W.offsetWidth/2<0&&t.s.y+250<window.innerHeight?(diff=W.offsetWidth/2-t.s.x,{top:t.s.y,left:t.s.x-W.offsetWidth/2+diff+10}):
// overflow left AND bottom
t.s.x-W.offsetWidth/2<0&&t.s.y+250>window.innerHeight?(diff=W.offsetWidth/2-t.s.x,{top:t.s.y-300,left:t.s.x-W.offsetWidth/2+diff+10}):
// overflow bottom only
0<t.s.x-W.offsetWidth/2&&t.s.y+250>window.innerHeight?(diff=W.offsetWidth/2-t.s.x,{top:t.s.y-300,left:t.s.x-W.offsetWidth/2}):
// overflow right AND bottom
t.s.x+W.offsetWidth/2>e.width&&t.s.y+250<window.innerHeight?(diff=W.offsetWidth/2-t.s.x,{top:t.s.y-300,left:t.s.x-W.offsetWidth/2-diff-10}):{top:t.s.y,left:t.s.x-W.offsetWidth/2}}function i(){var t=h();return{top:t.e.y-W.offsetHeight/2,left:t.e.x}}function r(){var t=h();return{top:t.w.y-W.offsetHeight/2,left:t.w.x-W.offsetWidth}}function s(){var t=h();return{top:t.nw.y-W.offsetHeight,left:t.nw.x-W.offsetWidth}}function l(){var t=h();return{top:t.ne.y-W.offsetHeight,left:t.ne.x}}function d(){var t=h();return{top:t.sw.y,left:t.sw.x-W.offsetWidth}}function u(){var t=h();return{top:t.se.y,left:t.se.x}}function a(){var t=B.select(document.createElement("div"));return t.style("position","absolute").style("top",0).style("opacity",0).style("pointer-events","none").style("box-sizing","border-box"),t.node()}function p(t){var e=t.node();return e?"svg"===e.tagName.toLowerCase()?e:e.ownerSVGElement:null}function y(){return null==W&&(W=a(),
// re-add node to DOM
w.appendChild(W)),B.select(W)}
// Private - gets the screen coordinates of a shape
//
// Given a shape on the screen, will return an SVGPoint for the directions
// n(north), s(south), e(east), w(west), ne(northeast), se(southeast),
// nw(northwest), sw(southwest).
//
//    +-+-+
//    |   |
//    +   +
//    |   |
//    +-+-+
//
// Returns an Object {n, s, e, w, nw, sw, ne, se}
function h(){for(var t=b||B.event.target;null==t.getScreenCTM&&null==t.parentNode;)t=t.parentNode;var e={},n=t.getScreenCTM(),o=t.getBBox(),f=o.width,i=o.height,r=o.x,s=o.y;return T.x=r,T.y=s,e.nw=T.matrixTransform(n),T.x+=f,e.ne=T.matrixTransform(n),T.y+=i,e.se=T.matrixTransform(n),T.x-=f,e.sw=T.matrixTransform(n),T.y-=i/2,e.w=T.matrixTransform(n),T.x+=f,e.e=T.matrixTransform(n),T.x-=f/2,T.y-=i/2,e.n=T.matrixTransform(n),T.y+=i,e.s=T.matrixTransform(n),e}
// Private - replace D3JS 3.X d3.functor() function
function x(t){return"function"==typeof t?t:function(){return t}}var m=t,g=e,v=n,w=document.body,W=a(),H=null,T=null,b=null;c.show=function(){var t=Array.prototype.slice.call(arguments);t[t.length-1]instanceof SVGElement&&(b=t.pop());var e=v.apply(this,t),n=g.apply(this,t),o=m.apply(this,t),f=y(),i=E.length,r,s=document.documentElement.scrollTop||w.scrollTop,l=document.documentElement.scrollLeft||w.scrollLeft;for(f.html(e).style("opacity",1).style("pointer-events","all");i--;)f.classed(E[i],!1);r=C.get(o).apply(this);var d=d3.event.clientY,u=d3.event.clientX;return f.classed(o,!0).style("top",d+n[0]+s+"px").style("left",u+n[1]+l+"px"),c}
// Public - hide the tooltip
//
// Returns a tip
,c.hide=function(){var t;return y().style("opacity",0).style("pointer-events","none"),c}
// Public: Proxy attr calls to the d3 tip container.
// Sets or gets attribute value.
//
// n - name of the attribute
// v - value of the attribute
//
// Returns tip or attribute value
// eslint-disable-next-line no-unused-vars
,c.attr=function(t,e){if(arguments.length<2&&"string"==typeof t)return y().attr(t);var n=Array.prototype.slice.call(arguments);return B.selection.prototype.attr.apply(y(),n),c}
// Public: Proxy style calls to the d3 tip container.
// Sets or gets a style value.
//
// n - name of the property
// v - value of the property
//
// Returns tip or style property value
// eslint-disable-next-line no-unused-vars
,c.style=function(t,e){if(arguments.length<2&&"string"==typeof t)return y().style(t);var n=Array.prototype.slice.call(arguments);return B.selection.prototype.style.apply(y(),n),c}
// Public: Set or get the direction of the tooltip
//
// v - One of n(north), s(south), e(east), or w(west), nw(northwest),
//     sw(southwest), ne(northeast) or se(southeast)
//
// Returns tip or direction
,c.direction=function(t){return arguments.length?(m=null==t?t:x(t),c):m}
// Public: Sets or gets the offset of the tip
//
// v - Array of [x, y] offset
//
// Returns offset or
,c.offset=function(t){return arguments.length?(g=null==t?t:x(t),c):g}
// Public: sets or gets the html value of the tooltip
//
// v - String value of the tip
//
// Returns html value or tip
,c.html=function(t){return arguments.length?(v=null==t?t:x(t),c):v}
// Public: sets or gets the root element anchor of the tooltip
//
// v - root element of the tooltip
//
// Returns root node of tip
,c.rootElement=function(t){return arguments.length?(w=null==t?t:x(t),c):w}
// Public: destroys the tooltip and removes it from the DOM
//
// Returns a tip
,c.destroy=function(){return W&&(y().remove(),W=null),c};var C=S.map({n:o,s:f,e:i,w:r,nw:s,ne:l,sw:d,se:u}),E=C.keys();return c}
// eslint-disable-next-line semi;
});