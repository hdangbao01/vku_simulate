import React from 'react';
import classNames from 'classnames/bind'
import styles from './Load.module.scss'
import { Html, useProgress } from '@react-three/drei';

const cx = classNames.bind(styles)

const Load = () => {
    const { active, progress, errors, item, loaded, total } = useProgress();

    return (
        <Html center>
            <div className={cx('mainer')}>
                <div className={cx('loader')}>
                    <div className={cx('progress')}>{`${progress}% loaded`}</div>
                </div>
            </div>
        </Html>
    );
};

export default Load;