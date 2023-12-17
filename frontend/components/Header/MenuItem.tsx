import { Link } from "../Link";



export const MenuItem = (props: any) => {
    return (
        <li className="py-2 lg:py-1 py-2 lg:py-2">
            <Link
                href={props.href}
                target="_self"

                onClick={props.handleClick}
                className={`font-medium text-center block px-5 lg:flex items-center transition duration-150 ease-in-out ${props.active ? 'text-black' : 'text-gray-400'}`}
            >
                {props.children}
            </Link>
        </li>
    );
}