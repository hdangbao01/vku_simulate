function NavItem({ item }) {
    const { label, active } = item

    return <li className={`cursor-pointer hover:text-sky-600 ml-8${active ? ' text-sky-600' : ''}`}>{label}</li>
}

export default NavItem;