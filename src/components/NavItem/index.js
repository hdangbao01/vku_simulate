import { Link } from "react-router-dom";

function NavItem({ item }) {
    const { label, active, link, drops } = item

    return <li key={label} className={'group relative'}
    //  className={`cursor-pointer hover:text-sky-600 ml-8${active ? ' text-sky-600' : ''}`}
    >
        {drops ? <>
            <p key={label} className={`text-black cursor-pointer hover:text-blue-600 ml-8${active ? ' text-blue-600' : ''}`}>{label}</p>
            <ul className={'top-7 absolute bg-white shadow-bx rounded-sm py-3 px-6 w-48 invisible group-hover:visible'}>
                {drops.map(drop => (<Link to={drop.link} key={drop.name}><li className={'text-center cursor-pointer hover:text-blue-600'}>
                    {drop.name}
                </li></Link>))}
            </ul>
        </>
            :
            <Link to={link}>
                <p className={`text-black cursor-pointer hover:text-blue-600 ml-8${active ? ' text-blue-600' : ''}`}>{label}</p>
            </Link>
        }
    </li>
}

export default NavItem;