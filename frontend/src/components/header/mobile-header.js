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
                    fluid(maxHeight: 60) {
                        ...GatsbyImageSharpFluid_withWebp_noBase64
                    }
                }
            }
        }
    `)

    const [menuOpen, setMenuOpen] = useState(false)

    // Burger Menu
    const BurgerMenu = (
        <label
            className={style.header_hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            htmlFor={style.menu_trigger}
        >
            <Icon
                className={style.menuopen_btn}
                path={mdiMenu}
                title="Open Menu"
                size={1}
                horizontal
                vertical
            />

            <Icon
                className={style.menuclose_btn}
                path={mdiClose}
                title="Close Menu"
                size={1}
                horizontal
                vertical
            />
        </label>
    )

    // Navigation List
    navData = navData || [{ link: "/", content: "Home" }]
    const navLinks = navData.map(({ link, content }, inx) => (
        <li onClick={() => setMenuOpen(false)} key={`list-link-${inx}`}>
            <Link to={link}>{content}</Link>
        </li>
    ))

    return (
        <header>
            <input
                className={style.trigger_input}
                id={style.menu_trigger}
                type="checkbox"
            />

            <label
                className={style.spacer}
                htmlFor={style.menu_trigger}
                onClick={() => setMenuOpen(!menuOpen)}
            />

            <div className={style.header_wrapper}>
                <div className={style.header} style={{ maxWidth: 960 }}>
                    {BurgerMenu}

                    <div className={style.header_logo}>
                        <Link to={"/"} title={siteTitle}>
                            <Img
                                loading="eager"
                                fadeIn={false}
                                fluid={
                                    data.placeholderImage.childImageSharp.fluid
                                }
                            />
                        </Link>
                    </div>

                    <div className={style.header_search}>
                        <Icon
                            className={style.search_btn}
                            path={mdiMagnify}
                            title="Close Menu"
                            size={1}
                        />
                    </div>
                </div>

                {/* Menu ================== */}
                <nav className={style.menu}>
                    <ul>{navLinks}</ul>
                </nav>
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
