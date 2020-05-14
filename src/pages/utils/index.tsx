import qs from 'qs';
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import { setDefaultOptions } from 'esri-loader';
import { apiUrl, cssUrl, fontUrl } from '../../configs';
import { message } from 'antd';

const fetchUrl = (url, param = {}, method = 'POST') => {
  return new Promise((resolve, reject) => {
    fetchPolyfill(`${url}?${param ? qs.stringify(param) : ''}`, {
      method,
    })
      .then(response => {
        if (response.status !== 200) {
          reject('fail');
          throw new Error('fail');
        }
        response.json().then(data => {
          if (data.authority) {
            resolve(data);
          } else {
            message.error('对不起，您无权限访问！');
            reject('fail');
          }
        });
      })
      .catch(e => {
        console.log('服务器异常', e);
      });
  });
};

export const setMapProxy = () => {
  setDefaultOptions({
    url: apiUrl,
    css: cssUrl,
  });
};

export const formatCity = data => {
  return data.map(item => {
    if (item.list) {
      return {
        value: item.name || item.areaName,
        label: item.name || item.areaName,
        children: formatCity(item.list),
        ...item,
      };
    } else {
      return {
        value: item.name || item.areaName,
        label: item.name || item.areaName,
        ...item,
      };
    }
  });
};

// 方法定义 lat,lng
export const GetDistance = (point1, point2) => {
  var radLat1 = (point1.y * Math.PI) / 180.0;
  var radLat2 = (point2.y * Math.PI) / 180.0;
  var a = radLat1 - radLat2;
  var b = (point1.x * Math.PI) / 180.0 - (point2.x * Math.PI) / 180.0;
  var s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2),
      ),
    );
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s.toFixed(2);
};

// 信息框内容
export const getInfo = item => {
  return `<div style="font-family: Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif!important"><span style="font-weight:bolder">经度</span>：${item.longitude}, <span style="font-weight:bolder">纬度</span>：${item.latitude}<br />
  <span style="font-weight:bolder">所属城市</span>：${item.attribution_city}<br />
  <span style="font-weight:bolder">管辖区县</span>：${item.admin_district}<br />
  <span style="font-weight:bolder">管辖区县负责人</span>：${item.attribution_street_charger}<br />
  <span style="font-weight:bolder">所属街(镇)</span>：${item.attribution_street}<br />
  <span style="font-weight:bolder">所属街(镇)负责人</span>：${item.attribution_street_charger}<br />
  <span style="font-weight:bolder">设点单位</span>：${item.establish_unit}<br />
  <span style="font-weight:bolder">设点单位地址</span>：${item.establish_unit_addr}<br />
  <span style="font-weight:bolder">设点单位维管人姓名</span>：${item.establish_unitmaintainer_name}<br />
  <span style="font-weight:bolder">设点单位维管人电话</span>：${item.establish_unitmaintainer_tel}<br />
  <span style="font-weight:bolder">警报器类型</span>：${item.alarm_type}<br />
  <span style="font-weight:bolder">警报器型号</span>：${item.alarm_model}<br />
  <span style="font-weight:bolder">生产厂家</span>：${item.manufacturer}<br />
  <span style="font-weight:bolder">安装厂家</span>：${item.install_manufacturer}<br />
  <span style="font-weight:bolder">警报器功率(W)</span>：${item.alarm_power}<br />
  <span style="font-weight:bolder">安装时间</span>：${item.install_time}<br />
  <span style="font-weight:bolder">设备状况</span>：${item.dev_status}<br />
  <span style="font-weight:bolder">是否可升降</span>：${item.can_rise_fall}<br />
  <span style="font-weight:bolder">控制方式</span>：${item.control_mode}<br />
  </div>`;
};

export const getInfoSHU = item => {
  return `<div style="font-family: Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif!important"><span style="font-weight:bolder">经度</span>：${item.longitude}, <span style="font-weight:bolder">纬度</span>：${item.latitude}<br />
  <span style="font-weight:bolder">基地名称</span>：${item.base_name}<br />
  <span style="font-weight:bolder">基地地址</span>：${item.base_address}<br />
  <span style="font-weight:bolder">管理单位</span>：${item.manage_unit}<br />
  <span style="font-weight:bolder">联系人</span>：${item.contacts}<br />
  <span style="font-weight:bolder">联系人电话</span>：${item.telphone}<br />
  <span style="font-weight:bolder">最大可接收人数</span>：${item.max_acceptable_population}<br />
  <span style="font-weight:bolder">面积</span>：${item.area}<br />
  <span style="font-weight:bolder">是否具备基本生活条件</span>：${item.has_baseLiving_condition}<br /> 
  <span style="font-weight:bolder">是否配备指挥场所</span>：${item.has_conmandPlace}<br /> 
  <span style="font-weight:bolder">床位数</span>：${item.bed_count}<br /> 
  <span style="font-weight:bolder">床位数占疏散人口总数的比重</span>：${item.bed_proportion}<br /> 
  <span style="font-weight:bolder">具备详细的供水、用水水源管理方案：</span>${item.has_water_case}<br />
  <span style="font-weight:bolder">满足30日燃料供应储备：</span>${item.has_thitydays_fuel}<br /> 
  <span style="font-weight:bolder">保持50日粮油食品储备：</span>${item.has_fiftydays_food}<br />
  <span style="font-weight:bolder">专款专用建设资金：</span>${item.has_target_funds}<br /> 
  <span style="font-weight:bolder">具备维护管理资金: </span>${item.has_maintenance_funds}<br />
  <span style="font-weight:bolder">按要求设置相应应急标志：</span>${item.has_emergency_sign}<br /> 
  <span style="font-weight:bolder">按照疏散标准修建疏散干道和迂回疏散道路：</span>${item.has_detour_road}<br />
  <span style="font-weight:bolder">满足战时疏散通讯保障要求：</span>${item.has_wartime_comsupport}<br /> 
  </div>`;
};

export const getInfoTeam = item => {
  return `<div style="font-family: Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif!important">
  <span style="font-weight:bolder">基地名称</span>：${item.areaName}<br />
  <span style="font-weight:bolder">区域名称</span>：${item.areaName}<br />
  <span style="font-weight:bolder">区域代码</span>：${item.areaCode}<br />
  <span style="font-weight:bolder">专业队名称</span>：${item.professionalTeamName}<br />
  <span style="font-weight:bolder">专业类别</span>：${item.professionalType}<br />
  <span style="font-weight:bolder">建制级别</span>：${item.organizationLevel}<br />
  <span style="font-weight:bolder">组扩建标志</span>：${item.organizeMark}<br />
  <span style="font-weight:bolder">指挥隶属关系</span>：${item.membership}<br />
  <span style="font-weight:bolder">专业队人数</span>：${item.memberNum}<br />
  <span style="font-weight:bolder">专业队负责人</span>：${item.teamCharger}<br />
  <span style="font-weight:bolder">专业队负责人电话</span>：${item.teamChargerTel}<br />
  <span style="font-weight:bolder">配置地域</span>：${item.configRegion}<br />
  <span style="font-weight:bolder">配置地域经度</span>：${item.configRegionLongitude}<br />
  <span style="font-weight:bolder">配置地域纬度</span>：${item.configRegionLatitude}<br />
  <span style="font-weight:bolder">主要任务</span>：${item.mainJob}<br />
  <span style="font-weight:bolder">创建时间</span>：${item.create_time}<br />
  <span style="font-weight:bolder">更新时间</span>：${item.update_time}<br />
  </div>`;
};

export default fetchUrl;
