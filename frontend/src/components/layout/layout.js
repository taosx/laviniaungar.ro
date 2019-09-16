/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"

import styles from "./layout.module.scss"
import Header from "../header"

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

    return (
        <div className={styles.wrapper}>
            <Header
                siteTitle={data.site.siteMetadata.title}
                navData={data.site.siteMetadata.menuLinks}
            />
            <main className={styles.main}>{children}</main>
        </div>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
