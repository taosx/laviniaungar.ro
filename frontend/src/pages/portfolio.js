import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

import styles from "../styles/portfolio.module.scss"
import SEO from "../components/seo"
import BackgroundImage from "gatsby-background-image"

// import clamp from "lodash/fp/clamp"

import Icon from "@mdi/react"
import { mdiViewArray, mdiViewModule } from "@mdi/js"

const PortfolioPage = () => {
    const data = useStaticQuery(graphql`
        query PortofolioPageQuery {
            allFile(
                filter: {
                    extension: { regex: "/(jpeg|jpg|gif|png)/" }
                    sourceInstanceName: { eq: "slides" }
                }
            ) {
                edges {
                    node {
                        name
                        relativePath

                        colors {
                            ...GatsbyImageColors
                        }

                        childImageSharp {
                            fluid(maxWidth: 800) {
                                ...GatsbyImageSharpFluid_withWebp_tracedSVG
                            }
                        }
                    }
                }
            }
        }
    `)

    const [current, setCurrent] = useState(2)

    const maxLen = data.allFile.edges.length - 1
    const panels = [
        current - 1 < 0 ? maxLen : current - 1,
        current,
        current + 1 > maxLen ? 0 : current + 1,
    ]

    // useEffect(() => {
    //     setInterval(() => {
    //         setCurrent(current + 1)
    //     }, 1000)
    // })

    return (
        <>
            <BackgroundImage
                fluid={data.allFile.edges[7].node.childImageSharp.fluid}
                className={styles.background}
            ></BackgroundImage>

            <SEO title="Portfolio" />
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div className={styles.panels}>
                        {/* <div className={styles.viewBar}>
                            <Icon
                                path={mdiViewModule}
                                title="Chat with us"
                                size={1.3}
                                style={{}}
                                color={"#303030c0"}
                            />

                            <Icon
                                path={mdiViewArray}
                                title="Chat with us"
                                size={1.3}
                                style={{}}
                                color={"#303030c0"}
                            />
                        </div> */}
                        {panels.map(inx => {
                            return (
                                <Panel
                                    key={`panel-${inx}`}
                                    fluid={
                                        data.allFile.edges[inx].node
                                            .childImageSharp.fluid
                                    }
                                    title={data.allFile.edges[inx].node.name}
                                    description={
                                        data.allFile.edges[inx].node
                                            .relativePath
                                    }
                                    colors={data.allFile.edges[inx].node.colors}
                                ></Panel>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

const Panel = props => {
    const [hovered, setHovered] = useState(false)

    const colorSecondary = `${props.colors.muted}${hovered ? "60" : "50"}`
    const colorMain = `${props.colors.lightVibrant}${hovered ? "60" : "50"}`

    return (
        <figure
            className={styles.panel}
            onMouseEnter={() => {
                setHovered(true)
            }}
            onMouseLeave={() => setHovered(false)}
        >
            <Img
                fluid={props.fluid}
                objectPosition="50% 50%"
                className={styles.image}
            />
            <figcaption>
                <h3>{props.title}</h3>
                <p>{props.description}</p>
            </figcaption>
            <div
                className={styles.tint}
                style={{
                    background: `linear-gradient(to bottom, ${colorMain}, ${colorSecondary})`,
                }}
            ></div>
        </figure>
    )
}

export default PortfolioPage
