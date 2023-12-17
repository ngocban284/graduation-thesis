import XLink, { LinkProps as XLinkProps } from "next/link"
import React, { HTMLAttributes, PropsWithChildren } from "react"
import { FC } from "react"
import { Comming } from "./Comming";

export type LinkProps = { href: string } | PropsWithChildren<| HTMLAttributes<HTMLAnchorElement>>;

export const Link: FC<any> = (props: any) => {
    if (props.href == "") {
        return <Comming>
            <span {...props} />
        </Comming>
    }

    return <XLink href={(props as any).href} target="_blank" {...props} />

}