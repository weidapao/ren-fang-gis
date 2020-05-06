import React from 'react';
import styles from './index.less';

function Lonlatutide(props) {
  return (
    <div className={styles.container}>
      <span>经度:{props.longitude.toFixed(4)},纬度:{props.latitude.toFixed(4)}</span>
    </div>
  );
}

export default Lonlatutide;
