import React, { useRef, useEffect, useState } from 'react';
import RadarChart from '../EvaRadar';
import styles from './index.less';

function RightStatics(props) {
  const [radarData, setRadarData] = useState([{ percent: 0, num: 0 }]);
  useEffect(() => {
    if (props.searchData) {
      const radar = [
        {
          percent: props.searchData.supportCapability,
          num: props.searchData.supportCapability,
        },
        {
          percent: props.searchData.resettleAreaCapacity,
          num: props.searchData.resettleAreaCapacity,
        },
        {
          percent: props.searchData.evaLifeSupportCapacity,
          num: props.searchData.evaLifeSupportCapacity,
        },
        {
          percent: props.searchData.necessaryFacilities,
          num: props.searchData.necessaryFacilities,
        },
        {
          percent: props.searchData.wartimeAssistanceCapability,
          num: props.searchData.wartimeAssistanceCapability,
        },
        {
          percent: props.searchData.eduAbility,
          num: props.searchData.eduAbility,
        },
      ];
      setRadarData(radar);
    }
  }, [props.searchData]);
  return (
    <div className={styles.container}>
      <div style={{ height: '400px' }}>
        <RadarChart data={radarData} />
      </div>
    </div>
  );
}

export default RightStatics;
