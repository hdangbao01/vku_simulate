/* eslint-disable jsx-a11y/alt-text */
import { Link, useLocation } from 'react-router-dom'
import NavItem from '~/components/NavItem'

const items = [
    { label: 'Trang chủ', link: '/' },
    {
        label: 'Khám phá',
        drops: [
            {
                name: "VKU",
                link: './campus'
            },
            {
                name: "Phòng học",
                link: './room'
            },
            {
                name: "Phòng Cinema",
                link: './round'
            },
            {
                name: "Trung tâm sinh viên",
                link: './center'
            }
        ]
    },
    { label: 'Thiết kế', link: '/design' },
    { label: 'Phòng học', link: '/meeting' }
]

const NavItemContainer = ({ location }) => {
    return <>
        {items.map((item, i) => <NavItem item={item} key={item.label} location={location} />)}
    </>
}

const Header = () => {
    const location = useLocation()

    return (
        <div className='w-header z-10 shadow-bx fixed top-6 left-2/4 -translate-x-2/4 flex h-16 bg-white rounded-full py-3 px-8 items-center text-lg font-semibold'>
            <div className='h-full'>
                <Link to="/">
                    <img className='h-full' src={require('~/assets/images/logo.png')} alt='Logo-VKU' />
                </Link>
            </div>
            <ul className='list-none flex'>
                <NavItemContainer location={location} />
            </ul>
        </div>
    )
}

export default Header