/* eslint-disable jsx-a11y/alt-text */
import NavItem from '~/components/NavItem'

const items = [
    { label: 'Trang chủ', active: true },
    { label: 'Khuân viên' },
    { label: 'Phòng học' },
    { label: 'Thiết kế' },
    { label: 'Khám phá' }
]

const NavItemContainer = () => (
    <>
        {items.map((item, i) => <NavItem item={item} key={i} />)}
    </>
)

const Header = () => {
    return (
        <div className='w-715 z-10 fixed top-6 left-2/4 -translate-x-2/4 flex h-16 bg-white rounded-full py-3 px-8 items-center text-lg font-normal'>
            <div className='h-full'>
                <img className='h-full' src={require('~/assets/images/logo.png')} />
            </div>
            <ul className='list-none flex'>
                <NavItemContainer />
            </ul>
        </div>
    )
}

export default Header