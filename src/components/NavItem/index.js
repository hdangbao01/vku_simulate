import { Link } from "react-router-dom";

function NavItem({ item }) {
    const { label, active, link } = item

    return <li
    //  className={`cursor-pointer hover:text-sky-600 ml-8${active ? ' text-sky-600' : ''}`}
    >
        <Link to={`${link}`}>
            <p className={`text-black cursor-pointer hover:text-sky-500 ml-8${active ? ' text-sky-500' : ''}`}>{label}</p>
        </Link>
    </li>
}

export default NavItem;