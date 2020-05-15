export const apiUrl = `http://172.24.129.11:8084/arcgis_js_v332_api/arcgis_js_api/library/3.32/3.32/init.js`; // http://172.24.129.11:8084/arcgis_js_v332_api/arcgis_js_api/library/3.32/3.32/init.js
export const cssUrl = `http://172.24.129.11:8084/arcgis_js_v332_api/arcgis_js_api/library/3.32/3.32/esri/css/esri.css`; // https://js.arcgis.com/3.32/init.js https://js.arcgis.com/3.32/esri/css/esri.css
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

export const columnsBase = [
  {
    title: '城市',
    align: 'center',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => {
      if (text) {
        const index2 = text.indexOf('市');
        if (index2 === text.length - 1) {
          return text;
        }
        return text.substr(index2 + 1, text.length);
      }
    },
  },
  {
    title: '面积(㎡)',
    align: 'center',
    dataIndex: 'sumArea',
    key: 'sumArea',
  },
  {
    title: '可容纳人数',
    align: 'center',
    dataIndex: 'sumMaxPeople',
    key: 'sumMaxPeople',
  },
  {
    title: '基地总数',
    align: 'center',
    dataIndex: 'count',
    key: 'count',
  },
];

export const columnsBase2 = [
  {
    title: '城市',
    align: 'center',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => {
      if (text) {
        const index2 = text.indexOf('市');
        if (index2 === text.length - 1) {
          return text;
        }
        return text.substr(index2 + 1, text.length);
      }
    },
  },
  {
    title: '面积(㎡)',
    align: 'center',
    dataIndex: 'sumArea',
    key: 'sumArea',
  },
  {
    title: '可容纳人数',
    align: 'center',
    dataIndex: 'sumMaxPeople',
    key: 'sumMaxPeople',
  },
];

export const columnsTeam = [
  {
    title: '城市',
    align: 'center',
    dataIndex: 'areaName',
    key: 'areaName',
    render: (text, record) => {
      if (text) {
        const index2 = text.indexOf('市');
        if (index2 === text.length - 1) {
          return text;
        }
        return text.substr(index2 + 1, text.length);
      }
    },
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'alarmCount',
    key: 'alarmCount',
  },
  {
    title: '交通运输',
    align: 'center',
    dataIndex: 'jtys',
    key: 'jtys',
    render: (text, record) => {
      if (record.proteamInfoCollects) {
        return record.proteamInfoCollects[0].nums;
      }
    },
  },
  {
    title: '伪装设障',
    align: 'center',
    dataIndex: 'wzsz',
    key: 'wzsz',
    render: (text, record) => {
      if (record.proteamInfoCollects) {
        return record.proteamInfoCollects[1].nums;
      }
    },
  },
  {
    title: '信息防护',
    align: 'center',
    dataIndex: 'xxfh',
    key: 'xxfh',
    render: (text, record) => {
      if (record.proteamInfoCollects) {
        return record.proteamInfoCollects[2].nums;
      }
    },
  },
  {
    title: '心理防护',
    align: 'center',
    dataIndex: 'xlfh',
    key: 'xlfh',
    render: (text, record) => {
      if (record.proteamInfoCollects) {
        return record.proteamInfoCollects[3].nums;
      }
    },
  },
  {
    title: '抢险抢修',
    align: 'center',
    dataIndex: 'qxqx',
    key: 'qxqx',
    render: (text, record) => {
      if (record.proteamInfoCollects) {
        return record.proteamInfoCollects[4].nums;
      }
    },
  },
  {
    title: '医疗救护',
    align: 'center',
    dataIndex: 'yljh',
    key: 'yljh',
    render: (text, record) => {
      if (record.proteamInfoCollects) {
        return record.proteamInfoCollects[5].nums;
      }
    },
  },
  {
    title: '消防',
    align: 'center',
    dataIndex: 'xf',
    key: 'xf',
    render: (text, record) => {
      if (record.proteamInfoCollects) {
        return record.proteamInfoCollects[6].nums;
      }
    },
  },
  {
    title: '治安',
    align: 'center',
    dataIndex: 'za',
    key: 'za',
    render: (text, record) => {
      if (record.proteamInfoCollects) {
        return record.proteamInfoCollects[7].nums;
      }
    },
  },
  {
    title: '防化防疫',
    align: 'center',
    dataIndex: 'fhfy',
    key: 'fhfy',
    render: (text, record) => {
      if (record.proteamInfoCollects) {
        return record.proteamInfoCollects[8].nums;
      }
    },
  },
  {
    title: '通信专业',
    align: 'center',
    dataIndex: 'txzy',
    key: 'txzy',
    render: (text, record) => {
      if (record.proteamInfoCollects) {
        return record.proteamInfoCollects[9].nums;
      }
    },
  },
  {
    title: '其他专业',
    align: 'center',
    dataIndex: 'qtzy',
    key: 'qtzy',
    render: (text, record) => {
      if (record.proteamInfoCollects) {
        return record.proteamInfoCollects[10].nums;
      }
    },
  },
];

export const columnsTeam2 = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'no',
    key: 'no',
  },
  {
    title: '专业队名',
    align: 'center',
    dataIndex: 'professionalTeamName',
    key: 'professionalTeamName',
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'professionalType',
    key: 'professionalType',
  },
  {
    title: '人数',
    align: 'center',
    dataIndex: 'memberNum',
    key: 'memberNum',
  },
];
