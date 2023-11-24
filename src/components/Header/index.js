import classNames from 'classnames/bind';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

const Header = () => {
    return (
        <div className={cx('logo')}>
            <p>VKU</p>
        </div>
    )
}

export default Header