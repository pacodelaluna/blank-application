﻿/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function(){var a=CKEDITOR.htmlParser.fragment.prototype,b=CKEDITOR.htmlParser.element.prototype;a.onlyChild=b.onlyChild=function(){var g=this.children,h=g.length,i=h==1&&g[0];return i||null;};b.removeAnyChildWithName=function(g){var h=this.children,i=[],j;for(var k=0;k<h.length;k++){j=h[k];if(!j.name)continue;if(j.name==g){i.push(j);h.splice(k--,1);}i=i.concat(j.removeAnyChildWithName(g));}return i;};b.getAncestor=function(g){var h=this.parent;while(h&&!(h.name&&h.name.match(g)))h=h.parent;return h;};a.firstChild=b.firstChild=function(g){var h;for(var i=0;i<this.children.length;i++){h=this.children[i];if(g(h))return h;else if(h.name){h=h.firstChild(g);if(h)return h;else continue;}}return null;};b.addStyle=function(g,h,i){var m=this;var j,k='';if(typeof h=='string')k+=g+':'+h+';';else{if(typeof g=='object')for(var l in g){if(g.hasOwnProperty(l))k+=l+':'+g[l]+';';}else k+=g;i=h;}if(!m.attributes)m.attributes={};j=m.attributes.style||'';j=(i?[k,j]:[j,k]).join(';');m.attributes.style=j.replace(/^;|;(?=;)/,'');};CKEDITOR.dtd.parentOf=function(g){var h={};for(var i in this){if(i.indexOf('$')==-1&&this[i][g])h[i]=1;}return h;};var c=/^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz){1}?/i,d=/^(?:\b0[^\s]*\s*){1,4}$/,e;CKEDITOR.plugins.pastefromword={utils:{createListBulletMarker:function(g,h){var i=new CKEDITOR.htmlParser.element('cke:listbullet'),j;if(!g){g='decimal';j='ol';}else if(g[2]){if(!isNaN(g[1]))g='decimal';else if(/^[a-z]+$/.test(g[1]))g='lower-alpha';else if(/^[A-Z]+$/.test(g[1]))g='upper-alpha';else g='decimal';j='ol';}else{if(/[l\u00B7\u2002]/.test(g[1]))g='disc';else if(/[\u006F\u00D8]/.test(g[1]))g='circle';else if(/[\u006E\u25C6]/.test(g[1]))g='square';else g='disc';j='ul';}i.attributes={'cke:listtype':j,style:'list-style-type:'+g+';'};i.add(new CKEDITOR.htmlParser.text(h));return i;},isListBulletIndicator:function(g){var h=g.attributes&&g.attributes.style;if(/mso-list\s*:\s*Ignore/i.test(h))return true;},isContainingOnlySpaces:function(g){var h;return(h=g.onlyChild())&&/^(:?\s|&nbsp;)+$/.test(h.value);},resolveList:function(g){var h=g.children,i=g.attributes,j;if((j=g.removeAnyChildWithName('cke:listbullet'))&&j.length&&(j=j[0])){g.name='cke:li';if(i.style)i.style=CKEDITOR.plugins.pastefromword.filters.stylesFilter([['text-indent'],['line-height'],[/^margin(:?-left)?$/,null,function(m){var n=m.split(' ');m=n[3]||n[1]||n[0];m=parseInt(m,10);!e&&(e=m);i['cke:indent']=Math.floor(m/e)+1;}]])(i.style,g)||'';var k=j.attributes,l=k.style;
g.addStyle(l);CKEDITOR.tools.extend(i,k);return true;}else e=0;},convertToPx:(function(){var g=CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>',CKEDITOR.document);CKEDITOR.document.getBody().append(g);return function(h){if(c.test(h)){g.setStyle('width',h);return g.$.clientWidth+'px';}return h;};})(),getStyleComponents:(function(){var g=CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;"></div>',CKEDITOR.document);CKEDITOR.document.getBody().append(g);return function(h,i,j){g.setStyle(h,i);var k={},l=j.length;for(var m=0;m<l;m++)k[j[m]]=g.getStyle(j[m]);return k;};})(),listDtdParents:CKEDITOR.dtd.parentOf('ol')},filters:{flattenList:function(g){var h=g.attributes,i=g.parent,j,k=1;while(i){i.attributes&&i.attributes['cke:list']&&k++;i=i.parent;}switch(h.type){case 'a':j='lower-alpha';break;}var l=g.children,m;for(var n=0;n<l.length;n++){m=l[n];var o=m.attributes;if(m.name in CKEDITOR.dtd.$listItem){var p=m.children,q=p.length,r=p[q-1];if(r.name in CKEDITOR.dtd.$list){l.splice(n+1,0,r);r.parent=g;if(!--p.length)l.splice(n,1);}m.name='cke:li';o['cke:indent']=k;o['cke:listtype']=g.name;j&&m.addStyle('list-style-type',j,true);}}delete g.name;h['cke:list']=1;},assembleList:function(g){var h=g.children,i,j,k,l,m,n,o,p,q;for(var r=0;r<h.length;r++){i=h[r];if('cke:li'==i.name){i.name='li';j=i;k=j.attributes;l=j.attributes['cke:listtype'];m=parseInt(k['cke:indent'],10)||0;k.style&&(k.style=CKEDITOR.plugins.pastefromword.filters.stylesFilter([['list-style-type',l=='ol'?'decimal':'disc']])(k.style)||'');if(!o){p=o=new CKEDITOR.htmlParser.element(l);o.add(j);h[r]=o;}else{if(m>q){p=o;o=new CKEDITOR.htmlParser.element(l);o.add(j);n.add(o);}else if(m<q){o=p;p=o.parent?o.parent.parent:o;o.add(j);}else o.add(j);h.splice(r--,1);}n=j;q=m;}else o=null;}},falsyFilter:function(g){return false;},stylesFilter:function(g,h){return function(i,j){var k=[];i.replace(/&quot;/g,'"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g,function(m,n,o){n=n.toLowerCase();n=='font-family'&&(o=o.replace(/["']/g,''));var p,q,r,s;for(var t=0;t<g.length;t++){if(g[t]){p=g[t][0];q=g[t][1];r=g[t][2];s=g[t][3];if(n.match(p)&&(!q||o.match(q))){n=s||n;h&&(r=r||o);if(typeof r=='function')r=r(o,j,n);if(r&&r.push)n=r[0],r=r[1];if(typeof r=='string')k.push([n,r]);return;}}}!h&&k.push([n,o]);});for(var l=0;l<k.length;l++)k[l]=k[l].join(':');return k.length?k.join(';')+';':false;};},elementMigrateFilter:function(g,h){return function(i){var j=h?new CKEDITOR.style(g,h)._.definition:g;
i.name=j.element;CKEDITOR.tools.extend(i.attributes,CKEDITOR.tools.clone(j.attributes));i.addStyle(CKEDITOR.style.getStyleText(j));};},styleMigrateFilter:function(g,h){var i=this.elementMigrateFilter;return function(j,k){var l=new CKEDITOR.htmlParser.element(null),m={};m[h]=j;i(g,m)(l);l.children=k.children;k.children=[l];};},bogusAttrFilter:function(g,h){if(h.name.indexOf('cke:')==-1)return false;},applyStyleFilter:null},getRules:function(g){var h=CKEDITOR.dtd,i=CKEDITOR.tools.extend({},h.$block,h.$listItem,h.$tableContent),j=g.config,k=this.filters,l=k.falsyFilter,m=k.stylesFilter,n=k.elementMigrateFilter,o=CKEDITOR.tools.bind(this.filters.styleMigrateFilter,this.filters),p=k.bogusAttrFilter,q=this.utils.createListBulletMarker,r=k.flattenList,s=k.assembleList,t=this.utils.isListBulletIndicator,u=this.utils.isContainingOnlySpaces,v=this.utils.resolveList,w=this.utils.convertToPx,x=this.utils.getStyleComponents,y=this.utils.listDtdParents,z=j.pasteFromWordRemoveFontStyles!==false,A=j.pasteFromWordRemoveStyles!==false;return{elementNames:[[/meta|link|script/,'']],root:function(B){B.filterChildren();s(B);},elements:{'^':function(B){var C;if(CKEDITOR.env.gecko&&(C=k.applyStyleFilter))C(B);},$:function(B){var C=B.name||'',D=B.attributes;if(C in i&&D.style)D.style=m([[/^(:?width|height)$/,null,w]])(D.style)||'';if(C.match(/h\d/)){B.filterChildren();if(v(B))return;n(j['format_'+C])(B);}else if(C in h.$inline){B.filterChildren();if(u(B))delete B.name;}else if(C.indexOf(':')!=-1&&C.indexOf('cke')==-1){B.filterChildren();if(C=='v:imagedata'){var E=B.attributes['o:href'];if(E)B.attributes.src=E;B.name='img';return;}delete B.name;}if(C in y){B.filterChildren();s(B);}},style:function(B){if(CKEDITOR.env.gecko){var C=B.onlyChild().value.match(/\/\* Style Definitions \*\/([\s\S]*?)\/\*/),D=C&&C[1],E={};if(D){D.replace(/[\n\r]/g,'').replace(/(.+?)\{(.+?)\}/g,function(F,G,H){G=G.split(',');var I=G.length,J;for(var K=0;K<I;K++)CKEDITOR.tools.trim(G[K]).replace(/^(\w+)(\.[\w-]+)?$/g,function(L,M,N){M=M||'*';N=N.substring(1,N.length);if(N.match(/MsoNormal/))return;if(!E[M])E[M]={};if(N)E[M][N]=H;else E[M]=H;});});k.applyStyleFilter=function(F){var G=E['*']?'*':F.name,H=F.attributes&&F.attributes['class'],I;if(G in E){I=E[G];if(typeof I=='object')I=I[H];I&&F.addStyle(I,true);}};}}return false;},p:function(B){B.filterChildren();var C=B.attributes,D=B.parent,E=B.children;if(v(B))return;if(j.enterMode==CKEDITOR.ENTER_BR){delete B.name;B.add(new CKEDITOR.htmlParser.element('br'));}else n(j['format_'+(j.enterMode==CKEDITOR.ENTER_P?'p':'div')])(B);
},div:function(B){var C=B.onlyChild();if(C&&C.name=='table'){var D=B.attributes;C.attributes=CKEDITOR.tools.extend(C.attributes,D);D.style&&C.addStyle(D.style);var E=new CKEDITOR.htmlParser.element('div');E.addStyle('clear','both');B.add(E);delete B.name;}},td:function(B){if(B.getAncestor('thead'))B.name='th';},ol:r,ul:r,dl:r,font:function(B){if(!CKEDITOR.env.gecko&&t(B.parent)){delete B.name;return;}B.filterChildren();var C=B.attributes,D=C.style,E=B.parent;if('font'==E.name){CKEDITOR.tools.extend(E.attributes,B.attributes);D&&E.addStyle(D);delete B.name;return;}else{D=D||'';if(C.color){C.color!='#000000'&&(D+='color:'+C.color+';');delete C.color;}if(C.face){D+='font-family:'+C.face+';';delete C.face;}if(C.size){D+='font-size:'+(C.size>3?'large':C.size<3?'small':'medium')+';';delete C.size;}B.name='span';B.addStyle(D);}},span:function(B){if(!CKEDITOR.env.gecko&&t(B.parent))return false;B.filterChildren();if(u(B)){delete B.name;return null;}if(!CKEDITOR.env.gecko&&t(B)){var C=B.firstChild(function(J){return J.value||J.name=='img';}),D=C&&(C.value||'l.'),E=D.match(/^([^\s]+?)([.)]?)$/);return q(E,D);}var F=B.children,G=B.attributes,H=G&&G.style,I=F&&F[0];if(H)G.style=m([['line-height'],[/^font-family$/,null,!z?o(j.font_style,'family'):null],[/^font-size$/,null,!z?o(j.fontSize_style,'size'):null],[/^color$/,null,!z?o(j.colorButton_foreStyle,'color'):null],[/^background-color$/,null,!z?o(j.colorButton_backStyle,'color'):null]])(H,B)||'';return null;},b:n(j.coreStyles_bold),i:n(j.coreStyles_italic),u:n(j.coreStyles_underline),s:n(j.coreStyles_strike),sup:n(j.coreStyles_superscript),sub:n(j.coreStyles_subscript),a:function(B){var C=B.attributes;if(C&&!C.href&&C.name)delete B.name;},'cke:listbullet':function(B){if(B.getAncestor(/h\d/)&&!j.pasteFromWordNumberedHeadingToList)delete B.name;}},attributeNames:[[/^onmouse(:?out|over)/,''],[/^onload$/,''],[/(?:v|o):\w+/,''],[/^lang/,'']],attributes:{style:m(A?[[/^margin$|^margin-(?!bottom|top)/,null,function(B,C,D){if(C.name in {p:1,div:1}){var E=j.contentsLangDirection=='ltr'?'margin-left':'margin-right';if(D=='margin')B=x(D,B,[E])[E];else if(D!=E)return;if(B&&!d.test(B))return[E,B];}}],[/^clear$/],[/^border.*|margin.*|vertical-align|float$/,null,function(B,C){if(C.name=='img')return B;}],[/^width|height$/,null,function(B,C){if(C.name in {table:1,td:1,th:1,img:1})return B;}]]:[[/^mso-/],[/-color$/,null,function(B){if(B=='transparent')return false;if(CKEDITOR.env.gecko)return B.replace(/-moz-use-text-color/g,'transparent');
}],[/^margin$/,d],['text-indent','0cm'],['page-break-before'],['tab-stops'],['display','none'],z?[/font-?/]:null],A),width:function(B,C){if(C.name in h.$tableContent)return false;},border:function(B,C){if(C.name in h.$tableContent)return false;},'class':l,bgcolor:l,valign:A?l:function(B,C){C.addStyle('vertical-align',B);return false;}},comment:!CKEDITOR.env.ie?function(B,C){var D=B.match(/<img.*?>/),E=B.match(/^\[if !supportLists\]([\s\S]*?)\[endif\]$/);if(E){var F=E[1]||D&&'l.',G=F&&F.match(/>([^\s]+?)([.)]?)</);return q(G,F);}if(CKEDITOR.env.gecko&&D){var H=CKEDITOR.htmlParser.fragment.fromHtml(D[0]).children[0],I=C.previous,J=I&&I.value.match(/<v:imagedata[^>]*o:href=['"](.*?)['"]/),K=J&&J[1];K&&(H.attributes.src=K);return H;}return false;}:l};}};var f=function(){this.dataFilter=new CKEDITOR.htmlParser.filter();};f.prototype={toHtml:function(g){var h=CKEDITOR.htmlParser.fragment.fromHtml(g,false),i=new CKEDITOR.htmlParser.basicWriter();h.writeHtml(i,this.dataFilter);return i.getHtml(true);}};CKEDITOR.cleanWord=function(g,h){if(CKEDITOR.env.gecko)g=g.replace(/(<!--\[if[^<]*?\])-->([\S\s]*?)<!--(\[endif\]-->)/gi,'$1$2$3');var i=new f(),j=i.dataFilter;j.addRules(CKEDITOR.plugins.pastefromword.getRules(h));h.fire('beforeCleanWord',{filter:j});try{g=i.toHtml(g,false);}catch(k){alert(h.lang.pastefromword.error);}g=g.replace(/cke:.*?".*?"/g,'');g=g.replace(/style=""/g,'');g=g.replace(/<span>/g,'');e=0;return g;};})();
