export const apiUrl = `http://10.0.0.188:8081/arcgis_js_api/library/3.32/3.32/init.js`; // http://192.168.206.72:8084/arcgis_js_v332_api/arcgis_js_api/library/3.32/3.32/init.js
export const cssUrl = `http://10.0.0.188:8081/arcgis_js_api/library/3.32/3.32/esri/css/esri.css`;
export const fontUrl = `http://10.0.0.188:8081/arcgis_js_api/library/4.14/font`;
export const mapConfig = [
  { scale: 3547, maxScale: 1850 },
  { scale: 6800, maxScale: 6800 },
];
export const mapTypes = [
  { label: '矢量',value:0 },
  { label: '影像',value:1 },
];

export const levelScale =new Map([
  ['1', '2443008'],
  ['2', '150000'],
  ['3', '14999']
]);