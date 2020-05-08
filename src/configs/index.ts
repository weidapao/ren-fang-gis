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

export const columns1 = [
  {
    title: '城市',
    dataIndex: 'areaName',
    key: 'areaName',
    width:40
  },
  {
    title: '总数',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: '正常',
    dataIndex: 'burninNumNormal',
    key: 'burninNumNormal',
    render:(text, record)=>{
      return `${text}(${(record.burninNumNormalPercent*100).toFixed(2)}%)`
    },
    width: 80,
  },
  {
    title: '相对老化',
    dataIndex: 'burninNumRelative',
    key: 'burninNumRelative',
  },
  {
    title: '严重老化',
    dataIndex: 'burninNumSeverity',
    key: 'burninNumSeverity',
  },
];

export const columns2 = [
  {
    title: '区县',
    dataIndex: 'areaName',
    key: 'areaName',
  },
  {
    title: '总数',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: '正常',
    dataIndex: 'burninNumNormal',
    key: 'burninNumNormal',
    render:(text, record)=>{
      return `${text}(${(record.burninNumNormalPercent*100).toFixed(2)}%)`
    }
  },
  {
    title: '相对老化',
    dataIndex: 'burninNumRelative',
    key: 'burninNumRelative',
  },
  {
    title: '严重老化',
    dataIndex: 'burninNumSeverity',
    key: 'burninNumSeverity',
  },
];

export const columns3 = [
  {
    title: '警报器编号',
    dataIndex: 'alarm_site_no',
    key: 'alarm_site_no',
  },
  // {
  //   title: '经度',
  //   dataIndex: 'longitude',
  //   key: 'longitude',
  // },
  // {
  //   title: '纬度',
  //   dataIndex: 'latitude',
  //   key: 'latitude',
  // },
  // {
  //   title: '功率',
  //   dataIndex: 'alarm_power',
  //   key: 'alarm_power',
  // },
  {
    title: '类型',
    dataIndex: 'alarm_type',
    key: 'alarm_type',
  },
];