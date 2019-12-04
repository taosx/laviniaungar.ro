import React, { useState } from "react"

import style from "./header.module.scss"

import { Link, useStaticQuery, graphql } from "gatsby"

import PropTypes from "prop-types"
import Img from "gatsby-image"

import Icon from "@mdi/react"
import { mdiMenu, mdiClose, mdiMagnify } from "@mdi/js"

const Header = ({ siteTitle, navData }) => {
    const data = useStaticQuery(graphql`
        query {
            placeholderImage: file(relativePath: { eq: "logo-def.png" }) {
                childImageSharp {
                    fixed(width: 200) {
                        ...GatsbyImageSharpFixed_withWebp_noBase64
                    }
                }
            }
        }
    `)

    // Navigation List
    navData = navData || [{ link: "/", content: "Home" }]
    const navLinks = navData.slice(1).map(({ link, content }, inx) => (
        <li key={`list-link-${inx}`}>
            <Link to={link}>{content}</Link>
        </li>
    ))

    const navLinksGroup1 = navLinks.slice(0, navLinks.length / 2)
    const navLinksGroup2 = navLinks.slice(navLinks.length / 2)

    return (
        <header>
            <div className={style.header_wrapper}>
                <div className={style.header} style={{ maxWidth: 960 }}>
                    <ul>{navLinksGroup1}</ul>

                    <div className={style.header_logo}>
                        <Link
                            to={"/"}
                            title={siteTitle}
                            style={{ maxWidth: "200px" }}
                        >
                            <Img
                                loading="eager"
                                fadeIn={false}
                                fixed={
                                    data.placeholderImage.childImageSharp.fixed
                                }
                            />
                        </Link>
                    </div>
                    <ul>{navLinksGroup2}</ul>
                </div>
            </div>
        </header>
    )
}

Header.propTypes = {
    siteTitle: PropTypes.string,
    logoImg: PropTypes.string,
    navData: PropTypes.arrayOf(
        PropTypes.shape({
            link: PropTypes.string,
            content: PropTypes.string,
        })
    ),
}

export default Header
