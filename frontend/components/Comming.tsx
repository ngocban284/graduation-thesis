import { FC, PropsWithChildren } from "react";



export const Comming: FC<PropsWithChildren> = (props) => {

    return (
        <>
            <div className="relative has-tooltip">
                {props.children}

                <div className="top-100 rounded-full mt-3 font-normal absolute whitespace-nowrap tooltip px-4 py-2 bg-black text-white">
                    Coming Soon
                </div>
            </div>

        </>
    );
}