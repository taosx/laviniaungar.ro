/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"

import styles from "./layout.module.scss"
import Header from "../header"
import MobileHeader from "../header/mobile-header"

const Layout = ({ children }) => {
    const data = useStaticQuery(graphql`
        query SiteTitleQueryCustom {
            site {
                siteMetadata {
                    title

                    menuLinks {
                        content
                        link
                    }
                }
            }
        }
    `)

    const styleDynamic = {
        wrapper: {},
        main: {},
    }

    if (typeof window !== `undefined`) {
        const href = window.location.href.replace(window.location.origin, "")

        switch (href) {
            case "/portfolio/":
            case "/portfolio":
                styleDynamic.wrapper.height = "100%"
                styleDynamic.wrapper.display = "flex"
                styleDynamic.wrapper.flexFlow = "column nowrap"
                styleDynamic.main.height = "100%"
                break
        }
    }

    const width = useWindowWidth()
    return (
        <div className={styles.wrapper} style={styleDynamic.wrapper}>
            {width > 768 ? (
                <Header
                    siteTitle={data.site.siteMetadata.title}
                    navData={data.site.siteMetadata.menuLinks}
                />
            ) : (
                <MobileHeader
                    siteTitle={data.site.siteMetadata.title}
                    navData={data.site.siteMetadata.menuLinks}
                />
            )}
            <main className={styles.main} style={styleDynamic.main}>
                {children}
            </main>
        </div>
    )
}

function useWindowWidth() {
    const innerWidth = () =>
        typeof window !== `undefined` ? window.innerWidth : 430

    const [width, setWidth] = useState(innerWidth())

    useEffect(() => {
        const handleResize = () => setWidth(innerWidth())
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    })

    return width
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
