import React, { useRef, useEffect, useState } from 'react';
import ChartBar from '../../../../components/ChartBar';
import styles from './index.less';

function LeftStatics(props) {
  const [title, setTitle] = useState('江苏省');
  const [initial, setInitial] = useState('江苏省');
  const [isChildren, setIsChildren] = useState(false);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [subData, setSubData] = useState([]);
  const [subCount, setSubCount] = useState(0);
  const onClick = e => {
    if (props.cityInfo.level == 1) {
      setTitle(e.name + '×');
      setIsChildren(true);
      props.getDetail({ areaName: e.name, level: 2 }).then(data => {
        const dataMap = data.obj.map;
        setSubCount(dataMap.alarmCount)
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
  const goBack = () => {
    if (isChildren) {
      setTitle(initial);
      setIsChildren(false);
    }
  };
  useEffect(()=>{
    setIsChildren(false)
    setTitle(props.cityInfo.areaName)
    console.log(props.cityList)
    setTotal(props.cityList[0].num)
    const dataMap = props.searchData.map
    let dataArray = []
    if(dataMap){
      for(let i in dataMap){
        dataArray.push({name:i,value:dataMap[i]})
      }
      setData(dataArray);
    }
  },[props.cityList,props.cityInfo,props.searchData])
  return (
    <div className={styles.container}>
      <p className={styles.title} onClick={goBack}>
        {title}
      </p>
      <p className={styles.subTitle}>警报器总数</p>
      <p className={styles.alarmNum}>{isChildren ?subCount:props.searchData.alarmCount}</p>
      <div style={{ height: '68vh' }}>
        <ChartBar onClick={onClick} data={isChildren ? subData : data} />
      </div>
    </div>
  );
}

export default LeftStatics;
