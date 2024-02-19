"use strict";(globalThis.webpackChunksuperset=globalThis.webpackChunksuperset||[]).push([[4237,1441,5422],{51331:(e,i,t)=>{t.d(i,{Z:()=>n});const o={pickingSelectedColor:null,pickingHighlightColor:new Uint8Array([0,255,255,255]),pickingActive:!1,pickingAttribute:!1},n={inject:{"vs:DECKGL_FILTER_COLOR":"\n  picking_setPickingColor(geometry.pickingColor);\n  // for picking depth values\n  picking_setPickingAttribute(geometry.position.z);\n  ","fs:DECKGL_FILTER_COLOR":{order:99,injection:"\n  // use highlight color if this fragment belongs to the selected object.\n  color = picking_filterHighlightColor(color);\n\n  // use picking color if rendering to picking FBO.\n  color = picking_filterPickingColor(color);\n    "}},name:"picking",vs:"uniform bool picking_uActive;\nuniform bool picking_uAttribute;\nuniform vec3 picking_uSelectedColor;\nuniform bool picking_uSelectedColorValid;\n\nout vec4 picking_vRGBcolor_Avalid;\n\nconst float COLOR_SCALE = 1. / 255.;\n\nbool picking_isColorValid(vec3 color) {\n  return dot(color, vec3(1.0)) > 0.001;\n}\n\nbool isVertexPicked(vec3 vertexColor) {\n  return\n    picking_uSelectedColorValid &&\n    !picking_isColorValid(abs(vertexColor - picking_uSelectedColor));\n}\n\nvoid picking_setPickingColor(vec3 pickingColor) {\n  if (picking_uActive) {\n    picking_vRGBcolor_Avalid.a = float(picking_isColorValid(pickingColor));\n\n    if (!picking_uAttribute) {\n      picking_vRGBcolor_Avalid.rgb = pickingColor * COLOR_SCALE;\n    }\n  } else {\n    picking_vRGBcolor_Avalid.a = float(isVertexPicked(pickingColor));\n  }\n}\n\nvoid picking_setPickingAttribute(float value) {\n  if (picking_uAttribute) {\n    picking_vRGBcolor_Avalid.r = value;\n  }\n}\nvoid picking_setPickingAttribute(vec2 value) {\n  if (picking_uAttribute) {\n    picking_vRGBcolor_Avalid.rg = value;\n  }\n}\nvoid picking_setPickingAttribute(vec3 value) {\n  if (picking_uAttribute) {\n    picking_vRGBcolor_Avalid.rgb = value;\n  }\n}\n",fs:"uniform bool picking_uActive;\nuniform vec3 picking_uSelectedColor;\nuniform vec4 picking_uHighlightColor;\n\nin vec4 picking_vRGBcolor_Avalid;\nvec4 picking_filterHighlightColor(vec4 color) {\n  if (picking_uActive) {\n    return color;\n  }\n  bool selected = bool(picking_vRGBcolor_Avalid.a);\n\n  if (selected) {\n    float highLightAlpha = picking_uHighlightColor.a;\n    float blendedAlpha = highLightAlpha + color.a * (1.0 - highLightAlpha);\n    float highLightRatio = highLightAlpha / blendedAlpha;\n\n    vec3 blendedRGB = mix(color.rgb, picking_uHighlightColor.rgb, highLightRatio);\n    return vec4(blendedRGB, blendedAlpha);\n  } else {\n    return color;\n  }\n}\nvec4 picking_filterPickingColor(vec4 color) {\n  if (picking_uActive) {\n    if (picking_vRGBcolor_Avalid.a == 0.0) {\n      discard;\n    }\n    return picking_vRGBcolor_Avalid;\n  }\n  return color;\n}\nvec4 picking_filterColor(vec4 color) {\n  vec4 highightColor = picking_filterHighlightColor(color);\n  return picking_filterPickingColor(highightColor);\n}\n\n",getUniforms:function(e=o){const i={};if(void 0!==e.pickingSelectedColor)if(e.pickingSelectedColor){const t=e.pickingSelectedColor.slice(0,3);i.picking_uSelectedColorValid=1,i.picking_uSelectedColor=t}else i.picking_uSelectedColorValid=0;if(e.pickingHighlightColor){const t=Array.from(e.pickingHighlightColor,(e=>e/255));Number.isFinite(t[3])||(t[3]=1),i.picking_uHighlightColor=t}return void 0!==e.pickingActive&&(i.picking_uActive=Boolean(e.pickingActive),i.picking_uAttribute=Boolean(e.pickingAttribute)),i}}},28569:(e,i,t)=>{t.d(i,{Z:()=>d});var o=t(95772),n=t(93844),r=t(51331),s=t(1113),a=t(53982);const l=[0,0,0,255],c={radiusUnits:"meters",radiusScale:{type:"number",min:0,value:1},radiusMinPixels:{type:"number",min:0,value:0},radiusMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},lineWidthUnits:"meters",lineWidthScale:{type:"number",min:0,value:1},lineWidthMinPixels:{type:"number",min:0,value:0},lineWidthMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},stroked:!1,filled:!0,billboard:!1,getPosition:{type:"accessor",value:e=>e.position},getRadius:{type:"accessor",value:1},getFillColor:{type:"accessor",value:l},getLineColor:{type:"accessor",value:l},getLineWidth:{type:"accessor",value:1},strokeWidth:{deprecatedFor:"getLineWidth"},outline:{deprecatedFor:"stroked"},getColor:{deprecatedFor:["getFillColor","getLineColor"]}};class d extends o.Z{getShaders(){return super.getShaders({vs:"#define SHADER_NAME scatterplot-layer-vertex-shader\n\nattribute vec3 positions;\n\nattribute vec3 instancePositions;\nattribute vec3 instancePositions64Low;\nattribute float instanceRadius;\nattribute float instanceLineWidths;\nattribute vec4 instanceFillColors;\nattribute vec4 instanceLineColors;\nattribute vec3 instancePickingColors;\n\nuniform float opacity;\nuniform float radiusScale;\nuniform float radiusMinPixels;\nuniform float radiusMaxPixels;\nuniform float lineWidthScale;\nuniform float lineWidthMinPixels;\nuniform float lineWidthMaxPixels;\nuniform float stroked;\nuniform bool filled;\nuniform bool billboard;\n\nvarying vec4 vFillColor;\nvarying vec4 vLineColor;\nvarying vec2 unitPosition;\nvarying float innerUnitRadius;\nvarying float outerRadiusPixels;\n\nvoid main(void) {\n  geometry.worldPosition = instancePositions;\n  outerRadiusPixels = clamp(\n    project_size_to_pixel(radiusScale * instanceRadius),\n    radiusMinPixels, radiusMaxPixels\n  );\n  float lineWidthPixels = clamp(\n    project_size_to_pixel(lineWidthScale * instanceLineWidths),\n    lineWidthMinPixels, lineWidthMaxPixels\n  );\n  outerRadiusPixels += stroked * lineWidthPixels / 2.0;\n  unitPosition = positions.xy;\n  geometry.uv = unitPosition;\n  geometry.pickingColor = instancePickingColors;\n\n  innerUnitRadius = 1.0 - stroked * lineWidthPixels / outerRadiusPixels;\n  \n  if (billboard) {\n    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);\n    vec3 offset = positions * outerRadiusPixels;\n    DECKGL_FILTER_SIZE(offset, geometry);\n    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);\n  } else {\n    vec3 offset = positions * project_pixel_size(outerRadiusPixels);\n    DECKGL_FILTER_SIZE(offset, geometry);\n    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset, geometry.position);\n  }\n\n  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);\n  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);\n  DECKGL_FILTER_COLOR(vFillColor, geometry);\n  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity);\n  DECKGL_FILTER_COLOR(vLineColor, geometry);\n}\n",fs:"#define SHADER_NAME scatterplot-layer-fragment-shader\n\nprecision highp float;\n\nuniform bool filled;\nuniform float stroked;\n\nvarying vec4 vFillColor;\nvarying vec4 vLineColor;\nvarying vec2 unitPosition;\nvarying float innerUnitRadius;\nvarying float outerRadiusPixels;\n\nvoid main(void) {\n  geometry.uv = unitPosition;\n\n  float distToCenter = length(unitPosition) * outerRadiusPixels;\n  float inCircle = smoothedge(distToCenter, outerRadiusPixels);\n\n  if (inCircle == 0.0) {\n    discard;\n  }\n\n  if (stroked > 0.5) {\n    float isLine = smoothedge(innerUnitRadius * outerRadiusPixels, distToCenter);\n    if (filled) {\n      gl_FragColor = mix(vFillColor, vLineColor, isLine);\n    } else {\n      if (isLine == 0.0) {\n        discard;\n      }\n      gl_FragColor = vec4(vLineColor.rgb, vLineColor.a * isLine);\n    }\n  } else if (filled) {\n    gl_FragColor = vFillColor;\n  } else {\n    discard;\n  }\n\n  gl_FragColor.a *= inCircle;\n  DECKGL_FILTER_COLOR(gl_FragColor, geometry);\n}\n",modules:[n.Z,r.Z]})}initializeState(){this.getAttributeManager().addInstanced({instancePositions:{size:3,type:5130,fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceRadius:{size:1,transition:!0,accessor:"getRadius",defaultValue:1},instanceFillColors:{size:this.props.colorFormat.length,transition:!0,normalized:!0,type:5121,accessor:"getFillColor",defaultValue:[0,0,0,255]},instanceLineColors:{size:this.props.colorFormat.length,transition:!0,normalized:!0,type:5121,accessor:"getLineColor",defaultValue:[0,0,0,255]},instanceLineWidths:{size:1,transition:!0,accessor:"getLineWidth",defaultValue:1}})}updateState({props:e,oldProps:i,changeFlags:t}){if(super.updateState({props:e,oldProps:i,changeFlags:t}),t.extensionsChanged){var o;const{gl:e}=this.context;null===(o=this.state.model)||void 0===o||o.delete(),this.state.model=this._getModel(e),this.getAttributeManager().invalidateAll()}}draw({uniforms:e}){const{viewport:i}=this.context,{radiusUnits:t,radiusScale:o,radiusMinPixels:n,radiusMaxPixels:r,stroked:s,filled:a,billboard:l,lineWidthUnits:c,lineWidthScale:d,lineWidthMinPixels:g,lineWidthMaxPixels:p}=this.props,u="pixels"===t?i.metersPerPixel:1,h="pixels"===c?i.metersPerPixel:1;this.state.model.setUniforms(e).setUniforms({stroked:s?1:0,filled:a,billboard:l,radiusScale:o*u,radiusMinPixels:n,radiusMaxPixels:r,lineWidthScale:d*h,lineWidthMinPixels:g,lineWidthMaxPixels:p}).draw()}_getModel(e){return new s.Z(e,{...this.getShaders(),id:this.props.id,geometry:new a.Z({drawMode:6,vertexCount:4,attributes:{positions:{size:3,value:new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0])}}}),isInstanced:!0})}}d.layerName="ScatterplotLayer",d.defaultProps=c},36665:(e,i,t)=>{t.d(i,{Z:()=>h});var o=t(78580),n=t.n(o),r=t(67294),s=t(45697),a=t.n(s),l=t(51995),c=t(67190),d=t(11965);const g=l.iK.div`
  ${e=>{let{theme:i}=e;return`\n    font-size: ${i.typography.sizes.s}px;\n    position: absolute;\n    background: ${i.colors.grayscale.light5};\n    box-shadow: 0 0 ${i.gridUnit}px ${i.colors.grayscale.light2};\n    margin: ${6*i.gridUnit}px;\n    padding: ${3*i.gridUnit}px ${5*i.gridUnit}px;\n    outline: none;\n    overflow-y: scroll;\n    max-height: 200px;\n\n    & ul {\n      list-style: none;\n      padding-left: 0;\n      margin: 0;\n\n      & li a {\n        color: ${i.colors.grayscale.base};\n        text-decoration: none;\n\n        & span {\n          margin-right: ${3*i.gridUnit}px;\n        }\n      }\n    }\n  `}}
`,p=" - ",u={categories:a().object,forceCategorical:a().bool,format:a().string,position:a().oneOf([null,"tl","tr","bl","br"]),showSingleCategory:a().func,toggleCategory:a().func};class h extends r.PureComponent{format(e){if(!this.props.format||this.props.forceCategorical)return e;const i=parseFloat(e);return(0,c.uf)(this.props.format,i)}formatCategoryLabel(e){if(!this.props.format)return e;if(n()(e).call(e,p)){const i=e.split(p);return this.format(i[0])+p+this.format(i[1])}return this.format(e)}render(){if(0===Object.keys(this.props.categories).length||null===this.props.position)return null;const e=Object.entries(this.props.categories).map((e=>{let[i,t]=e;const o={color:`rgba(${t.color.join(", ")})`},n=t.enabled?"◼":"◻";return(0,d.tZ)("li",{key:i},(0,d.tZ)("a",{href:"#",onClick:()=>this.props.toggleCategory(i),onDoubleClick:()=>this.props.showSingleCategory(i)},(0,d.tZ)("span",{style:o},n)," ",this.formatCategoryLabel(i)))})),i={position:"absolute",["t"===this.props.position.charAt(0)?"top":"bottom"]:"0px",["r"===this.props.position.charAt(1)?"right":"left"]:"10px"};return(0,d.tZ)(g,{style:i},(0,d.tZ)("ul",null,e))}}h.propTypes=u,h.defaultProps={categories:{},forceCategorical:!1,format:null,position:"tr",showSingleCategory:()=>{},toggleCategory:()=>{}}},54448:(e,i,t)=>{t.r(i),t.d(i,{default:()=>u,getLayer:()=>p});var o=t(28569),n=(t(67294),t(56652)),r=t(55867),s=t(52154),a=t(26331),l=t(1740);const c=1609.34;var d=t(11965);function g(e,i){return t=>{var o;const s=(null==i?void 0:i[e.point_radius_fixed.value])||(0,n.Z)(null==(o=e.point_radius_fixed)?void 0:o.value);return(0,d.tZ)("div",{className:"deckgl-tooltip"},(0,d.tZ)(l.Z,{label:(0,r.t)("Longitude and Latitude")+": ",value:`${t.object.position[0]}, ${t.object.position[1]}`}),t.object.cat_color&&(0,d.tZ)(l.Z,{label:(0,r.t)("Category")+": ",value:`${t.object.cat_color}`}),t.object.metric&&(0,d.tZ)(l.Z,{label:`${s}: `,value:`${t.object.metric}`}))}}function p(e,i,t,n,r){const a=e,l=i.data.features.map((e=>{let i=(t=a.point_unit,o=e.radius,("square_m"===t?Math.sqrt(o/Math.PI):"radius_m"===t?o:"radius_km"===t?1e3*o:"radius_miles"===t?o*c:"square_km"===t?1e3*Math.sqrt(o/Math.PI):"square_miles"===t?Math.sqrt(o/Math.PI)*c:null)||10);var t,o;if(a.multiplier&&(i*=a.multiplier),e.color)return{...e,radius:i};const n=a.color_picker||{r:0,g:0,b:0,a:1},r=[n.r,n.g,n.b,255*n.a];return{...e,radius:i,color:r}}));return new o.Z({id:`scatter-layer-${a.slice_id}`,data:l,fp64:!0,getFillColor:e=>e.color,getRadius:e=>e.radius,radiusMinPixels:Number(a.min_radius)||null,radiusMaxPixels:Number(a.max_radius)||null,stroked:!1,...(0,s.N)(a,n,g(a,null==r?void 0:r.verboseMap))})}const u=(0,a.B)(p,(function(e){return e.map((e=>e.position))}))},26331:(e,i,t)=>{t.d(i,{B:()=>y,G:()=>b});var o=t(18446),n=t.n(o),r=t(67294),s=t(84502),a=t(45697),l=t.n(a),c=t(28062),d=t(85531),g=t(36665),p=t(64106),u=t(66911),h=t(21207),f=t(40461),m=t(11965);const{getScale:v}=c,_={datasource:l().object.isRequired,formData:l().object.isRequired,getLayer:l().func.isRequired,getPoints:l().func.isRequired,height:l().number.isRequired,mapboxApiKey:l().string.isRequired,onAddFilter:l().func,payload:l().object.isRequired,setControlValue:l().func.isRequired,viewport:l().object.isRequired,width:l().number.isRequired};class C extends r.PureComponent{constructor(e){super(e),this.containerRef=r.createRef(),this.setTooltip=e=>{const{current:i}=this.containerRef;i&&i.setTooltip(e)},this.state=this.getStateFromProps(e),this.getLayers=this.getLayers.bind(this),this.onValuesChange=this.onValuesChange.bind(this),this.toggleCategory=this.toggleCategory.bind(this),this.showSingleCategory=this.showSingleCategory.bind(this)}UNSAFE_componentWillReceiveProps(e){e.payload.form_data!==this.state.formData&&this.setState({...this.getStateFromProps(e)})}onValuesChange(e){this.setState({values:Array.isArray(e)?e:[e,e+this.state.getStep(e)]})}getStateFromProps(e,i){const t=e.payload.data.features||[],o=t.map((e=>e.__timestamp)),n=function(e,i){const t=e.color_picker||{r:0,g:0,b:0,a:1},o=[t.r,t.g,t.b,255*t.a],n=v(e.color_scheme),r={};return i.forEach((i=>{if(null!=i.cat_color&&!r.hasOwnProperty(i.cat_color)){let s;s=e.dimension?(0,p.hexToRGB)(n(i.cat_color,e.sliceId),255*t.a):o,r[i.cat_color]={color:s,enabled:!0}}})),r}(e.formData,t);if(i&&e.payload.form_data===i.formData)return{...i,categories:n};const r=e.payload.form_data.time_grain_sqla||e.payload.form_data.granularity||"P1D",{start:s,end:a,getStep:l,values:c,disabled:d}=(0,u.g)(o,r),{width:g,height:h,formData:m}=e;let{viewport:_}=e;return m.autozoom&&(_=(0,f.Z)(_,{width:g,height:h,points:e.getPoints(t)})),_.zoom<0&&(_.zoom=0),{start:s,end:a,getStep:l,values:c,disabled:d,viewport:_,selected:[],lastClick:0,formData:e.payload.form_data,categories:n}}getLayers(e){const{getLayer:i,payload:t,formData:o,onAddFilter:n}=this.props;let r=t.data.features?[...t.data.features]:[];r=this.addColor(r,o),o.js_data_mutator&&(r=(0,h.Z)(o.js_data_mutator)(r)),r=e[0]===e[1]||e[1]===this.end?r.filter((i=>i.__timestamp>=e[0]&&i.__timestamp<=e[1])):r.filter((i=>i.__timestamp>=e[0]&&i.__timestamp<e[1]));const s=this.state.categories;return o.dimension&&(r=r.filter((e=>s[e.cat_color]&&s[e.cat_color].enabled))),[i(o,{...t,data:{...t.data,features:r}},n,this.setTooltip,this.props.datasource)]}addColor(e,i){const t=i.color_picker||{r:0,g:0,b:0,a:1},o=v(i.color_scheme);return e.map((e=>{let n;return i.dimension?(n=(0,p.hexToRGB)(o(e.cat_color,i.sliceId),255*t.a),{...e,color:n}):e}))}toggleCategory(e){const i=this.state.categories[e],t={...this.state.categories,[e]:{...i,enabled:!i.enabled}};Object.values(t).every((e=>!e.enabled))&&Object.values(t).forEach((e=>{e.enabled=!0})),this.setState({categories:t})}showSingleCategory(e){const i={...this.state.categories};Object.values(i).forEach((e=>{e.enabled=!1})),i[e].enabled=!0,this.setState({categories:i})}render(){return(0,m.tZ)("div",{style:{position:"relative"}},(0,m.tZ)(d.Z,{ref:this.containerRef,getLayers:this.getLayers,start:this.state.start,end:this.state.end,getStep:this.state.getStep,values:this.state.values,disabled:this.state.disabled,viewport:this.state.viewport,mapboxApiAccessToken:this.props.mapboxApiKey,mapStyle:this.props.formData.mapbox_style,setControlValue:this.props.setControlValue,width:this.props.width,height:this.props.height},(0,m.tZ)(g.Z,{forceCategorical:!0,categories:this.state.categories,format:this.props.formData.legend_format,position:this.props.formData.legend_position,showSingleCategory:this.showSingleCategory,toggleCategory:this.toggleCategory})))}}function b(e,i){class t extends r.PureComponent{constructor(e){super(e),this.containerRef=r.createRef(),this.setTooltip=e=>{const{current:i}=this.containerRef;i&&(null==i||i.setTooltip(e))};const{width:t,height:o,formData:n}=e;let{viewport:s}=e;n.autozoom&&(s=(0,f.Z)(s,{width:t,height:o,points:i(e.payload.data.features)})),this.state={viewport:s,layer:this.computeLayer(e)},this.onViewportChange=this.onViewportChange.bind(this)}UNSAFE_componentWillReceiveProps(e){const i={...e.formData,viewport:null},t={...this.props.formData,viewport:null};n()(i,t)&&e.payload===this.props.payload||this.setState({layer:this.computeLayer(e)})}onViewportChange(e){this.setState({viewport:e})}computeLayer(i){const{formData:t,payload:o,onAddFilter:n}=i;return e(t,o,n,this.setTooltip)}render(){const{formData:e,payload:i,setControlValue:t,height:o,width:n}=this.props,{layer:r,viewport:a}=this.state;return(0,m.tZ)(s.F,{ref:this.containerRef,mapboxApiAccessToken:i.data.mapboxApiKey,viewport:a,layers:[r],mapStyle:e.mapbox_style,setControlValue:t,width:n,height:o,onViewportChange:this.onViewportChange})}}return t}function y(e,i){return function(t){const{datasource:o,formData:n,height:r,payload:s,setControlValue:a,viewport:l,width:c}=t;return(0,m.tZ)(C,{datasource:o,formData:n,mapboxApiKey:s.data.mapboxApiKey,setControlValue:a,viewport:l,getLayer:e,payload:s,getPoints:i,width:c,height:r})}}C.propTypes=_}}]);
//# sourceMappingURL=04046faa6cfa8c4d495c.chunk.js.map