// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { message } from 'antd';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import fetchUrl, {
  setMapProxy,
  formatCity,
  GetDistance,
  getInfoTeam,
  getCityId,
} from '../utils';
import { levelScale, fontUrl, mapConfig, mapUrl } from '../../configs';
import {
  searchTeam,
  getAnalysisTeam,
  getTagNum,
  getCurrentCity,
  getTeamByArea,
} from '../services';
import LeftStatics from './components/LeftStatics';
import RightStatics from './components/RightStatics';
import CommitGroup from './components/CommitGroup';
import Lonlatutide from './components/Lonlatutide';
import ExpandLeft from './components/ExpandLeft';
import ExpandRight from './components/ExpandRight';
import img from '../../assets/images/teamIcon.png';
import bg from '../../assets/images/bg.png';
import pointIMG from '../../assets/images/point.png';
import markerBg from '../../assets/images/newBg.png';
import tuoCircle from '../../assets/images/tuoCircle.png';
import circleIMG from '../../assets/images/circle.png';
import removeIMG from '../../assets/images/remove.png';
import headerIMG from '../../assets/images/header.png';
import titleIMG from '../../assets/images/title3.png';

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
let searchList = [];
let switchArea = null;
const proTeamList = [
  { name: '交通运输专业队' },
  { name: '伪装设障专业队' },
  { name: '信息防护专业队' },
  { name: '心理防护专业队' },
  { name: '抢险抢修专业队' },
  { name: '医疗救护专业队' },
  { name: '消防专业队' },
  { name: '治安专业队' },
  { name: '防化防疫专业队' },
  { name: '通信专业专业队' },
  { name: '合成专业队' },
  { name: '其他专业专业队' },
];

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
    evaBaseLeftData: [{ sumArea: 0, sumMaxPeople: 0 }],
    evaBaseTable: [],
    proteamInfoCollects: null,
    proteamLeftDatas: [],
  });
  const [cityList, setCityList] = useState([{ num: 0 }]);
  const [check, setCheck] = useState(0);
  const [total, setTotal] = useState(0);
  const [oldShow, setOldShow] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [numSelect, setNumSelect] = useState(true);
  const [isArea, setIsArea] = useState(false);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShoRight] = useState(true);

  const getDetail = ({ areaName, level }) => {
    return fetchUrl(getAnalysisTeam, { areaName, level, ...authInfo });
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

  const gotoPlace = baseinfo => {
    setMapProxy();
    loadModules(['esri/geometry/Point', 'esri/SpatialReference']).then(
      ([Point, SpatialReference]) => {
        message.success('查询疏散地域成功！');
        const baseTemp = alarmConstruct({
          longitude: baseinfo.configRegionLongitude,
          latitude: baseinfo.configRegionLatitude,
          ...baseinfo,
        });
        map.graphics.add(baseTemp.pointGraphic);
        searchList.push(baseTemp);
        const scale = check ? mapConfig[1].scale : mapConfig[0].scale;
        map.setScale(scale).then(() => {
          map.centerAt(
            new Point(
              baseinfo.configRegionLongitude,
              baseinfo.configRegionLatitude,
              new SpatialReference({ wkid: 4490 }),
            ),
          );
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
        if (scale <= 60000) {
          alarmList.map(item => {
            // 判断老化
            if (!checkOld(item.professionalType)) {
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
    console.log(status);
    let flag = true;
    oldShow.map(item => {
      if (item) {
        flag = false;
      }
    });
    if (flag) {
      return true;
    }
    proTeamList.map((item, index) => {
      if (item.name === status) {
        flag = oldShow[index];
      }
    });
    return flag;
  };

  const switchOld = () => {
    if (map) {
      const scale = map.getScale();
      if (hackCityInfo.level == '3') {
        alarmList.map(item => {
          if (checkOld(item.professionalType)) {
            map.graphics.add(item.pointGraphic);
          } else {
            map.graphics.remove(item.pointGraphic);
            map.graphics.remove(item.circleGraphic);
            map.graphics.remove(item.lineGraphic);
            map.graphics.remove(item.textPointGraphic);
          }
        });
      }
      if (staticsData.proteamInfoCollects) {
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
          let nums = 0;
          const countList = item.proteamInfoCollect;
          const newShow = uniq(oldShow);
          if (newShow.length === 1) {
            nums = item.nums;
          } else {
            countList.map((citem, cindex) => {
              if (oldShow[cindex]) {
                nums += countList[cindex].nums;
              }
            });
          }
          const textObj = textMaker(
            item.areaName,
            nums,
            item,
            '2',
            item.areaName,
          );
          map.graphics.add(textObj.pictureGraphic);
          map.graphics.add(textObj.graphic);
          return {
            ...textObj,
            longitude: item.longitude,
            latitude: item.latitude,
            professionalType: item.professionalType,
          };
        });
        areaNum = areaList.map(item => {
          return item.map(ditem => {
            let nums = 0;
            const countList = ditem.proteamInfoCollect;
            const newShow = uniq(oldShow);
            if (newShow.length === 1) {
              nums = ditem.nums;
            } else {
              countList.map((citem, cindex) => {
                if (oldShow[cindex]) {
                  nums += citem.nums;
                }
              });
            }
            const index2 = ditem.areaName.indexOf('市');
            const newName = ditem.areaName.substr(
              index2 + 1,
              ditem.areaName.length,
            );
            const textObj = textMaker(
              newName,
              nums,
              ditem,
              '3',
              ditem.areaName,
            );
            return {
              ...textObj,
              longitude: item.longitude,
              latitude: item.latitude,
              professionalType: item.professionalType,
            };
          });
        });
        const scale = map.getScale();
        switchArea && switchArea(scale);
      }
    }
  };

  useEffect(() => {
    const { cityId } = getCityId();
    fetchUrl(getCurrentCity, { cityId })
      .then(cityData => {
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
            oilAndGasLayer = new ArcGISDynamicMapServiceLayer(mapUrl[0], {
              id: 'oilAndGasLayer',
            });
            oilAndGasLayer2 = new ArcGISDynamicMapServiceLayer(mapUrl[1], {
              id: 'oilAndGasLayer2',
            });

            oilAndGasLayer3 = new ArcGISDynamicMapServiceLayer(mapUrl[2], {
              id: 'oilAndGasLayer3',
            });

            map = new Map(mapEl.current, {
              // basemap: 'streets',
              center: [118.78, 32.04], // long, lat
              scale: 2443008,
              minScale: 2443008, // User cannot zoom out beyond a scale of 1:500,000
              maxScale: 1850, // User can overzoom tiles
              autoResize: false,
              isScrollWheelZoom: false,
              isZoomSlider: false,
              slider: false,
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

            // 数量标签构造函数
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
            // 警报点构造函数
            alarmConstruct = alarmInfo => {
              var pt = new Point([
                alarmInfo.configRegionLongitude,
                alarmInfo.configRegionLatitude,
              ]);
              const str = getInfoTeam(alarmInfo);
              var infoTemplate = new InfoTemplate(
                `专业队名称：${alarmInfo.professionalTeamName}`,
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
                professionalType: alarmInfo.professionalType,
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
              Promise.all([fetchUrl(getTagNum, { ...authInfo })])
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
                  // 各区县经纬度
                  areaList = data3.obj.list.map(item => item.list);
                  setCityList(formatCity([data3.obj]));
                  // 添加地级市标签
                  cityNum = cityList.map(item => {
                    const textObj = textMaker(
                      item.areaName,
                      item.nums,
                      item,
                      '2',
                      item.areaName,
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
                      proteamInfoCollect: item.proteamInfoCollect,
                    };
                  });
                  // 区县的标签
                  areaNum = areaList.map(item => {
                    return item.map(ditem => {
                      const index2 = ditem.areaName.indexOf('市');
                      const newName = ditem.areaName.substr(
                        index2 + 1,
                        ditem.areaName.length,
                      );
                      const textObj = textMaker(
                        newName,
                        ditem.nums,
                        ditem,
                        '3',
                        ditem.areaName,
                      );
                      return {
                        ...textObj,
                        longitude: item.longitude,
                        latitude: item.latitude,
                        proteamInfoCollect: item.proteamInfoCollect,
                      };
                    });
                  });
                  // 处理只有区权限的情况
                  if (hackCityInfo.level == '3') {
                    cityNum = [];
                    newCityList = [];
                    areaNum = [];
                    fetchUrl(getTeamByArea, {
                      ...hackCityInfo,
                      ...authInfo,
                    }).then(alarmData => {
                      if (alarmData.obj) {
                        const list = alarmData.obj.map(item => {
                          return item.proteamInfos;
                        });
                        const newList = flatten(list);
                        alarmList = newList.map(item => alarmConstruct(item));
                        alarmList.map(alarmItem => {
                          map.graphics.add(alarmItem.pointGraphic);
                          if (showCircle) {
                            map.graphics.add(alarmItem.circleGraphic);
                            map.graphics.add(alarmItem.lineGraphic);
                            map.graphics.add(alarmItem.textPointGraphic);
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
                        if (!checkOld(item.professionalType)) {
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
                    if (e < 152688) {
                      areaNum.map(item => {
                        item.map(ditem => {
                          map.graphics.add(ditem.pictureGraphic);
                          map.graphics.add(ditem.graphic);
                        });
                      });
                    } else {
                      areaNum.map(item => {
                        item.map(ditem => {
                          map.graphics.remove(ditem.pictureGraphic);
                          map.graphics.remove(ditem.graphic);
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
                  map.on('zoom-end', function(evt) {
                    console.log(map.getScale());
                    switchAlarm(map.getScale());
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
                })
                .catch(e => {
                  console.log(e);
                });
            });
          },
        );
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    // setOldShow([
    //   false,
    //   false,
    //   false,
    //   false,
    //   false,
    //   false,
    //   false,
    //   false,
    //   false,
    //   false,
    //   false,
    //   false,
    // ]);
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
        fetchUrl(getTeamByArea, { ...cityInfo, ...authInfo }).then(
          alarmData => {
            alarmList.map(item => {
              map.graphics.remove(item.pointGraphic);
              map.graphics.remove(item.circleGraphic);
              map.graphics.remove(item.lineGraphic);
              map.graphics.remove(item.textPointGraphic);
            });
            if (alarmData.obj) {
              const list = alarmData.obj.map(item => {
                return item.proteamInfos;
              });
              const newList = flatten(list);
              alarmList = newList.map(item => alarmConstruct(item));
              alarmList.map(alarmItem => {
                map.graphics.add(alarmItem.pointGraphic);
                if (showCircle) {
                  map.graphics.add(alarmItem.circleGraphic);
                  map.graphics.add(alarmItem.lineGraphic);
                  map.graphics.add(alarmItem.textPointGraphic);
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
    switchOld();
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
          authInfo={authInfo}
          goPoint={goPoint}
          cityInfo={cityInfo}
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
