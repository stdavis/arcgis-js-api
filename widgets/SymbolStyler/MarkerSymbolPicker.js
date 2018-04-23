// COPYRIGHT © 2018 Esri
//
// All rights reserved under the copyright laws of the United States
// and applicable international laws, treaties, and conventions.
//
// This material is licensed for use under the Esri Master License
// Agreement (MLA), and is bound by the terms of that agreement.
// You may redistribute and use this code without modification,
// provided you adhere to the terms of the MLA and include this
// copyright notice.
//
// See use restrictions at http://www.esri.com/legal/pdfs/mla_e204_e300/english
//
// For additional information, contact:
// Environmental Systems Research Institute, Inc.
// Attn: Contracts and Legal Services Department
// 380 New York Street
// Redlands, California, USA 92373
// USA
//
// email: contracts@esri.com
//
// See http://js.arcgis.com/4.6/esri/copyright.txt for details.

define(["../../core/domUtils","../../core/promiseUtils","../../portal/Portal","../../symbols/support/styleUtils","./support/symbolFetcher","./support/symbolStorage","dijit/_TemplatedMixin","dijit/_WidgetBase","dijit/_WidgetsInTemplateMixin","dijit/Tooltip","dojo/dom-class","dojo/dom-construct","dojo/on","dojo/store/Memory","dojo/store/Observable","dojo/i18n!./nls/SymbolStyler","dojo/text!./templates/MarkerSymbolPicker.html","dijit/form/Select"],function(e,t,i,o,s,r,l,n,a,m,d,h,y,c,u,b,p){function _(){return!0}var S={id:"customTypes",keywords:"custom symbols",name:b.customImages,title:b.customImages},f={root:"esri-marker-symbol-picker",symbolGrid:"esri-symbol-grid",symbol:"esri-symbol",noSymbols:"esri-no-symbols",defaultSymbols:"esri-default-symbols",loader:"esri-loading-indicator",loading:"esri-loading",typeInput:"esri-type-input",categorySelect:"esri-marker-symbol-picker__category-select",loadingSymbols:"esri-marker-symbol-picker--loading",symbolViewport:"esri-marker-symbol-picker__symbolViewport",selectedSymbol:"esri-symbol--selected",dimensionalityFlat:"esri-marker-symbol-picker--dimensionality-flat",dimensionalityVolumetric:"esri-marker-symbol-picker--dimensionality-volumetric",blocked:"esri-marker-symbol-picker--blocked",header:"esri-marker-symbol-picker__header",showingOverlay:"esri-marker-symbol-picker--showing-overlay",hidden:"esri-hidden"};return n.createSubclass([l,a],{baseClass:f.root,declaredClass:"esri.widgets.SymbolStyler.MarkerSymbolPicker",templateString:p,css:f,postCreate:function(){this.inherited(arguments),this._sourceSymbolTypesStore=new c,this._symbolTypesStore=new u(new c),this._activeSymbolFetch={},this._portalToSourcesMap=new Map,this.dap_markerCategoryInput.set({labelAttr:"title",sortByLabel:!1}),this._symbolTooltip=new m({connectId:this.dap_symbolGrid,selector:".esri-symbol",getContent:function(e){return e.item.get("data.title")||""}.bind(this)}),this.own(this._symbolTooltip)},startup:function(){this.inherited(arguments),r.init();var e=this;y(this.dap_symbolGrid,".esri-symbol:click",function(){this.item.getSymbol().then(function(t){e._selectedNode&&d.remove(e._selectedNode,f.selectedSymbol),e._selectedNode=this,d.add(this,f.selectedSymbol),e.emit("symbol-select",{selection:t.clone()})}.bind(this))}),this.dap_markerCategoryInput.on("change",function(e){this.clearSelection(),this._fetchSymbols(e)}.bind(this)),this.refresh()},destroy:function(){this.inherited(arguments),this._portalToSourcesMap.clear(),this._portalToSourcesMap=null},_3dSymbolsFilter:"volumetric",_symbolTypesStore:null,_sourceSymbolTypesStore:null,_symbolItemSurfaces:null,_noSymbolsOverlay:null,_symbolGrid:null,_portal:null,_portalLoadTimeoutInMs:3e3,_portalToSourcesMap:null,_selectedNode:null,_symbolTooltip:null,_webStyleItemKeywordBlacklist:{EsriThematicShapesStyle:!0},displayMode:"portal",filters:null,_setFiltersAttr:function(e){var t={source:e&&e.source||_,symbol:e&&e.symbol||_};this._set("filters",t)},portal:null,symbolSource:"symbol-set",addCustomImageSymbol:function(e){var t=e.clone(),i=r.loadCustomItems()||[],o=t.url.split("/").pop();i.some(function(e){return e.url===t.url})||(t.type="esriPMS",t.name=o,i.push(t),this.dap_markerCategoryInput.set("value",S.id),this.clearSelection(),this._fetchSymbols(S.id))},_getDimensionality:function(){return this.symbolSource.split(":")[1]},_updateDisplay:function(){var t=this.dap_markerCategoryInput;this.clearSelection(),"portal"===this.displayMode&&(this._fetchSymbols(t.value),e.show(t.domNode),d.remove(this.domNode,f.defaultSymbols))},refresh:function(e){e=e||{},e.freshStorage&&r.empty(),this._blockInteraction(!0),this._setUpDimensionality(),this._setUpSymbolCategories().then(this._updateDisplay.bind(this)).then(function(){this._blockInteraction(!1)}.bind(this))},_blockInteraction:function(e){this.dap_markerCategoryInput.set("disabled",e),d.toggle(this.domNode,f.blocked,e)},clearSelection:function(){for(var e=this.dap_symbolGrid;e.lastChild;)e.removeChild(e.lastChild)},_activeSymbolFetch:null,_fetchSymbols:function(e){if(e){var t;this._activeSymbolFetch.promise&&(this._activeSymbolFetch.promise.cancel(),this._activeSymbolFetch.promise=null,this._activeSymbolFetch.id=null),t=this._symbolTypesStore.query({id:e})[0],this._showLoadingIndicator(),this._activeSymbolFetch.id=e,this._activeSymbolFetch.promise=this._getSymbolItems(t).then(function(t){r.saveRecentItem({id:e,dimensionality:t[0]&&t[0].data.dimensionality});var i=this._symbolTypesStore.query({defaultType:!0})[0];return i&&i.id,t}.bind(this)).then(function(i){e===this._activeSymbolFetch.id&&this._updateSymbolOptions(this._filterSymbols(i,t))}.bind(this))}},_filterSymbols:function(e,t){var i=[1,3,5];return e.filter(function(e,o){var s="basic-web-style:volumetric"===t.id,r=s&&i.indexOf(o)>-1?2:1,l={symbolLayers:{getItemAt:function(){return{height:r,width:1}}}};return this.filters.symbol(l,t)},this)},_showLoadingIndicator:function(){d.add(this.domNode,f.loadingSymbols)},_hideLoadingIndicator:function(){d.remove(this.domNode,f.loadingSymbols)},_showNoSymbolsMessage:function(){this._hideLoadingIndicator(),d.add(this.domNode,f.noSymbols),this._showMessageOverlay(b.symbolLoadError)},_showMessageOverlay:function(e){d.add(this.dap_symbolViewport,f.showingOverlay),this._noSymbolsOverlay||(this._noSymbolsOverlay=h.create("div")),this._noSymbolsOverlay.innerHTML=e,this.dap_symbolViewport.appendChild(this._noSymbolsOverlay)},_hideMessageOverlay:function(){d.remove(this.dap_symbolViewport,f.showingOverlay),this._noSymbolsOverlay&&this._noSymbolsOverlay.parentNode&&this._noSymbolsOverlay.parentNode.removeChild(this._noSymbolsOverlay)},_setUpSymbolCategories:function(){return this._showLoadingIndicator(),d.remove(this.dap_markerCategoryInput.domNode,f.hidden),d.add(this.dap_symbolTypeHeader,f.hidden),this._hideMessageOverlay(),this._initPortal().then(function(e){if(0===this.symbolSource.indexOf("symbol-set"))return s.fetchSymbolSetSymbolSources(e);var t=this._portalToSourcesMap.get(e);return t||s.fetchWebStyleSymbolSources(e).then(function(e){return e.sort(function(e,t){var i=o.styleNameFromItem(e.portalItem),s=o.styleNameFromItem(t.portalItem);return i>s?1:i<s?-1:0})}).then(function(t){return this._portalToSourcesMap.set(e,t),t}.bind(this))}.bind(this)).then(this._filterSourcesInternally.bind(this)).then(this._setUpSymbolSelect.bind(this)).then(function(){this._hideLoadingIndicator(),0===this._symbolTypesStore.data.length?this._showMessageOverlay(b.noSymbolsAvailable):this._hideMessageOverlay()}.bind(this)).catch(this._showNoSymbolsMessage.bind(this))},_filterSourcesInternally:function(e){return t.resolve(e).then(function(e){var t=this._webStyleItemKeywordBlacklist;return e.filter(function(e){return!e.portalItem.typeKeywords.some(function(e){return t[e]})})}.bind(this)).then(function(e){if(0===this.symbolSource.indexOf("symbol-set"))return e;var i=this._getDimensionality(),r=e.map(function(e){return e.fetchData()});return t.eachAlways(r).then(function(t){var r=[s.getPrimitives(i)];return t.forEach(function(t,s){var l=t.value;if(l&&l.items&&Array.isArray(l.items)&&0!==l.items.length){var n=o.styleNameFromItem(e[s].portalItem),a="EsriIconsStyle"===n?"flat":"volumetric";(l.items[0].dimensionality||a)===i&&r.push(e[s])}}),r}).then(this._filterSources.bind(this))}.bind(this))},_filterSources:function(e){return e.filter(this.filters.source,this)},_setUpDimensionality:function(){var e="volumetric"===this._getDimensionality();d.toggle(this.domNode,f.dimensionalityVolumetric,e),d.toggle(this.domNode,f.dimensionalityFlat,!e)},_setUpSymbolSelect:function(e){var t,i,o=this._sourceSymbolTypesStore;o.setData(e),e.forEach(function(e){e.defaultType&&(t=e.id)}),(i=r.loadRecentSymbolItem())&&o.query({id:i.id})[0]&&this._matchesDimensionality(i)&&(t=i.id);var s=this._symbolTypesStore;s.setData(o.query());var l=this.dap_markerCategoryInput;l.set("store",s),l.set("value",t,!1),this.dap_symbolTypeHeader.innerHTML=l.get("displayedValue");var n=s.data.length;d.toggle(l.domNode,f.hidden,n<=1),d.toggle(this.dap_symbolTypeHeader,f.hidden,1!=n)},_matchesDimensionality:function(e){var t=this._getDimensionality(),i=e.dimensionality;return"volumetric"===i&&"volumetric"===t||"flat"===i&&"flat"===t},_injectCustomSymbolType:function(e){return e.push(S),e},_initPortal:function(){var e,o=this.portal||i.getDefault();return e=t.timeout(o.load().then(function(){return this._portal=o,o}.bind(this)),this._portalLoadTimeoutInMs),this.own(e),e},_getSymbolItems:function(e){return e.id===S.id?r.loadCustomItems():e.getItems().then(function(e){return e.filter(function(e){var t=this.symbolSource.split(":")[1],i=e.data.dimensionality;return!t||i===t},this)}.bind(this))},_getActiveSource:function(){var e=this.dap_markerCategoryInput.get("value");return this._symbolTypesStore.query({id:e})[0]},_updateSymbolOptions:function(e){var t=document.createDocumentFragment();if(e.forEach(function(e){var i=h.create("div",{class:f.symbol});i.item=e,e.getThumbnail(i),e.getSymbol(),t.appendChild(i)}),this._hideLoadingIndicator(),0===e.length)return void this._showMessageOverlay(b.noSymbolsAvailable);this._hideMessageOverlay(),this.dap_symbolGrid.appendChild(t),this.dap_symbolViewport.scrollTop=0}})});