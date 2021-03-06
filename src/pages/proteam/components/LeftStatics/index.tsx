import React, { useRef, memo, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, Table, message } from 'antd';
import uniq from 'lodash/uniq';
import { columnsTeam, columnsTeam2 } from '../../../../configs';
import { CheckOutlined } from '@ant-design/icons';
import fetchUrl from '../../../utils';
import { getBack } from '../../../services';
// import ChartBar from '../../../../components/ChartBar';
import styles from './index.less';

// TODO: 写在组件里不会改变
let level = '1';

// 专业队配置
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
    if (props.cityInfo.level == 1 && !isChildren) {
      setTitle(e.name);
      setIsChildren(true);
      props.getDetail({ areaName: e.name, level: 2 }).then(data => {
        const dataMap = data.obj.map;
        setSubCount(data.obj.alarmCount);
        let dataArray = [];
        if (dataMap) {
          for (let i in dataMap) {
            dataArray.push({ name: i, value: dataMap[i] });
          }
          setSubData(dataArray);
        }
      });
    }
  };
  const getColumn = () => {
    const level = props.cityInfo.level;
    const columnList = [columnsTeam, columnsTeam, columnsTeam2];
    return columnList[Number(level) - 1];
  };
  const clickRow = (e, record) => {
    switch (level) {
      case '1':
        props.setCityInfo({
          areaName: record.areaName,
          level: '2',
          longitude: record.longitude,
          latitude: record.latitude,
        });
        break;
      case '2':
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
    console.log(props.authInfo);
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

  const changeOld = (index, showIndex) => {
    const newOld = [...props.oldShow];
    newOld[index] = !newOld[index];
    props.setOldShow(newOld);
  };

  const getTableData = () => {
    const level = props.cityInfo.level;
    if (level == '3') {
      const newShow = uniq(props.oldShow);
      if (newShow.length === 1) {
        return props.searchData.proteamLeftDatas;
      } else {
        return props.searchData.proteamLeftDatas.filter(item => {
          const typeIndex = proTeamList.findIndex(
            tItem => tItem.name === item.professionalType,
          );
          return props.oldShow[typeIndex];
        });
      }
    }
    return props.searchData.proteamLeftDatas;
  };

  useEffect(() => {
    setIsChildren(false);
    level = props.cityInfo.level;
    setTitle(props.cityInfo.areaName);
    setTotal(props.cityList[0].num);
    const dataMap = props.searchData.map;
    let dataArray = [];
    if (dataMap) {
      for (let i in dataMap) {
        dataArray.push({ name: i, value: dataMap[i] });
      }
      setData(dataArray);
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
        <div style={{ display: 'flex' }}>
          <div>
            <p className={styles.subTitle}>专业队总数</p>
            <p className={styles.alarmNum}>{props.searchData.teamCount}</p>
          </div>
          <div style={{ marginLeft: '30px' }}>
            <p className={styles.subTitle}>专业队人数</p>
            <p className={styles.alarmNum}>{props.searchData.memberCounts}</p>
          </div>
        </div>
      </div>
      <div className={styles.tagList}>
        <div onClick={() => changeOld(0, true)} className={styles.tagItem4}>
          <span>{props.oldShow[0] && <CheckOutlined />}交通运输</span>
          <span>
            {props.searchData.proteamInfoCollects &&
              `${props.searchData.proteamInfoCollects[0].nums}(${(
                props.searchData.proteamInfoCollects[0].percent * 100
              ).toFixed(1)}%)`}
          </span>
        </div>
        <div onClick={() => changeOld(1, true)} className={styles.tagItem4}>
          <span>{props.oldShow[1] && <CheckOutlined />}伪装设障</span>
          <span>
            {props.searchData.proteamInfoCollects &&
              `${props.searchData.proteamInfoCollects[1].nums}(${(
                props.searchData.proteamInfoCollects[1].percent * 100
              ).toFixed(1)}%)`}
          </span>
        </div>
        <div onClick={() => changeOld(2, true)} className={styles.tagItem4}>
          <span>{props.oldShow[2] && <CheckOutlined />}信息防护</span>
          <span>
            {props.searchData.proteamInfoCollects &&
              `${props.searchData.proteamInfoCollects[2].nums}(${(
                props.searchData.proteamInfoCollects[2].percent * 100
              ).toFixed(1)}%)`}
          </span>
        </div>
        <div onClick={() => changeOld(3, true)} className={styles.tagItem4}>
          <span>{props.oldShow[3] && <CheckOutlined />}心理防护</span>
          <span>
            {props.searchData.proteamInfoCollects &&
              `${props.searchData.proteamInfoCollects[3].nums}(${(
                props.searchData.proteamInfoCollects[3].percent * 100
              ).toFixed(1)}%)`}
          </span>
        </div>
      </div>
      <div className={styles.tagList}>
        <div onClick={() => changeOld(4, true)} className={styles.tagItem4}>
          <span>{props.oldShow[4] && <CheckOutlined />}抢险抢修</span>
          <span>
            {props.searchData.proteamInfoCollects &&
              `${props.searchData.proteamInfoCollects[4].nums}(${(
                props.searchData.proteamInfoCollects[4].percent * 100
              ).toFixed(1)}%)`}
          </span>
        </div>
        <div onClick={() => changeOld(5, true)} className={styles.tagItem4}>
          <span>{props.oldShow[5] && <CheckOutlined />}医疗救护</span>
          <span>
            {props.searchData.proteamInfoCollects &&
              `${props.searchData.proteamInfoCollects[5].nums}(${(
                props.searchData.proteamInfoCollects[5].percent * 100
              ).toFixed(1)}%)`}
          </span>
        </div>
        <div onClick={() => changeOld(6, true)} className={styles.tagItem4}>
          <span>{props.oldShow[6] && <CheckOutlined />}消防</span>
          <span>
            {props.searchData.proteamInfoCollects &&
              `${props.searchData.proteamInfoCollects[6].nums}(${(
                props.searchData.proteamInfoCollects[6].percent * 100
              ).toFixed(1)}%)`}
          </span>
        </div>
        <div onClick={() => changeOld(7, true)} className={styles.tagItem4}>
          <span>{props.oldShow[7] && <CheckOutlined />}治安</span>
          <span>
            {props.searchData.proteamInfoCollects &&
              `${props.searchData.proteamInfoCollects[7].nums}(${(
                props.searchData.proteamInfoCollects[7].percent * 100
              ).toFixed(1)}%)`}
          </span>
        </div>
      </div>
      <div className={styles.tagList}>
        <div onClick={() => changeOld(8, true)} className={styles.tagItem4}>
          <span>{props.oldShow[8] && <CheckOutlined />}防化防疫</span>
          <span>
            {props.searchData.proteamInfoCollects &&
              `${props.searchData.proteamInfoCollects[8].nums}(${(
                props.searchData.proteamInfoCollects[8].percent * 100
              ).toFixed(1)}%)`}
          </span>
        </div>
        <div onClick={() => changeOld(9, true)} className={styles.tagItem4}>
          <span>{props.oldShow[9] && <CheckOutlined />}通信专业</span>
          <span>
            {props.searchData.proteamInfoCollects &&
              `${props.searchData.proteamInfoCollects[9].nums}(${(
                props.searchData.proteamInfoCollects[9].percent * 100
              ).toFixed(1)}%)`}
          </span>
        </div>
        <div onClick={() => changeOld(10, true)} className={styles.tagItem4}>
          <span>{props.oldShow[10] && <CheckOutlined />}合成专业</span>
          <span>
            {props.searchData.proteamInfoCollects &&
              `${props.searchData.proteamInfoCollects[10].nums}(${(
                props.searchData.proteamInfoCollects[10].percent * 100
              ).toFixed(1)}%)`}
          </span>
        </div>
        <div onClick={() => changeOld(11, true)} className={styles.tagItem4}>
          <span>{props.oldShow[11] && <CheckOutlined />}其他专业</span>
          <span>
            {props.searchData.proteamInfoCollects &&
              `${props.searchData.proteamInfoCollects[11].nums}(${(
                props.searchData.proteamInfoCollects[11].percent * 100
              ).toFixed(1)}%)`}
          </span>
        </div>
      </div>
      <div className={styles.newScroll}>
        <Scrollbars
          style={{ width: '100%', height: '100%' }}
          renderThumbVertical={(...props) => (
            <div
              {...props}
              style={{ background: 'rgb(15, 83, 190)', borderRadius: '2px' }}
            />
          )}
          renderThumbHorizontal={(...props) => (
            <div
              {...props}
              style={{
                height: '6px',
                background: 'rgb(15, 83, 190)',
                borderRadius: '2px',
              }}
            />
          )}
        >
          <div
            style={{
              width: level == '3' ? '100%' : '800px',
              paddingRight: '2px',
              paddingBottom: '6px',
            }}
          >
            <Table
              size="small"
              style={{ paddingRight: '8px' }}
              onRow={record => {
                return {
                  onClick: e => clickRow(e, record), // 点击行
                };
              }}
              rowClassName={(record, index) => {
                let className = styles.lightRow;
                if (index % 2 === 1) className = styles.darkRow;
                return className;
              }}
              // scroll={{ y: '50vh' }}
              pagination={false}
              dataSource={getTableData()} //proteamInfoCollects
              columns={getColumn()}
            />
          </div>
        </Scrollbars>
      </div>
    </div>
  );
}

export default memo(LeftStatics);
