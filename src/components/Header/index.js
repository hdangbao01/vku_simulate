/* eslint-disable jsx-a11y/alt-text */
import { Link } from 'react-router-dom'
import NavItem from '~/components/NavItem'

const items = [
    { label: 'Trang chủ', link: '/', active: true },
    { label: 'Khám phá', link: '/campus' },
    {
        label: 'Tất cả phòng', link: '/room',
        drops: [
            {
                name: "Phòng học",
                link: './classroom'
            },
            {
                name: "Phòng Cinema",
                link: './cinema'
            }
        ]
    },
    { label: 'Phòng học', link: '/meeting' },
    { label: 'Login', link: '/login' }
]

const NavItemContainer = () => (
    <>
        {items.map((item, i) => <NavItem item={item} key={i} />)}
    </>
)

const Header = () => {
    return (
        <div className='w-header z-10 shadow-bx fixed top-6 left-2/4 -translate-x-2/4 flex h-16 bg-white rounded-full py-3 px-8 items-center text-lg font-normal'>
            <div className='h-full'>
                <Link to="/">
                    <img className='h-full' src={require('~/assets/images/logo.png')} alt='Logo-VKU' />
                </Link>
            </div>
            <ul className='list-none flex'>
                <NavItemContainer />
            </ul>
        </div>
    )
}

export default Header