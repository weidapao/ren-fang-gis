import React, { useRef, memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, message } from 'antd';
import { columns1, columns2, columns3 } from '../../../../configs';
import { CheckOutlined } from '@ant-design/icons';
import fetchUrl from '../../../utils';
import { getBack } from '../../../services';
import ChartBar from '../../../../components/ChartBar';
// import ChartBar from '../../../../components/ChartBar';
import styles from './index.less';

// TODO: 写在组件里不会改变
let level = '1';

function LeftStatics(props) {
  const [title, setTitle] = useState('江苏省');
  const [initial, setInitial] = useState('江苏省');
  const [isChildren, setIsChildren] = useState(false);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [subData, setSubData] = useState([]);
  const [subCount, setSubCount] = useState(0);
  const [cityCopy, setCityCopy] = useState({
    areaName: '江苏省',
    level: '1',
    longitude: 119.24,
    latitude: 32.94,
  });
  const onClick = e => {
    console.log(e);
    const index = e.dataIndex;
    props.setCityInfo({
      areaName: [...props.searchData.list].reverse()[index].name,
      level: [...props.searchData.list].reverse()[index].level,
      longitude: [...props.searchData.list].reverse()[index].longitude,
      latitude: [...props.searchData.list].reverse()[index].latitude,
    });
  };
  const getColumn = () => {
    const level = props.cityInfo.level;
    const columnList = [columns1, columns2, columns3];
    return columnList[Number(level) - 1];
  };
  const clickRow = (e, record) => {
    switch (level) {
      case '1':
        setIsChildren(true);
        props.setCityInfo({
          areaName: record.areaName,
          level: '2',
          longitude: record.longitude,
          latitude: record.latitude,
        });
        break;
      case '2':
        setIsChildren(true);
        props.setCityInfo({
          areaName: record.areaName,
          level: '3',
          longitude: record.longitude,
          latitude: record.latitude,
        });
        break;
      case '3':
        props.goPoint(record.longitude, record.latitude);
        break;
    }
  };
  const goBack = () => {
    switch (level) {
      case '2':
        if (props.authInfo.domainLevel != '1') {
          message.error('对不起，您无权限访问！');
          console.log('shashashashasha');
          break;
          return;
        }
        props.setCityInfo({
          areaName: '江苏省',
          level: '1',
          longitude: 119.24,
          latitude: 32.94,
        });
        break;
      case '3':
        if (props.authInfo.domainLevel == '3') {
          message.error('对不起，您无权限访问！');
          return;
        }
        fetchUrl(getBack, {
          district: title,
          ...props.authInfo,
        }).then(data => {
          props.setCityInfo({
            areaName: data.obj.cityName,
            level: '2',
            longitude: data.obj.longitude,
            latitude: data.obj.latitude,
          });
        });
        break;
    }
  };

  useEffect(() => {
    setIsChildren(false);
    level = props.cityInfo.level;
    setTitle(props.cityInfo.areaName);
    setTotal(props.cityList[0].num);
    const dataList = props.searchData.map;
    if (dataList) {
      setData(
        dataList.map(item => {
          let newName = item.name;
          if (level != '1') {
            const index = newName.indexOf('市');
            newName = newName.substr(index + 1, newName.length);
          }
          return {
            newName,
            value: item.count,
            ...item,
          };
        }),
      );
    }
  }, [props.cityList, props.cityInfo, props.searchData]);
  return (
    <div className={styles.container}>
      <div style={{ paddingLeft: '12px' }}>
        <div className={styles.headContainer}>
          <p className={styles.title}>{title}</p>
          <div className={styles.goback}>
            {level != '1' && (
              <Button shape="round" onClick={goBack}>
                返回
              </Button>
            )}
          </div>
        </div>
        <p className={styles.subTitle}>警报器总数</p>
        <p className={styles.alarmNum}>{props.searchData.evaBaseCount}</p>
      </div>
      <div style={{ height: '60vh' }}>
        <ChartBar onClick={onClick} data={data} />
      </div>
    </div>
  );
}

export default memo(LeftStatics);
