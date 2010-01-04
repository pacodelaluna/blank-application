﻿/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function(){var a=/^(\d+(?:\.\d+)?)(px|%)$/,b=/^(\d+(?:\.\d+)?)px$/,c=function(e){var f=this.id;if(!e.info)e.info={};e.info[f]=this.getValue();};function d(e,f){var g=function(h){return new CKEDITOR.dom.element(h,e.document);};return{title:e.lang.table.title,minWidth:310,minHeight:CKEDITOR.env.ie?310:280,onShow:function(){var o=this;var h=e.getSelection(),i=h.getRanges(),j=null,k=o.getContentElement('info','txtRows'),l=o.getContentElement('info','txtCols'),m=o.getContentElement('info','txtWidth');if(f=='tableProperties'){if(j=e.getSelection().getSelectedElement()){if(j.getName()!='table')j=null;}else if(i.length>0){var n=i[0].getCommonAncestor(true);j=n.getAscendant('table',true);}o._.selectedElement=j;}if(j){o.setupContent(j);k&&k.disable();l&&l.disable();m&&m.select();}else{k&&k.enable();l&&l.enable();k&&k.select();}},onOk:function(){var C=this;if(C._.selectedElement)var h=e.getSelection(),i=e.getSelection().createBookmarks();var j=C._.selectedElement||g('table'),k=C,l={};C.commitContent(l,j);if(l.info){var m=l.info;if(!C._.selectedElement){var n=j.append(g('tbody')),o=parseInt(m.txtRows,10)||0,p=parseInt(m.txtCols,10)||0;for(var q=0;q<o;q++){var r=n.append(g('tr'));for(var s=0;s<p;s++){var t=r.append(g('td'));if(!CKEDITOR.env.ie)t.append(g('br'));}}}var u=m.selHeaders;if(!j.$.tHead&&(u=='row'||u=='both')){var v=new CKEDITOR.dom.element(j.$.createTHead());n=j.getElementsByTag('tbody').getItem(0);var w=n.getElementsByTag('tr').getItem(0);for(q=0;q<w.getChildCount();q++){var x=w.getChild(q);if(x.type==CKEDITOR.NODE_ELEMENT){x.renameNode('th');x.setAttribute('scope','col');}}v.append(w.remove());}if(j.$.tHead!==null&&!(u=='row'||u=='both')){v=new CKEDITOR.dom.element(j.$.tHead);n=j.getElementsByTag('tbody').getItem(0);var y=n.getFirst();while(v.getChildCount()>0){w=v.getFirst();for(q=0;q<w.getChildCount();q++){var z=w.getChild(q);if(z.type==CKEDITOR.NODE_ELEMENT){z.renameNode('td');z.removeAttribute('scope');}}w.insertBefore(y);}v.remove();}if(!C.hasColumnHeaders&&(u=='col'||u=='both'))for(r=0;r<j.$.rows.length;r++){z=new CKEDITOR.dom.element(j.$.rows[r].cells[0]);z.renameNode('th');z.setAttribute('scope','row');}if(C.hasColumnHeaders&&!(u=='col'||u=='both'))for(q=0;q<j.$.rows.length;q++){r=new CKEDITOR.dom.element(j.$.rows[q]);if(r.getParent().getName()=='tbody'){z=new CKEDITOR.dom.element(r.$.cells[0]);z.renameNode('td');z.removeAttribute('scope');}}var A=[];if(m.txtHeight)j.setStyle('height',CKEDITOR.tools.cssLength(m.txtHeight));else j.removeStyle('height');
if(m.txtWidth){var B=m.cmbWidthType||'pixels';j.setStyle('width',m.txtWidth+(B=='pixels'?'px':'%'));}else j.removeStyle('width');if(!j.getAttribute('style'))j.removeAttribute('style');}if(!C._.selectedElement)e.insertElement(j);else h.selectBookmarks(i);return true;},contents:[{id:'info',label:e.lang.table.title,elements:[{type:'hbox',widths:[null,null],styles:['vertical-align:top'],children:[{type:'vbox',padding:0,children:[{type:'text',id:'txtRows','default':3,label:e.lang.table.rows,style:'width:5em',validate:function(){var h=true,i=this.getValue();h=h&&CKEDITOR.dialog.validate.integer()(i)&&i>0;if(!h){alert(e.lang.table.invalidRows);this.select();}return h;},setup:function(h){this.setValue(h.$.rows.length);},commit:c},{type:'text',id:'txtCols','default':2,label:e.lang.table.columns,style:'width:5em',validate:function(){var h=true,i=this.getValue();h=h&&CKEDITOR.dialog.validate.integer()(i)&&i>0;if(!h){alert(e.lang.table.invalidCols);this.select();}return h;},setup:function(h){this.setValue(h.$.rows[0].cells.length);},commit:c},{type:'html',html:'&nbsp;'},{type:'select',id:'selHeaders','default':'',label:e.lang.table.headers,items:[[e.lang.table.headersNone,''],[e.lang.table.headersRow,'row'],[e.lang.table.headersColumn,'col'],[e.lang.table.headersBoth,'both']],setup:function(h){var i=this.getDialog();i.hasColumnHeaders=true;for(var j=0;j<h.$.rows.length;j++){if(h.$.rows[j].cells[0].nodeName.toLowerCase()!='th'){i.hasColumnHeaders=false;break;}}if(h.$.tHead!==null)this.setValue(i.hasColumnHeaders?'both':'row');else this.setValue(i.hasColumnHeaders?'col':'');},commit:c},{type:'text',id:'txtBorder','default':1,label:e.lang.table.border,style:'width:3em',validate:CKEDITOR.dialog.validate.number(e.lang.table.invalidBorder),setup:function(h){this.setValue(h.getAttribute('border')||'');},commit:function(h,i){if(this.getValue())i.setAttribute('border',this.getValue());else i.removeAttribute('border');}},{id:'cmbAlign',type:'select','default':'',label:e.lang.table.align,items:[[e.lang.table.alignNotSet,''],[e.lang.table.alignLeft,'left'],[e.lang.table.alignCenter,'center'],[e.lang.table.alignRight,'right']],setup:function(h){this.setValue(h.getAttribute('align')||'');},commit:function(h,i){if(this.getValue())i.setAttribute('align',this.getValue());else i.removeAttribute('align');}}]},{type:'vbox',padding:0,children:[{type:'hbox',widths:['5em'],children:[{type:'text',id:'txtWidth',style:'width:5em',label:e.lang.table.width,'default':200,validate:CKEDITOR.dialog.validate.number(e.lang.table.invalidWidth),setup:function(h){var i=a.exec(h.$.style.width);
if(i)this.setValue(i[1]);},commit:c},{id:'cmbWidthType',type:'select',label:'&nbsp;','default':'pixels',items:[[e.lang.table.widthPx,'pixels'],[e.lang.table.widthPc,'percents']],setup:function(h){var i=a.exec(h.$.style.width);if(i)this.setValue(i[2]=='px'?'pixels':'percents');},commit:c}]},{type:'hbox',widths:['5em'],children:[{type:'text',id:'txtHeight',style:'width:5em',label:e.lang.table.height,'default':'',validate:CKEDITOR.dialog.validate.number(e.lang.table.invalidHeight),setup:function(h){var i=b.exec(h.$.style.height);if(i)this.setValue(i[1]);},commit:c},{type:'html',html:'<br />'+e.lang.table.widthPx}]},{type:'html',html:'&nbsp;'},{type:'text',id:'txtCellSpace',style:'width:3em',label:e.lang.table.cellSpace,'default':1,validate:CKEDITOR.dialog.validate.number(e.lang.table.invalidCellSpacing),setup:function(h){this.setValue(h.getAttribute('cellSpacing')||'');},commit:function(h,i){if(this.getValue())i.setAttribute('cellSpacing',this.getValue());else i.removeAttribute('cellSpacing');}},{type:'text',id:'txtCellPad',style:'width:3em',label:e.lang.table.cellPad,'default':1,validate:CKEDITOR.dialog.validate.number(e.lang.table.invalidCellPadding),setup:function(h){this.setValue(h.getAttribute('cellPadding')||'');},commit:function(h,i){if(this.getValue())i.setAttribute('cellPadding',this.getValue());else i.removeAttribute('cellPadding');}}]}]},{type:'html',align:'right',html:''},{type:'vbox',padding:0,children:[{type:'text',id:'txtCaption',label:e.lang.table.caption,setup:function(h){var i=h.getElementsByTag('caption');if(i.count()>0){var j=i.getItem(0);j=j.getChild(0)&&j.getChild(0).getText()||'';j=CKEDITOR.tools.trim(j);this.setValue(j);}},commit:function(h,i){var j=this.getValue(),k=i.getElementsByTag('caption');if(j){if(k.count()>0){k=k.getItem(0);k.setHtml('');}else{k=new CKEDITOR.dom.element('caption',e.document);if(i.getChildCount())k.insertBefore(i.getFirst());else k.appendTo(i);}k.append(new CKEDITOR.dom.text(j,e.document));}else if(k.count()>0)for(var l=k.count()-1;l>=0;l--)k.getItem(l).remove();}},{type:'text',id:'txtSummary',label:e.lang.table.summary,setup:function(h){this.setValue(h.getAttribute('summary')||'');},commit:function(h,i){if(this.getValue())i.setAttribute('summary',this.getValue());}}]}]}]};};CKEDITOR.dialog.add('table',function(e){return d(e,'table');});CKEDITOR.dialog.add('tableProperties',function(e){return d(e,'tableProperties');});})();
