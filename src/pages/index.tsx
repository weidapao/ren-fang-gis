import React, { useState, useEffect, useRef } from 'react';
import { Map, Marker, APILoader, Label, Circle } from '@uiw/react-baidu-map';
import { Input } from 'antd';
import styles from './index.less';
const jiangSuList = [
  { name: '南京', lng: 118.78, lat: 32.04 },
  { name: '徐州', lng: 117.2, lat: 34.26 },
  { name: '连云港', lng: 119.16, lat: 34.59 },
  { name: '南通', lng: 120.86, lat: 32.01 },
  { name: '苏州', lng: 120.62, lat: 31.32 },
  { name: '无锡', lng: 120.29, lat: 31.59 },
  { name: '常州', lng: 119.95, lat: 31.79 },
  { name: '淮安', lng: 119.15, lat: 33.5 },
  { name: '盐城', lng: 120.13, lat: 33.38 },
  { name: '扬州', lng: 119.42, lat: 32.39 },
  { name: '泰州', lng: 119.9, lat: 32.49 },
  { name: '镇江', lng: 119.44, lat: 32.2 },
  { name: '宿迁', lng: 118.3, lat: 33.96 },
];

const CustomIcon = () => {
  let mapInstance = null;
  const [center, setCenter] = useState('江苏');
  const [enableDragging, setEnableDragging] = useState(true);
  const [postion, setPostion] = useState();
  const [isAddEvent, setIsAddEvent] = useState(false);
  function circleRef(props) {
    if (props && props.circle) {
      props.circle.setStrokeStyle('dashed');
      console.log('circle:', props.circle, props.map, props.BMap);
    }
  }
  const iconfox = new BMap.Icon(
    'http://developer.baidu.com/map/jsdemo/img/fox.gif',
    new BMap.Size(300, 157),
  );
  const [icon, setIcon] = useState(iconfox);
  const [zoom, setZoom] = useState(9);
  const [enableScrollWheelZoom, setEnableScrollWheelZoom] = useState(true);
  const [markList, setMarkList] = useState([
    {
      lng: 119.42,
      lat: 32.39,
      code: 9527,
    },
  ]);

  const onSearch = value => {
    mapInstance.setZoom(15);
    mapInstance.setCenter({
      lng: 120.62, lat: 31.32
    });
    // setCenter({
    //   lng: 120.62, lat: 31.32
    // })
  };

  useEffect(() => {
    fetch(
      '/baidu/geocoding/v3/?address=北京市海淀区上地十街10号&output=json&ak=GTrnXa5hwXGwgQnTBG28SHBubErMKm3f&callback=showLocation',
    ).then(data => {
      console.log(data);
    });
  }, []);
  return (
    <>
      <Map
        zoom={9}
        minZoom={9}
        center={center}
        onZoomEnd={data => setZoom(mapInstance.getZoom())}
        ref={props => {
          if (props && props.map) {
            // 启用滚轮放大缩小，默认禁用
            mapInstance = props.map;
            props.map.enableScrollWheelZoom();
          }
        }}
      >
        {jiangSuList.map(item => (
          <Label
            content={item.name + '警报器个数'}
            position={{ lng: item.lng, lat: item.lat }}
          />
        ))}
        {markList.map(item => (
          <Marker
            title="xxxx"
            position={{ lng: item.lng, lat: item.lat }}
            type="loc_red"
          />
        ))}
        {markList.map(item => (
          <Marker
            title={`lng:${item.lng},lat:${item.lat},编号:${item.code}`}
            position={{ lng: item.lng, lat: item.lat }}
            icon={iconfox}
          />
        ))}
        {markList.map(item => (
          <Circle
            strokeOpacity={0.9}
            strokeWeight={1}
            center={{ lng: item.lng, lat: item.lat }}
            radius={800}
            strokeStyle="dashed"
          />
        ))}
      </Map>
      <div id="left-panel" className={styles.leftPanel}>
        <Input.Search
          style={{ width: '425px' }}
          placeholder="请输入地址或设备编号"
          onSearch={onSearch}
          enterButton
        />
      </div>
    </>
  );
};

const Demo = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <APILoader akay="GTrnXa5hwXGwgQnTBG28SHBubErMKm3f">
      <CustomIcon />
    </APILoader>
  </div>
);

export default Demo;
