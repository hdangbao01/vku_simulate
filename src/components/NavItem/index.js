import { Link } from "react-router-dom";

function NavItem({ item }) {
    const { label, active, link, drops } = item

    return <li className={'group relative'}
    //  className={`cursor-pointer hover:text-sky-600 ml-8${active ? ' text-sky-600' : ''}`}
    >
        <Link to={`${link}`}>
            <p className={`text-black cursor-pointer hover:text-blue-600 ml-8${active ? ' text-blue-600' : ''}`}>{label}</p>
        </Link>
        {drops &&
            <ul className={'top-7 absolute bg-white shadow-bx rounded-sm py-3 px-6 w-48 invisible group-hover:visible'}>
                {drops.map(drop => (<li key={drop.name} className={'text-center cursor-pointer hover:text-blue-600'}>{drop.name}</li>))}
            </ul>
        }
    </li>
}

export default NavItem;