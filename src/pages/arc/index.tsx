import React, { useRef, useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { message } from 'antd';
import fetchUrl, {
  setMapProxy,
  formatCity,
  GetDistance,
  getInfo,
} from '../utils';
import { levelScale, fontUrl, mapConfig } from '../../configs';
import {
  searchSite,
  searchCity,
  getAllsite,
  getAnalysis,
  getDistrictNum,
  getCurrentCity,
  getAlarmByArea,
} from '../services';
import LeftStatics from './components/LeftStatics';
import RightStatics from './components/RightStatics';
import CommitGroup from './components/CommitGroup';
import Lonlatutide from './components/Lonlatutide';
import ExpandLeft from './components/ExpandLeft';
import ExpandRight from './components/ExpandRight';
import img from '../../assets/images/alarm.png';
import bg from '../../assets/images/bg.png';
import pointIMG from '../../assets/images/point.png';
import markerBg from '../../assets/images/newBg.png';
import tuoCircle from '../../assets/images/tuoCircle.png';
import circleIMG from '../../assets/images/circle.png';
import removeIMG from '../../assets/images/remove.png';
import headerIMG from '../../assets/images/header.png';
import titleIMG from '../../assets/images/title.png';

import styles from './index.less';

// hooks allow us to create a map component as a function

let map = null;
let oilAndGasLayer = null;
let oilAndGasLayer2 = null;
let oilAndGasLayer3 = null;
let showCircle = false;
let isdraw = false;
let measurePoint = [];
let measureList = [];
let drawTemp = { total: 0, graphic: [], measureId: '' };
let timetemp = Date.now();
let toolbar = null;
let measureId = 0;
let cityNum = [];
let areaNum = [];
let textMaker = null;
let alarmConstruct = null;
let areaList = [];
let newCityList = [];
let hackCityInfo = {
  areaName: '江苏省',
  level: '1',
  longitude: 119.24,
  latitude: 32.94,
};

let authInfo = { domainLevel: '', domainName: '' };
let alarmList = [];
let switchArea = null;
let searchList = [];

function EsriMap({ id }) {
  // create a ref to element to be used as the map's container
  const mapEl = useRef(null);
  const [cityValue, setCityValue] = useState('all');
  const [pointList, setPointList] = useState([]);
  const [positionInfo, setPositionInfo] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [cityInfo, setCityInfo] = useState({
    areaName: '',
    level: '1',
    longitude: 119.24,
    latitude: 32.94,
  });
  const [staticsData, setStaticsData] = useState({
    map: {},
    alarmLeftDatas: [],
  });
  const [cityList, setCityList] = useState([{ num: 0 }]);
  const [check, setCheck] = useState(0);
  const [total, setTotal] = useState(0);
  const [oldShow, setOldShow] = useState([false, false, false]);
  const [numSelect, setNumSelect] = useState(true);
  const [isArea, setIsArea] = useState(false);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShoRight] = useState(true);

  const getDetail = ({ areaName, level }) => {
    return fetchUrl(getAnalysis, { areaName, level, ...authInfo });
  };

  const goPoint = (longitude, latitude) => {
    setMapProxy();
    loadModules(['esri/geometry/Point', 'esri/SpatialReference']).then(
      ([Point, SpatialReference]) => {
        const scale = check ? mapConfig[1].scale : mapConfig[0].scale;
        map.setScale(scale).then(() => {
          map.centerAt(
            new Point(
              longitude,
              latitude,
              new SpatialReference({ wkid: 4490 }),
            ),
          );
        });
      },
    );
  };

  const gotoPlace = (text: string) => {
    if (!text) return;
    setMapProxy();
    loadModules(['esri/geometry/Point', 'esri/SpatialReference']).then(
      ([Point, SpatialReference]) => {
        fetchUrl(searchSite, { alarmSiteID: text, ...authInfo }).then(data => {
          if (data.flag) {
            message.success('查询警报点成功！');
            const alarmTemp = alarmConstruct(data.obj);
            searchList.push(alarmTemp);
            map.graphics.add(alarmTemp.pointGraphic);
            if (showCircle) {
              if (alarmTemp.alarmType !== '多媒体') {
                map.graphics.add(alarmTemp.circleGraphic);
                map.graphics.add(alarmTemp.lineGraphic);
                map.graphics.add(alarmTemp.textPointGraphic);
              }
            }
            const scale = check ? mapConfig[1].scale : mapConfig[0].scale;
            map.setScale(scale).then(() => {
              map.centerAt(
                new Point(
                  data.obj.longitude,
                  data.obj.latitude,
                  new SpatialReference({ wkid: 4490 }),
                ),
              );
            });
          } else {
            message.error('未搜索到警报点！');
          }
        });
      },
    );
  };

  const switchMap = value => {
    setCheck(value);
    switch (value) {
      case 1:
        const maxScale = mapConfig[1].maxScale;
        map._params.maxScale = maxScale;
        const scale = map.getScale();
        oilAndGasLayer.hide();
        oilAndGasLayer3.show();
        if (scale < maxScale) {
          map.setScale(maxScale);
        }
        break;
      case 0:
        map._params.maxScale = mapConfig[0].maxScale;
        oilAndGasLayer.show();
        oilAndGasLayer3.hide();
    }
  };

  const selectCity = (cityId, option) => {
    const length = option.length;
    if (option[length - 1].level < authInfo.domainLevel) {
      return;
    }
    setCityInfo({
      areaName: option[length - 1].value,
      level: option[length - 1].level,
      longitude: option[length - 1].longitude,
      latitude: option[length - 1].latitude,
    });
  };

  const budiancesuan = value => {
    showCircle = value;
    switch (value) {
      case true:
        const scale = map.getScale();
        if (hackCityInfo.level == '3') {
          alarmList.map(item => {
            // 判断老化
            if (numSelect && !checkOld(item.oldStatus)) {
              return;
            }
            if (!numSelect && !checkType(item.alarmType)) {
              return;
            }
            if (item.alarmType !== '多媒体') {
              map.graphics.add(item.circleGraphic);
              map.graphics.add(item.lineGraphic);
              map.graphics.add(item.textPointGraphic);
            }
          });
        }
        break;
      case false:
        alarmList.map(item => {
          map.graphics.remove(item.circleGraphic);
          map.graphics.remove(item.lineGraphic);
          map.graphics.remove(item.textPointGraphic);
        });
    }
  };

  const measure = () => {
    drawTemp.total = 0;
    drawTemp.graphic = [];
    drawTemp.measureId = '';
    if (isdraw) {
      toolbar.deactivate();
      isdraw = false;
      return;
    }
    setMapProxy();
    loadModules([
      'esri/toolbars/draw',
      'esri/symbols/CartographicLineSymbol',
      'esri/graphic',
      'esri/symbols/TextSymbol',
      'esri/geometry/Point',
    ]).then(([Draw, CartographicLineSymbol, Graphic, TextSymbol, Point]) => {
      toolbar = new Draw(map);
      const lineSymbol = new CartographicLineSymbol().setColor('red');
      isdraw = true;
      toolbar.activate(Draw.POLYLINE);
      function addToMap(evtObj) {
        measurePoint = [];
        isdraw = false;
        toolbar.deactivate();
        var geometry = evtObj.geometry;
        var graphic = new Graphic(geometry, lineSymbol);
        drawTemp.graphic.push(graphic);
        map.graphics.add(graphic);
      }
      toolbar.on('draw-end', addToMap);
    });
  };

  const checkOld = status => {
    if (!oldShow[0] && !oldShow[1] && !oldShow[2]) return true;
    switch (status) {
      case '正常':
        return oldShow[0];
      case '相对老化':
        return oldShow[1];
      case '严重老化':
        return oldShow[2];
    }
    return false;
  };

  const checkType = status => {
    if (!oldShow[0] && !oldShow[1] && !oldShow[2]) return true;
    if (status.indexOf('电声') > -1) {
      return oldShow[0];
    }
    if (status.indexOf('电动') > -1) {
      return oldShow[1];
    }
    if (status.indexOf('多媒体') > -1) {
      return oldShow[2];
    }
    return false;
  };

  const switchOld = () => {
    if (map) {
      const scale = map.getScale();
      if (hackCityInfo.level == '3') {
        alarmList.map(item => {
          if (checkOld(item.oldStatus)) {
            map.graphics.add(item.pointGraphic);
            if (showCircle) {
              if (item.alarmType !== '多媒体') {
                map.graphics.add(item.circleGraphic);
                map.graphics.add(item.lineGraphic);
                map.graphics.add(item.textPointGraphic);
              }
            }
          } else {
            map.graphics.remove(item.pointGraphic);
            map.graphics.remove(item.circleGraphic);
            map.graphics.remove(item.lineGraphic);
            map.graphics.remove(item.textPointGraphic);
          }
        });
      }
      if (staticsData.burnins) {
        const level = cityInfo.level;
        cityNum.forEach(item => {
          map.graphics.remove(item.pictureGraphic);
          map.graphics.remove(item.graphic);
        });
        areaNum.map(item => {
          item.map(ditem => {
            map.graphics.remove(ditem.pictureGraphic);
            map.graphics.remove(ditem.graphic);
          });
        });
        cityNum = newCityList.map(item => {
          let num = 0;
          const countList = [
            item.burninNumNormal,
            item.burninNumRelative,
            item.burninNumSeverity,
          ];
          if (oldShow[0] && oldShow[1] && oldShow[2]) {
            num = item.num;
          } else if (!oldShow[0] && !oldShow[1] && !oldShow[2]) {
            num = item.num;
          } else {
            countList.map((citem, cindex) => {
              if (oldShow[cindex]) {
                num += countList[cindex];
              }
            });
          }
          const textObj = textMaker(
            item.cityName,
            num,
            item,
            '2',
            item.cityName,
          );
          map.graphics.add(textObj.pictureGraphic);
          map.graphics.add(textObj.graphic);
          return {
            ...textObj,
            longitude: item.longitude,
            latitude: item.latitude,
            burninNumNormal: item.burninNumNormal,
            burninNumRelative: item.burninNumRelative,
          };
        });
        areaNum = areaList.map(item => {
          return item.map(ditem => {
            let num = 0;
            const countList = [
              ditem.burninNumNormal,
              ditem.burninNumRelative,
              ditem.burninNumSeverity,
            ];
            if (oldShow[0] && oldShow[1] && oldShow[2]) {
              num = ditem.num;
            } else if (!oldShow[0] && !oldShow[1] && !oldShow[2]) {
              num = ditem.num;
            } else {
              countList.map((citem, cindex) => {
                if (oldShow[cindex]) {
                  num += countList[cindex];
                }
              });
            }
            const index2 = ditem.name.indexOf('市');
            const newName = ditem.name.substr(index2 + 1, ditem.name.length);
            const textObj = textMaker(newName, num, ditem, '3', ditem.name);
            return {
              ...textObj,
              longitude: item.longitude,
              latitude: item.latitude,
              burninNumNormal: item.burninNumNormal,
              burninNumRelative: item.burninNumRelative,
              burninNumSeverity: item.burninNumSeverity,
            };
          });
        });
        const scale = map.getScale();
        switchArea && switchArea(scale);
      }
    }
  };

  const switchType = () => {
    if (map) {
      const scale = map.getScale();
      if (hackCityInfo.level == '3') {
        alarmList.map(item => {
          if (checkType(item.alarmType)) {
            map.graphics.add(item.pointGraphic);
            if (showCircle) {
              if (item.alarmType !== '多媒体') {
                map.graphics.add(item.circleGraphic);
                map.graphics.add(item.lineGraphic);
                map.graphics.add(item.textPointGraphic);
              }
            }
          } else {
            map.graphics.remove(item.pointGraphic);
            map.graphics.remove(item.circleGraphic);
            map.graphics.remove(item.lineGraphic);
            map.graphics.remove(item.textPointGraphic);
          }
        });
      }
      if (staticsData.burnins) {
        const level = cityInfo.level;
        cityNum.forEach(item => {
          map.graphics.remove(item.pictureGraphic);
          map.graphics.remove(item.graphic);
        });
        areaNum.map(item => {
          item.map(ditem => {
            map.graphics.remove(ditem.pictureGraphic);
            map.graphics.remove(ditem.graphic);
          });
        });
        cityNum = newCityList.map(item => {
          let num = 0;
          const countList = [item.dsNum, item.ddNum, item.mediaNum];
          if (oldShow[0] && oldShow[1] && oldShow[2]) {
            num = item.num;
          } else if (!oldShow[0] && !oldShow[1] && !oldShow[2]) {
            num = item.num;
          } else {
            countList.map((citem, cindex) => {
              if (oldShow[cindex]) {
                num += countList[cindex];
              }
            });
          }
          const textObj = textMaker(
            item.cityName,
            num,
            item,
            '2',
            item.cityName,
          );
          map.graphics.add(textObj.pictureGraphic);
          map.graphics.add(textObj.graphic);
          return {
            ...textObj,
            longitude: item.longitude,
            latitude: item.latitude,
            burninNumNormal: item.burninNumNormal,
            burninNumRelative: item.burninNumRelative,
          };
        });
        areaNum = areaList.map(item => {
          return item.map(ditem => {
            let num = 0;
            const countList = [ditem.dsNum, ditem.ddNum, ditem.mediaNum];
            if (oldShow[0] && oldShow[1] && oldShow[2]) {
              num = ditem.num;
            } else if (!oldShow[0] && !oldShow[1] && !oldShow[2]) {
              num = ditem.num;
            } else {
              countList.map((citem, cindex) => {
                if (oldShow[cindex]) {
                  num += countList[cindex];
                }
              });
            }
            const index2 = ditem.name.indexOf('市');
            const newName = ditem.name.substr(index2 + 1, ditem.name.length);
            const textObj = textMaker(newName, num, ditem, '3', ditem.name);
            return {
              ...textObj,
              longitude: item.longitude,
              latitude: item.latitude,
              burninNumNormal: item.burninNumNormal,
              burninNumRelative: item.burninNumRelative,
              burninNumSeverity: item.burninNumSeverity,
            };
          });
        });
        const scale = map.getScale();
        switchArea(scale);
      }
    }
  };

  useEffect(() => {
    const currentHash = window.location.hash;
    const index = currentHash.indexOf('?');
    let cityId = '';
    if (index < 0) {
      cityId = '';
    } else {
      cityId = currentHash.substr(index + 1, currentHash.length);
    }
    fetchUrl(getCurrentCity, { cityId }).then(cityData => {
      setIsArea(true);
      if (cityData.authority) {
        hackCityInfo = {
          areaName: cityData.obj.areaName,
          level: cityData.obj.level,
          longitude: cityData.obj.longitude,
          latitude: cityData.obj.latitude,
        };
        authInfo = {
          domainLevel: cityData.obj.domainLevel,
          domainName: cityData.obj.domainName,
        };
        setCityInfo({
          areaName: cityData.obj.areaName,
          level: cityData.obj.level,
          longitude: cityData.obj.longitude,
          latitude: cityData.obj.latitude,
        });
      }
      setMapProxy();
      loadModules([
        'esri/dijit/BasemapLayer',
        'esri/basemaps',
        'esri/map',
        'esri/dijit/Scalebar',
        'esri/toolbars/draw',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/TextSymbol',
        'esri/graphic',
        'esri/geometry/Circle',
        'esri/symbols/PictureMarkerSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/geometry/Polyline',
        'esri/InfoTemplate',
        'esri/Color',
        'esri/SpatialReference',
        'esri/symbols/Font',
        'dojo/domReady!',
      ]).then(
        ([
          BasemapLayer,
          esriBasemaps,
          Map,
          Scalebar,
          Draw,
          ArcGISDynamicMapServiceLayer,
          Point,
          SimpleMarkerSymbol,
          TextSymbol,
          Graphic,
          Circle,
          PictureMarkerSymbol,
          SimpleFillSymbol,
          SimpleLineSymbol,
          Polyline,
          InfoTemplate,
          Color,
          SpatialReference,
          Font,
        ]) => {
          oilAndGasLayer = new ArcGISDynamicMapServiceLayer(
            'http://172.23.79.30:8089/arcgis/rest/services/jssldt/MapServer',
            {
              id: 'oilAndGasLayer',
            },
          );
          oilAndGasLayer2 = new ArcGISDynamicMapServiceLayer(
            'http://172.23.79.30:8089/arcgis/rest/services/jszj/MapServer',
            {
              id: 'oilAndGasLayer2',
            },
          );

          oilAndGasLayer3 = new ArcGISDynamicMapServiceLayer(
            'http://172.23.79.30:8089/arcgis/rest/services/jsyx/MapServer',
            {
              id: 'oilAndGasLayer3',
            },
          );

          map = new Map(mapEl.current, {
            // basemap: 'streets',
            center: [118.78, 32.04], // long, lat
            scale: 2443008,
            minScale: 2443008, // User cannot zoom out beyond a scale of 1:500,000
            maxScale: 1850, // User can overzoom tiles
            autoResize: true,
            isScrollWheelZoom: false,
            isZoomSlider: false,
            logo: false,
          });
          var scalebar = new Scalebar({
            map: map,
            scalebarUnit: 'dual',
            attachTo: 'bottom-center',
          });
          map.addLayer(oilAndGasLayer);
          map.addLayer(oilAndGasLayer3);
          map.addLayer(oilAndGasLayer2);
          oilAndGasLayer3.hide();
          // 警报点构造函数
          alarmConstruct = alarmInfo => {
            var pt = new Point([alarmInfo.longitude, alarmInfo.latitude]);
            const str = getInfo(alarmInfo);
            var infoTemplate = new InfoTemplate(
              `警报器id：${alarmInfo.alarm_site_no}`,
              str,
            );
            var pointGraphic = new Graphic(
              pt,
              new PictureMarkerSymbol(img, 36, 36),
              {
                title: alarmInfo.alarm_site_no,
                info: str,
                longitude: alarmInfo.longitude,
                latitude: alarmInfo.latitude,
              },
              infoTemplate,
            );
            var circleGeometry = new Circle({
              center: pt,
              radius: Number(alarmInfo.radius),
              geodesic: true,
            });
            var circleSymb = new SimpleFillSymbol(
              SimpleFillSymbol.STYLE_NULL,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
                new Color('red'),
                2,
              ),
              new Color([255, 255, 0, 0.25]),
            );
            var circleGraphic = new Graphic(circleGeometry, circleSymb);
            var line = new Polyline({
              paths: [
                [
                  [circleGeometry.center.x, circleGeometry.center.y],
                  circleGeometry.rings[0][45],
                ],
              ],
            });
            var lineSymbol = new SimpleLineSymbol();
            lineSymbol.setColor('red');
            var lineGraphic = new Graphic(line, lineSymbol);
            var textPoint = new Point([
              (Number(circleGeometry.rings[0][45][0]) +
                Number(circleGeometry.center.x)) /
                2,
              (Number(circleGeometry.rings[0][45][1]) +
                Number(circleGeometry.center.y)) /
                2 +
                0.00005,
            ]);
            var textSymbol = new TextSymbol(`半径:${alarmInfo.radius}米`);
            var textPointGraphic = new Graphic(textPoint, textSymbol);
            return {
              pointGraphic,
              circleGraphic,
              lineGraphic,
              textPointGraphic,
              alarmType: alarmInfo.alarm_type,
              oldStatus: alarmInfo.burnin_status,
            };
          };

          map.on('load', function() {
            map.setScale(levelScale.get(hackCityInfo.level)).then(() => {
              map.centerAt(
                new Point(
                  hackCityInfo.longitude,
                  hackCityInfo.latitude,
                  new SpatialReference({ wkid: 4490 }),
                ),
              );
            });
            Promise.all([
              // fetchUrl(searchCity),
              // fetchUrl(getAllsite),
              fetchUrl(getDistrictNum, { ...authInfo }),
            ])
              .then(([data3]) => {
                const cityList = data3.obj.list.map(item => {
                  return {
                    cityName: item.name,
                    ...item,
                  };
                });
                newCityList = data3.obj.list.map(item => {
                  return {
                    cityName: item.name,
                    ...item,
                  };
                });
                // const alarmList = data2.obj;
                data3.obj.longitude = 119.24;
                data3.obj.latitude = 32.94;
                // 各区县经纬度
                areaList = data3.obj.list.map(item => item.list);
                setCityList(formatCity([data3.obj]));
                textMaker = (name, num, item, level, newName) => {
                  let textSymbol = new TextSymbol(`${name}: ${num}个`)
                    .setColor(new Color('blue'))
                    .setOffset(0, -4);
                  var font = new Font();
                  font.setSize('11pt');
                  font.setWeight(Font.WEIGHT_BOLD);
                  font.setFamily('黑体');
                  textSymbol.setFont(font);
                  let pictureMarkerSymbol = new PictureMarkerSymbol(
                    tuoCircle,
                    100,
                    30,
                  );
                  let pt = new Point([item.longitude, item.latitude]);
                  let graphic = new Graphic(pt, textSymbol, {
                    cityName: newName,
                    longitude: item.longitude,
                    latitude: item.latitude,
                    level,
                  });
                  let pictureGraphic = new Graphic(pt, pictureMarkerSymbol, {
                    cityName: newName,
                    longitude: item.longitude,
                    latitude: item.latitude,
                    level,
                  });
                  return { graphic, pictureGraphic };
                };
                // 添加text、背景标签
                cityNum = cityList.map(item => {
                  const textObj = textMaker(
                    item.name,
                    item.num,
                    item,
                    '2',
                    item.name,
                  );
                  // 处理只有区权限的情况
                  if (hackCityInfo.level != '3') {
                    console.log('进来啦！！！');
                    map.graphics.add(textObj.pictureGraphic);
                    map.graphics.add(textObj.graphic);
                  }
                  return {
                    ...textObj,
                    longitude: item.longitude,
                    latitude: item.latitude,
                    burninNumNormal: item.burninNumNormal,
                    burninNumRelative: item.burninNumRelative,
                    burninNumSeverity: item.burninNumSeverity,
                    dsNum: item.dsNum,
                    ddNum: item.ddNum,
                    mediaNum: item.mediaNum,
                  };
                });
                // 区县的标签
                areaNum = areaList.map(item => {
                  return item.map(ditem => {
                    const index2 = ditem.name.indexOf('市');
                    const newName = ditem.name.substr(
                      index2 + 1,
                      ditem.name.length,
                    );
                    const textObj = textMaker(
                      newName,
                      ditem.num,
                      ditem,
                      '3',
                      ditem.name,
                    );
                    return {
                      ...textObj,
                      longitude: item.longitude,
                      latitude: item.latitude,
                      burninNumNormal: item.burninNumNormal,
                      burninNumRelative: item.burninNumRelative,
                      burninNumSeverity: item.burninNumSeverity,
                      dsNum: item.dsNum,
                      ddNum: item.ddNum,
                      mediaNum: item.mediaNum,
                    };
                  });
                });
                // 处理只有区权限的情况
                if (hackCityInfo.level == '3') {
                  cityNum = [];
                  newCityList = [];
                  areaNum = [];
                  fetchUrl(getAlarmByArea, {
                    ...hackCityInfo,
                    ...authInfo,
                  }).then(alarmData => {
                    if (alarmData.obj) {
                      const list = alarmData.obj.map(item =>
                        alarmConstruct(item),
                      );
                      alarmList = list;
                      list.map(alarmItem => {
                        map.graphics.add(alarmItem.pointGraphic);
                        if (showCircle) {
                          if (item.alarmType !== '多媒体') {
                            map.graphics.add(alarmItem.circleGraphic);
                            map.graphics.add(alarmItem.lineGraphic);
                            map.graphics.add(alarmItem.textPointGraphic);
                          }
                        }
                      });
                    }
                  });
                }
                // 修改默认样式
                const scaleBar = document.getElementsByClassName(
                  'esriScalebar',
                );
                scaleBar[0].style.left = '70%';
                const maxMInux = document.getElementById(
                  'esri.Map_0_zoom_slider',
                );
                if (maxMInux) maxMInux.style.display = 'none';
                let showAlarm = true;
                let showPoint = true;
                let showText = true;
                const switchAlarm = e => {
                  if (hackCityInfo.level == '3') {
                    alarmList.forEach(item => {
                      // 判断老化
                      if (numSelect && !checkOld(item.oldStatus)) {
                        return;
                      }
                      if (!numSelect && !checkType(item.alarmType)) {
                        return;
                      }
                      map.graphics.add(item.pointGraphic);
                      if (showCircle) {
                        if (item.alarmType !== '多媒体') {
                          map.graphics.add(item.circleGraphic);
                          map.graphics.add(item.lineGraphic);
                          map.graphics.add(item.textPointGraphic);
                        }
                      }
                    });
                  } else {
                    alarmList.forEach(item => {
                      map.graphics.remove(item.pointGraphic);
                      map.graphics.remove(item.circleGraphic);
                      map.graphics.remove(item.lineGraphic);
                      map.graphics.remove(item.textPointGraphic);
                    });
                  }
                };
                const switchPoint = e => {
                  if (e <= 60000 && e > 7000) {
                    if (showPoint) {
                      showPoint = false;
                      pointList.forEach(item => {
                        map.graphics.add(item.pointGraphic);
                      });
                    }
                  } else {
                    showPoint = true;
                    pointList.forEach(item => {
                      map.graphics.remove(item.pointGraphic);
                    });
                  }
                };
                switchArea = e => {
                  if (hackCityInfo.level == '3') {
                    areaNum.map(item => {
                      item.map(ditem => {
                        map.graphics.remove(ditem.pictureGraphic);
                        map.graphics.remove(ditem.graphic);
                      });
                    });
                    return;
                  }
                  if (e < 152688 && e > 60001) {
                    areaNum.map(item => {
                      item.map(ditem => {
                        map.graphics.add(ditem.pictureGraphic);
                        map.graphics.add(ditem.graphic);
                      });
                    });
                  } else {
                    console.log('删除成功');
                    areaNum.map(item => {
                      item.map(ditem => {
                        if (e >= 152688) {
                          map.graphics.remove(ditem.pictureGraphic);
                          map.graphics.remove(ditem.graphic);
                        }
                        if (alarmList.length != 0) {
                          map.graphics.remove(ditem.pictureGraphic);
                          map.graphics.remove(ditem.graphic);
                        }
                      });
                    });
                  }
                };
                switchAlarm(map.getScale());
                switchArea(map.getScale());
                map.on('mouse-wheel', function(e) {
                  const scale = map.getScale();
                  if (scale < 7000) {
                    var centerPoint = map.extent.getCenter();
                    map.reposition();
                    var pt = new Point(
                      119.24,
                      32.94,
                      new SpatialReference({ wkid: 4490 }),
                    );
                    map.centerAt(centerPoint);
                    map.reposition();
                  }
                  if (scale > 2440000) {
                    map.reposition();
                    var pt = new Point(
                      119.24,
                      32.94,
                      new SpatialReference({ wkid: 4490 }),
                    );
                    map.centerAt(pt);
                    map.reposition();
                  }
                });
                map.on('pan-start', function(e) {
                  map.reposition();
                });
                map.on('pan', function(e) {
                  map.reposition();
                });
                map.on('pan-end', function(e) {
                  map.reposition();
                });
                map.on('zoom-end', function(evt) {
                  console.log(map.getScale());
                  switchAlarm(map.getScale());
                  // switchPoint(map.getScale());
                  switchArea(map.getScale());
                });
                map.on('dbl-click', function(evt) {
                  if (isdraw) {
                    let textSymbol = new TextSymbol(
                      `总计${drawTemp.total.toFixed(2)}公里`,
                    )
                      .setColor('white')
                      .setOffset(50, 40);
                    var totalGraphic = new Graphic(evt.mapPoint, textSymbol);
                    let pictureMarkerSymbol = new PictureMarkerSymbol(
                      markerBg,
                      120,
                      24,
                    ).setOffset(50, 45);
                    let removeSymbol = new PictureMarkerSymbol(
                      removeIMG,
                      24,
                      24,
                    ).setOffset(20, -20);
                    let removeGraphic = new Graphic(
                      evt.mapPoint,
                      removeSymbol,
                      { commit: 'remove', id: measureId },
                    );
                    drawTemp.measureId = measureId;
                    measureId++;
                    let newPicture = new Graphic(
                      evt.mapPoint,
                      pictureMarkerSymbol,
                    );
                    drawTemp.graphic.push(newPicture);
                    drawTemp.graphic.push(totalGraphic);
                    drawTemp.graphic.push(removeGraphic);
                    map.graphics.add(newPicture);
                    map.graphics.add(totalGraphic);
                    map.graphics.add(removeGraphic);
                    measureList.push({
                      total: drawTemp.total,
                      graphic: drawTemp.graphic,
                      measureId: drawTemp.measureId,
                    });
                  }
                });
                map.on('click', function(evt) {
                  if (
                    evt.graphic &&
                    evt.graphic.attributes &&
                    evt.graphic.attributes.cityName
                  ) {
                    const areaName = evt.graphic.attributes.cityName;
                    const longitude = evt.graphic.attributes.longitude;
                    const latitude = evt.graphic.attributes.latitude;
                    const level = evt.graphic.attributes.level;
                    setCityInfo({ areaName, longitude, latitude, level });
                  }
                  if (
                    evt.graphic &&
                    evt.graphic.attributes &&
                    evt.graphic.attributes.commit
                  ) {
                    const measureId = evt.graphic.attributes.id;
                    const measureLine = measureList.find(
                      item => item.measureId === measureId,
                    );
                    measureLine.graphic.map(item => {
                      map.graphics.remove(item);
                    });
                  }
                  if (isdraw) {
                    let clickTime = Date.now();
                    if (clickTime - timetemp < 300) {
                      timetemp = Date.now();
                      return;
                    }
                    timetemp = Date.now();
                    measurePoint.push(evt.mapPoint);
                    let pictureMarkerSymbol = new PictureMarkerSymbol(
                      circleIMG,
                      16,
                      16,
                    );
                    let pictureGraphic = new Graphic(
                      evt.mapPoint,
                      pictureMarkerSymbol,
                    );
                    const pointLength = measurePoint.length;
                    if (pointLength > 1) {
                      let distance = GetDistance(
                        measurePoint[pointLength - 2],
                        measurePoint[pointLength - 1],
                      );
                      drawTemp.total += Number(distance);
                      let textSymbol = new TextSymbol(`${distance}公里`)
                        .setColor(new Color('white'))
                        .setOffset(10, 10);
                      let distanceGraphic = new Graphic(
                        evt.mapPoint,
                        textSymbol,
                      );
                      let pictureMarkerSymbol = new PictureMarkerSymbol(
                        markerBg,
                        70,
                        24,
                      ).setOffset(10, 15);
                      let newPicture = new Graphic(
                        evt.mapPoint,
                        pictureMarkerSymbol,
                      );
                      drawTemp.graphic.push(newPicture);
                      drawTemp.graphic.push(distanceGraphic);
                      map.graphics.add(newPicture);
                      map.graphics.add(distanceGraphic);
                    }
                    drawTemp.graphic.push(pictureGraphic);
                    map.graphics.add(pictureGraphic);
                  }
                });
                map.on('mouse-move', function(evt) {
                  setPositionInfo({
                    longitude: evt.mapPoint.x,
                    latitude: evt.mapPoint.y,
                  });
                });
                map.on('mouse-over', function(evt) {
                  // 需求改完点击展示
                  // if (
                  //   evt.graphic &&
                  //   evt.graphic.attributes &&
                  //   evt.graphic.attributes.title
                  // ) {
                  //   var title = `警报器id:${evt.graphic.attributes.title}`;
                  //   var content = evt.graphic.attributes.info;
                  //   map.infoWindow.setTitle(title);
                  //   map.infoWindow.setContent(content);
                  //   // Show the info window
                  //   map.infoWindow.show(evt.mapPoint);
                  // } else {
                  //   map.infoWindow.hide();
                  // }
                });
              })
              .catch(e => {
                console.log(e);
              });
          });
        },
      );
    });
  }, []);

  useEffect(() => {
    // setOldShow([false, false, false]);
    if (map) {
      setMapProxy();
      loadModules(['esri/geometry/Point', 'esri/SpatialReference']).then(
        ([Point, SpatialReference]) => {
          map.setScale(levelScale.get(cityInfo.level)).then(() => {
            map.centerAt(
              new Point(
                cityInfo.longitude,
                cityInfo.latitude,
                new SpatialReference({ wkid: 4490 }),
              ),
            );
          });
        },
      );
      hackCityInfo = {
        ...cityInfo,
      };
      searchList.map(item => {
        map.graphics.remove(item.pointGraphic);
        map.graphics.remove(item.circleGraphic);
        map.graphics.remove(item.lineGraphic);
        map.graphics.remove(item.textPointGraphic);
      });
      if (cityInfo.level == '3') {
        // TODO: 根据区获取警报点
        fetchUrl(getAlarmByArea, { ...cityInfo, ...authInfo }).then(
          alarmData => {
            alarmList.map(item => {
              map.graphics.remove(item.pointGraphic);
              map.graphics.remove(item.circleGraphic);
              map.graphics.remove(item.lineGraphic);
              map.graphics.remove(item.textPointGraphic);
            });
            if (alarmData.obj) {
              const list = alarmData.obj.map(item => alarmConstruct(item));
              alarmList = list;
              list.map(alarmItem => {
                map.graphics.add(alarmItem.pointGraphic);
                if (showCircle) {
                  if (item.alarmType !== '多媒体') {
                    map.graphics.add(alarmItem.circleGraphic);
                    map.graphics.add(alarmItem.lineGraphic);
                    map.graphics.add(alarmItem.textPointGraphic);
                  }
                }
              });
            }
          },
        );
      } else {
        alarmList.map(item => {
          map.graphics.remove(item.pointGraphic);
          map.graphics.remove(item.circleGraphic);
          map.graphics.remove(item.lineGraphic);
          map.graphics.remove(item.textPointGraphic);
        });
        alarmList = [];
      }
    }
    if (isArea) {
      getDetail(cityInfo)
        .then(data => {
          setStaticsData(data.obj);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [cityInfo]);

  // 切换老化等等
  useEffect(() => {
    if (numSelect) {
      switchOld();
    } else {
      switchType();
    }
  }, [oldShow]);
  return (
    <div
      style={{
        padding: 0,
        margin: 0,
        background: 'white',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <div className={styles.topHead}>
        {/* <span>布点测算</span> */}
        <img
          src={titleIMG}
          style={{
            // width: '24vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: '26px',
          }}
        ></img>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '4px', // 84px
          left: '0', // 18vw
          // marginLeft: '20px',
          zIndex: 39,
        }}
      >
        <CommitGroup
          selectCity={selectCity}
          gotoPlace={gotoPlace}
          mapCheck={check}
          switchMap={switchMap}
          showCircle={showCircle}
          budiancesuan={budiancesuan}
          cityList={cityList}
          measure={measure}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '8px', // 84px
          right: '0', // 18vw
          // marginRight: '20px',
          zIndex: 38,
        }}
      >
        <Lonlatutide
          longitude={positionInfo.longitude}
          latitude={positionInfo.latitude}
        />
      </div>
      {showLeft && (
        <div className={styles.statics}>
          <LeftStatics
            total={total}
            getDetail={getDetail}
            searchData={staticsData}
            cityList={cityList}
            cityInfo={cityInfo}
            setCityInfo={setCityInfo}
            oldShow={oldShow}
            setOldShow={setOldShow}
            goPoint={goPoint}
            numSelect={numSelect}
            setNumSelect={setNumSelect}
            authInfo={authInfo}
          />
        </div>
      )}
      <div
        onClick={() => setShowLeft(!showLeft)}
        className={styles.leftShou}
        style={{ left: showLeft ? '18vw' : 0 }}
      >
        <ExpandLeft
          hideSide={() => setShowLeft(!showLeft)}
          place="left"
          show={showLeft}
        />
      </div>
      <div
        onClick={() => setShoRight(!showRight)}
        className={styles.rightShou}
        style={{ right: showRight ? '18vw' : 0 }}
      >
        <ExpandRight
          hideSide={() => setShoRight(!showRight)}
          place="right"
          show={showRight}
        />
      </div>
      {showRight && (
        <div className={styles.statics} style={{ right: 0 }}>
          <RightStatics searchData={staticsData} />
        </div>
      )}
      <div style={{ height: '100vh' }} ref={mapEl} />
    </div>
  );
}

const Demo = () => <EsriMap id="e691172598f04ea8881cd2a4adaa45ba" />;

export default Demo;
