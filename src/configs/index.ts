export const apiUrl = `http://192.168.206.72:8084/arcgis_js_v332_api/arcgis_js_api/library/3.32/3.32/init.js`; // http://192.168.206.72:8084/arcgis_js_v332_api/arcgis_js_api/library/3.32/3.32/init.js
export const cssUrl = `http://192.168.206.72:8084/arcgis_js_v332_api/arcgis_js_api/library/3.32/3.32/esri/css/esri.css`; // https://js.arcgis.com/3.32/init.js https://js.arcgis.com/3.32/esri/css/esri.css
export const fontUrl = `http://10.0.0.188:8081/arcgis_js_api/library/4.14/font`;
export const mapConfig = [
  { scale: 3547, maxScale: 1850 },
  { scale: 6800, maxScale: 6800 },
];
export const mapTypes = [
  { label: '矢量', value: 0 },
  { label: '影像', value: 1 },
];

export const levelScale = new Map([
  ['1', '2443008'],
  ['2', '150000'],
  ['3', '14999'],
]);

export const columns1 = [
  {
    title: '城市',
    align: 'center',
    dataIndex: 'areaName',
    key: 'areaName',
    width: 50,
  },
  {
    title: '总数',
    align: 'center',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: '正常',
    align: 'center',
    dataIndex: 'burninNumNormal',
    key: 'burninNumNormal',
  },
  {
    title: '相对老化',
    align: 'center',
    dataIndex: 'burninNumRelative',
    key: 'burninNumRelative',
  },
  {
    title: '严重老化',
    align: 'center',
    dataIndex: 'burninNumSeverity',
    key: 'burninNumSeverity',
  },
];

export const columns2 = [
  {
    title: '区县',
    align: 'center',
    dataIndex: 'areaName',
    key: 'areaName',
    width: 50,
    render: (text, record) => {
      // return text
      if (text) {
        const index = text.indexOf('市直');
        if (index > -1) return '市直';
        const index2 = text.indexOf('市');
        return text.substr(index2 + 1, text.length);
      }
    },
  },
  {
    title: '总数',
    align: 'center',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: '正常',
    align: 'center',
    dataIndex: 'burninNumNormal',
    key: 'burninNumNormal',
  },
  {
    title: '相对老化',
    align: 'center',
    dataIndex: 'burninNumRelative',
    key: 'burninNumRelative',
  },
  {
    title: '严重老化',
    align: 'center',
    dataIndex: 'burninNumSeverity',
    key: 'burninNumSeverity',
  },
];

export const columns3 = [
  {
    title: '警报器编号',
    align: 'center',
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
    align: 'center',
    dataIndex: 'alarm_type',
    key: 'alarm_type',
  },
];
