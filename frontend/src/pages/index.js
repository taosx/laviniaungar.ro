import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import styles from "../styles/home.module.scss"

import Icon from "@mdi/react"
import { mdiForumOutline } from "@mdi/js"

import SEO from "../components/seo"
import ActionBtn from "../components/actionBtn"

import BackgroundSlider from "../components/backgroundSlider"

const IndexPage = () => {
    const data = useStaticQuery(graphql`
        query HomePageQuery {
            allFile(
                filter: {
                    extension: { regex: "/(jpeg|jpg|gif|png)/" }
                    sourceInstanceName: { eq: "slides" }
                }
            ) {
                edges {
                    node {
                        relativePath

                        colors {
                            ...GatsbyImageColors
                        }

                        childImageSharp {
                            fluid(maxWidth: 4000) {
                                ...GatsbyImageSharpFluid_withWebp_tracedSVG
                            }
                        }
                    }
                }
            }
        }
    `)

    return (
        <div>
            <SEO title="Home" />

            <BackgroundSlider data={data} />
            <div className={styles.hero_text}>
                <div>
                    <h1>INTERIOR ARCHITECTURE &amp; DESIGN</h1>
                    <p>
                        consulting, style definition, commercial &amp; technical
                        concept
                    </p>
                </div>
            </div>

            <Link to={"/contact/"}>
                <ActionBtn>
                    Contact
                    <Icon
                        path={mdiForumOutline}
                        title="Chat with us"
                        size={0.6}
                        style={{ marginLeft: "5px" }}
                    />
                </ActionBtn>
            </Link>
        </div>
    )
}

export default IndexPage
