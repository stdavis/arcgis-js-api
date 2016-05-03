// COPYRIGHT © 2016 Esri
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
// See http://js.arcgis.com/4.0/esri/copyright.txt for details.

define(["require","exports","../../../core/tsSupport/extendsHelper","../../../core/tsSupport/decorateHelper","../../../core/accessoireSupport/typescript","dojo/promise/all","../../../views/3d/support/ResourceController","../../../geometry/SpatialReference","../../../views/3d/layers/i3s/I3SNodeLoader","../../../views/3d/layers/i3s/I3SIndexTraversal","../../../views/3d/layers/i3s/I3SUtil","../../../views/3d/layers/i3s/I3SLodHandling","../../../views/3d/layers/i3s/I3SViewportQueries","../../../core/Accessoire","../../../core/Evented","../../../core/AccessoirePromise","../../../views/3d/support/PromiseLightweight","../../../views/3d/support/projectionUtils","../../../views/3d/lib/glMatrix"],function(e,t,i,n,r,a,o,s,l,d,u,h,c,p,g,y,_,f,v){function m(){return p}function w(e,t){for(var i=0;i<e.length;i++)if(e[i].name===t)return[i,e[i]];return[-1,void 0]}var L=!1,F=!1,V=v.vec3d,b=function(e){function t(){e.call(this)}return i(t,e),t.prototype.initialize=function(){var e=this;this.screenSizeFactor=0,this._animFrameFunctionQueue=[[],[]],this._numNodesLoading=0,this._progressMaxNumNodes=1,this._layerViewHandles=[],this._requiredAttributesChangedHandles=[],this._qualityChangedHandles=[],this._updatesDisabled=!1,this._restartNodeLoading=!1,this.updateEventListener={needsUpdate:function(){return e._needsAnimationFrameHandler()},idleFrame:function(t){return e._animationFrameHandler(t)},idleBegin:function(){return e._startNodeLoading()},idleEnd:function(){return e.cancelNodeLoading()}},this.updateEventListenerWhileSuspended={idleBegin:function(){return e._startNodeLoadingWhileSuspended()}},this._lodHandling=new h(this.layerViewRequiredFunctions,this.layerViewOptionalFunctions),this.layerView._controller=this;var t=this.layer;this._defaultGeometrySchema=t.store.defaultGeometrySchema,this._fields=t.fields,this._attributeStorageInfo=t.attributeStorageInfo,this._rootNodeUrl=t.store.rootNode,null==t.store.indexCRS&&null==t.store.geographicCRS&&this.warningEvent("Input data invalid: layer.store.indexCRS is undefined.",1),null==t.store.vertexCRS&&null==t.store.projectedCRS&&this.warningEvent("Input data invalid: layer.store.vertexCRS is undefined.",1);var i=a([this.layer,this.layerView]).then(function(){e.setClippingArea(e.layerView.view.clippingArea),e._layerViewHandles=[e.layerView.on("suspend",function(t){t.target.view.resourceController.deregisterIdleFrameWorker(e),e.updateEventListener.idleEnd(),t.target.view.resourceController.registerIdleFrameWorker(e,e.updateEventListenerWhileSuspended),null!=t.target.setVisibility&&t.target.setVisibility(!1)}),e.layerView.on("resume",function(t){null!=t.target.setVisibility&&t.target.setVisibility(!0),t.target.view.resourceController.deregisterIdleFrameWorker(e),t.target.view.resourceController.registerIdleFrameWorker(e,e.updateEventListener),e.updateEventListener.idleBegin()})],e.layerView.suspended?e.layerView.view.resourceController.registerIdleFrameWorker(e,e.updateEventListenerWhileSuspended):(null!=e.layerView.setVisibility&&e.layerView.setVisibility(!0),e.layerView.view.resourceController.registerIdleFrameWorker(e,e.updateEventListener)),e._qualityChangedHandles=[e.layerView.watch("view.qualitySettings.sceneLayer.lodFactor",function(){return e._qualityChanged()})]});this.addResolvingPromise(i)},t.prototype.destroy=function(){this.layerView.view.resourceController.deregisterIdleFrameWorker(this),this.layerView.view.resourceController.deregisterClient(this.layerView),this._removeHandles(this._layerViewHandles),this._removeHandles(this._requiredAttributesChangedHandles),this._removeHandles(this._qualityChangedHandles),this._nodeLoader=null},t.prototype._removeHandles=function(e){e&&(e.forEach(function(e){e.remove()}),e.length=0)},t.prototype._modifyNumNodesLoading=function(e){this._numNodesLoading+=e},t.prototype._getRequiredAttributes=function(){if(null==this._attributeStorageInfo||!this._fields)return[];var e=Object.create(null);this.layer.renderer&&this.layer.renderer.collectRequiredFields(e),this.layer.labelsVisible&&this.layer.labelingInfo&&this.layer.labelingInfo.forEach(function(t){t._collectRequiredFields(e)});var t=this._attributeStorageInfo,i=this._fields,n=Object.keys(e).map(function(e){var n=w(t,e)[0],r=w(i,e)[1];return{index:n,name:e,field:r,attributeStorageInfo:t[n]}}).filter(function(e){return-1!==e.index&&null!=e.field});return n},t.prototype._rendererChanged=function(){var e=this._getRequiredAttributes();this.cancelNodeLoading(),this._requiredAttributes=e,this._startNodeLoading()},t.prototype._labelsVisibleChanged=function(){var e=this._getRequiredAttributes(),t=!0;e.length===this._requiredAttributes.length&&(t=this._requiredAttributes.every(function(t){return-1!==w(e,t.name)[0]})),t&&(this.cancelNodeLoading(),this._requiredAttributes=e,this._startNodeLoading())},t.prototype._labelingInfoChanged=function(){},t.prototype.setClippingArea=function(e){var t=[];this._clippingArea=f.extentToBoundingBox(e,t,this.layerView.view.renderSpatialReference)?t:null},t.prototype._qualityChanged=function(){this.cancelNodeLoading(),this._startNodeLoading()},t.prototype.updateClippingArea=function(e){this.setClippingArea(e),this.cancelNodeLoading(),this._startNodeLoading()},t.prototype.queueAnimationFrameFunctionCall=function(e,t,i,n,r){null!=this._nodeLoader&&(r=r||0,this._animFrameFunctionQueue[r].push({fct:e,that:t,args:i,cancelFunc:n}))},t.prototype.getBaseUrl=function(){return u.addTrailingSlash(this.layer.parsedUrl.path)},t.prototype.updateElevationChanged=function(e,t,i){u.findIntersectingNodes(e,t,this.nodeIndex.root,this.crsIndex,this.nodeIndex,i);for(var n=0;n<i.length;n++){var r=i.data[n];r.computedMbs&&(r.computedMbs[3]=-1)}i.length&&(this._restartNodeLoading=!0)},t.prototype._needsAnimationFrameHandler=function(){return!0},t.prototype._animationFrameHandler=function(e){if(this._restartNodeLoading&&(this.cancelNodeLoading(),this._startNodeLoading()),null!=this._nodeLoader){for(var t;this._animFrameFunctionQueue[0].length>0&&!e.done();)t=this._animFrameFunctionQueue[0].shift(),t.fct.apply(t.that,t.args);var i=5-this._numNodesLoading;for(null!=this._indexLoader&&i>0&&this._indexLoader.continueTraversal(i);this._animFrameFunctionQueue[1].length>0&&!e.done();)t=this._animFrameFunctionQueue[1].shift(),t.fct.apply(t.that,t.args);this._evaluateUpdating(),this._lodHandling.lodGlobalHandling()}},t.prototype._evaluateUpdating=function(){var e=null!=this._indexLoader?this._indexLoader.getQueueSize()+3*this._numNodesLoading:0,t=e>0;0===e&&(this._progressMaxNumNodes=1),this._progressMaxNumNodes=Math.max(e,this._progressMaxNumNodes),this.layerView.updating!==t&&(this.layerView.updating=t);var i=100*e/this._progressMaxNumNodes;this.layerView.updatingPercentage!==i&&(this.layerView.updatingPercentage=i)},t.prototype._initViewData=function(){var e=this.layerView.view,t=e.navigation.targetCamera,i=e.renderCoordsHelper;this.camPos=t.eye,this.screenSizeFactor=1/t.perPixelRatio,this._poi=V.create();var n=V.create(),r=V.create();V.subtract(t.center,t.eye,n),V.normalize(n),i.worldUpAtPosition(t.center,r);var a=Math.acos(V.dot(r,n))-.5*Math.PI;V.lerp(t.eye,t.center,Math.max(0,Math.min(1,a/(.5*Math.PI))),this._poi);var o=e.qualitySettings.sceneLayer.lodFactor,s=null!=this.layerViewOptionalFunctions.traversalOptions?this.layerViewOptionalFunctions.traversalOptions.errorMetricToUse:null,l=this.layerViewOptionalFunctions.traversalOptions.elevationInfo,d=l?e.basemapTerrain:null;this._viewportQueries=new c(this.crsIndex,i,t,this._clippingArea,s,d,l,{screenspaceErrorBias:o,maxDistance:25e7,angleDependentLoD:1>o})},t.prototype._startNodeLoadingWhileSuspended=function(){this._initViewData(),this._removeInvisibleNodes()},t.prototype.warningEvent=function(e,t){this.emit("i3s-load-log",{type:1===t?"fatal":"warning",msg:e}),console.warn("i3s-load-log warningEvent severity "+t," message "+e)},t.prototype._startNodeLoading=function(){var e=this;if(this._restartNodeLoading=!1,!this._updatesDisabled&&null!=this.streamDataSupplier){this._initViewData();var t=null!=this.layerViewOptionalFunctions.getTexturePrefetchFunctions?this.layerViewOptionalFunctions.getTexturePrefetchFunctions():void 0,i=this.isMeshPyramid&&null!=this._defaultGeometrySchema&&null!=this._defaultGeometrySchema.ordering;null!=this.layerViewOptionalFunctions.getLoadedAttributes&&null==this._requiredAttributes&&(this._requiredAttributes=this._getRequiredAttributes(),this._requiredAttributesChangedHandles=[this.layer.watch("renderer",function(){return e._rendererChanged()}),this.layer.watch("labelsVisible",function(){return e._labelsVisibleChanged()}),this.layer.watch("labelingInfo",function(){return e._labelingInfoChanged()})]),this._nodeLoader=new l(this.streamDataSupplier,this._bundleLoadedCallback.bind(this),this.queueAnimationFrameFunctionCall.bind(this),void 0,this.layerView.view.renderCoordsHelper,this.crsIndex,t?t._calcDesiredTextureLOD:void 0,t?t._imageIsPartOfTextureBundle:void 0,t?t._matId2Meta:void 0,t?t._texId2Meta:void 0,t?t.useCompressedTextures:void 0,this.warningEvent,this._defaultGeometrySchema,this._requiredAttributes,i);var n=this._rootNodeUrl.split("/"),r=n[n.length-1];this._indexLoader=new d(this.getBaseUrl(),this._rootNodeUrl,r,this._poi,this.nodeIndex,this.streamDataSupplier,this._viewportQueries,this._processNodeIndexDocument.bind(this),this._lodHandling.finishedLevel.bind(this._lodHandling),this.layerViewOptionalFunctions._nodeDebugVisualizer,this.warningEvent,this.layer._addTrailingSlash,this.layerViewOptionalFunctions.traversalOptions),this._indexLoader.start();var a=this._removeInvisibleNodes(),o=null!=this.layerViewOptionalFunctions.traversalOptions&&this.layerViewOptionalFunctions.traversalOptions.perLevelTraversal===!0?"perLevel":this.isMeshPyramid?"global":"swap";this._lodHandling.startNodeLoading(this._indexLoader.nodeIsVisible.bind(this._indexLoader),this._indexLoader.nodeTraversalState.bind(this._indexLoader),o,this.nodeIndex,a,r),this.layerViewOptionalFunctions.additionalStartNodeLoadingHandler&&this.layerViewOptionalFunctions.additionalStartNodeLoadingHandler(),this._evaluateUpdating()}},t.prototype.isNodeLoading=function(){return null!=this._nodeLoader&&null!=this._indexLoader},t.prototype.cancelNodeLoading=function(){if(this.isNodeLoading()){this._indexLoader.cancel(),this._nodeLoader.cancel(),this.streamDataSupplier.cancelRequestsBulk(this.streamDataSupplier.getRequestedURLs());for(var e=0;e<this._animFrameFunctionQueue.length;e++)for(var t=0;t<this._animFrameFunctionQueue[e].length;t++)void 0!==this._animFrameFunctionQueue[e][t].cancelFunc&&this._animFrameFunctionQueue[e][t].cancelFunc();this._numNodesLoading=0,L&&console.log("cancelNodeLoading()"),this._animFrameFunctionQueue=[[],[]],this._nodeLoader=void 0,this._indexLoader=void 0,this._lodHandling.cancelNodeLoading(),this.layerViewOptionalFunctions.additionalCancelNodeLoadingHandler&&this.layerViewOptionalFunctions.additionalCancelNodeLoadingHandler(),this._evaluateUpdating()}},t.prototype._removeInvisibleNodes=function(){var e={};for(var t in this.nodeIndex)if(this.nodeIndex.hasOwnProperty(t)){var i=this.nodeIndex[t];if(null==this.layerViewRequiredFunctions.getAddedFeatures(i.id))continue;this._viewportQueries.isNodeVisible(i)===!1?this._removeNodeData(i):e[t]=i}return e},t.prototype._removeNodeData=function(e){this._lodHandling.setLodGlobalDirty(),this.layerViewRequiredFunctions.removeNodeData(e),delete this.nodeIndex[e.id],L&&console.debug("_removeNodeData, deleting "+e.id)},t.prototype._processNodeIndexDocument=function(e,t){var i=this,n=new _.Promise;if(L&&console.debug("_processNodeIndexDocument node id: "+e.id+" areAllBundlesLoaded "+this.layerViewRequiredFunctions.areAllBundlesLoaded(e,!0)+" shouldLoadNode "+this._lodHandling.shouldLoadNode(e,t)),null!=e.featureData&&e.featureData.length>0){if(this.layerViewRequiredFunctions.areAllBundlesLoaded(e,!0)){var r=this.layerViewOptionalFunctions.getLoadedAttributes,a=null!=r?r(e):void 0;if(null!=a&&a!==this._requiredAttributes){var o=e.baseUrl;this._nodeLoader.loadAttributes(e,o,this._requiredAttributes).then(function(t){i.layerViewOptionalFunctions.setAttributeData(e,i._requiredAttributes,t)})["catch"](function(){i.layerViewOptionalFunctions.setAttributeData(e,i._requiredAttributes,{})})}if(this._lodHandling.shouldLoadNode(e,t)){var s=this._lodHandling.lodSwapBuildInfoForNode(e);s&&null==s.swapPairs&&this._lodHandling.lodSwapBundleLoaded(e,null,s)}null!=this.layerViewOptionalFunctions._nodeDebugVisualizer&&F&&this.layerViewOptionalFunctions._nodeDebugVisualizer.show(e,this.crsIndex,"grey")}else if(null!=this.layerViewOptionalFunctions._nodeDebugVisualizer&&F&&this.layerViewOptionalFunctions._nodeDebugVisualizer.show(e,this.crsIndex,"yellow"),this._lodHandling.shouldLoadNode(e,t)){L&&console.debug("_processNodeIndexDocument, shouldLoadNode true for "+e.id);var s=this._lodHandling.lodSwapBuildInfoForNode(e);if(this.layerViewRequiredFunctions.isOverMemory())return n.done(),n;this._modifyNumNodesLoading(1);for(var l=[],d=0;d<e.featureData.length;d++){var u=this.layerViewRequiredFunctions.isBundleAlreadyAddedToStage(e,d),h=u.alreadyLoaded,c=u.wasPartiallyHidden;(!h||c)&&l.push(d)}return this.queueAnimationFrameFunctionCall(this._nodeLoader.loadNodeData,this._nodeLoader,[e,l,n,null!=this.layerViewOptionalFunctions.getTexturePrefetchFunctions,s],void 0,1),n.then(function(){return i._modifyNumNodesLoading(-1)},function(){return i._modifyNumNodesLoading(-1)}),n}}else null!=this.layerViewOptionalFunctions._nodeDebugVisualizer&&F&&this.layerViewOptionalFunctions._nodeDebugVisualizer.show(e,this.crsIndex,"blue");return n.done(),n},t.prototype._bundleLoadedCallback=function(e,t,i,n,r,a,o,s){if(this._lodHandling.lodSwapBundleLoaded(e,t,s),this.layerViewRequiredFunctions.addBundle(e,t,i,n,r,a,o),null!=this.layerViewOptionalFunctions.setPolygonOffset){var l=this._lodHandling.shouldSetPolygonOffset(e);l&&this.layerViewOptionalFunctions.setPolygonOffset(e,l)}},n([r.shared("esri.layers.graphics.controllers.I3SOnDemandController")],t.prototype,"declaredClass",void 0),n([r.shared({properties:{isMeshPyramid:{readOnly:!0,getter:function(){return"meshpyramids"===this.layer.store.profile||"MeshPyramid"===this.layer.store.lodType}},streamDataSupplier:{readOnly:!0,getter:function(){return this.layerView.view.resourceController.registerClient(this.layerView,o.ClientType.SCENE,this.addUrlTokenFunction)}},crsVertex:{readOnly:!0,type:s,getter:function(){var e=new s(u.extractWkid(this.layer.store.indexCRS||this.layer.store.geographicCRS));return e.equals(this.layer.spatialReference)?this.layer.spatialReference:e}},crsIndex:{readOnly:!0,type:s,getter:function(){var e=new s(u.extractWkid(this.layer.store.vertexCRS||this.layer.store.projectedCRS));return e.equals(this.layer.spatialReference)?this.layer.spatialReference:e}},nodeIndex:{readOnly:!0,getter:function(){return{}}},camPos:{},screenSizeFactor:{},layerView:{},layerViewRequiredFunctions:{},layerViewOptionalFunctions:{},layer:{},addUrlTokenFunction:{},warningEvent:{}}})],t.prototype,"classMetadata",void 0),t=n([r.subclass([g,y])],t)}(m());return b});