export const apiUrl = `http://10.0.0.188:8083/arcgis_js_api/library/3.32/3.32/init.js`; // http://192.168.206.72:8084/arcgis_js_v332_api/arcgis_js_api/library/3.32/3.32/init.js
export const cssUrl = `http://10.0.0.188:8083/arcgis_js_api/library/3.32/3.32/esri/css/esri.css`;
export const fontUrl = `http://10.0.0.188:8081/arcgis_js_api/library/4.14/font`;
export const jiangSuList = [
  {
    id: 'all',
    name: '江苏省',
    lng: 119.24010782830038,
    lat: 32.943830170869035,
  },
  { id: '1', name: '南京市', lng: 118.78, lat: 32.04 },
  { id: '2', name: '徐州市', lng: 117.2, lat: 34.26 },
  { id: '3', name: '连云港市', lng: 119.16, lat: 34.59 },
  { id: '4', name: '南通市', lng: 120.86, lat: 32.01 },
  { id: '5', name: '苏州市', lng: 120.62, lat: 31.32 },
  { id: '6', name: '无锡市', lng: 120.29, lat: 31.59 },
  { id: '7', name: '常州市', lng: 119.95, lat: 31.79 },
  { id: '8', name: '淮安市', lng: 119.15, lat: 33.5 },
  { id: '9', name: '盐城市', lng: 120.13, lat: 33.38 },
  { id: '10', name: '扬州市', lng: 119.42, lat: 32.39 },
  { id: '11', name: '泰州市', lng: 119.9, lat: 32.49 },
  { id: '12', name: '镇江市', lng: 119.44, lat: 32.2 },
  { id: '13', name: '宿迁市', lng: 118.3, lat: 33.96 },
];
export const mapConfig = [
  { scale: 3547, maxScale: 1850 },
  { scale: 6800, maxScale: 6800 },
];
export const mapTypes = [
  { label: '矢量',value:0 },
  { label: '卫星',value:1 },
];

export const levelScale =new Map([
  ['1', '2443008'],
  ['2', '150000'],
  ['3', '14999']
]);