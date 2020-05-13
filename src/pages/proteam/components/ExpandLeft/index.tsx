import React, { useRef, useEffect, useState } from 'react';
import { Input, message, Select, Switch, Cascader, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Option } = Select;
function ExpandLeft(props) {
  const [alarmText, setAlarmText] = useState('');
  return (
    <div
      className={styles.container}
      style={{
        borderRadius: '0 4px 4px 0',
      }}
    >
      {props.show ? (
        <LeftOutlined onClick={props.hideSide} style={{ color: 'white' }} />
      ) : (
        <RightOutlined onClick={props.hideSide} style={{ color: 'white' }} />
      )}
    </div>
  );
}

export default ExpandLeft;
