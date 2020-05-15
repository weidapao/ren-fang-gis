import React, { useRef, useEffect, useState } from 'react';
import RadarChart from '../EvaRadar';
import Piechart from '../Piechart';
import styles from './index.less';

function RightStatics(props) {
  const [radarData, setRadarData] = useState([{ percent: 0, num: 0 }]);
  const [pieData, setPieData] = useState([]);
  useEffect(() => {
    if (props.searchData.proteamCapacity) {
      const radar = [
        {
          percent: props.searchData.proteamCapacity.proteamConfig,
        },
        {
          percent: props.searchData.proteamCapacity.proteamBoneTrain,
        },
        {
          percent: props.searchData.proteamCapacity.proteamParticipate,
        },
        {
          percent: props.searchData.proteamCapacity.proteamTrain,
        },
        {
          percent: props.searchData.proteamCapacity.proteamJobTrain,
        },
      ];
      setRadarData(radar);
    }
    if (props.searchData.proteamAnalyses) {
      const data = props.searchData.proteamAnalyses;
      setPieData(
        data.map(item => ({
          name: item.tpyeName,
          value: item.nums,
        })),
      );
    }
  }, [props.searchData]);
  return (
    <div className={styles.container}>
      <div style={{ height: '320px' }}>
        <RadarChart data={radarData} />
      </div>
      <div style={{ height: '200px' }}>
        <Piechart data={pieData} />
      </div>
    </div>
  );
}

export default RightStatics;
