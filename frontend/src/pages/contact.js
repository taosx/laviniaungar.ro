import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import BackgroundImage from "gatsby-background-image"
import TextareaAutosize from "react-autosize-textarea"

import styles from "./contact.module.scss"

import SEO from "../components/seo"
// import Map from "../components/map"

const ContactPage = () => {
    const data = useStaticQuery(graphql`
        query ContactPageQuery {
            allFile(
                filter: {
                    extension: { regex: "/(jpeg|jpg|gif|png)/" }
                    name: { eq: "slide_26" }
                }
            ) {
                edges {
                    node {
                        relativePath
                        name
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
        <>
            <BackgroundImage
                fluid={data.allFile.edges[0].node.childImageSharp.fluid}
            >
                <SEO title="Contact" />

                <div className={styles.main_wrapper}>
                    <form
                        className={styles.contact_form}
                        method="POST"
                        action="https://formspree.io/laviniaungardesign@yahoo.com"
                    >
                        <h1>
                            LET’S START THE CONVERSATION ON YOUR NEXT INTERIOR
                            DESIGN PROJECT
                        </h1>
                        <p>Please use the form below to send us a message.</p>
                        <label>
                            Name*
                            <input
                                name="name"
                                type="text"
                                minLength="4"
                                required
                            ></input>
                        </label>
                        <label>
                            Email*
                            <input type="email" name="email" required></input>
                        </label>
                        <label>
                            email Message*
                            <TextareaAutosize
                                placeholder="Enter your message here"
                                rows={3}
                                type="text"
                                name="message"
                            ></TextareaAutosize>
                        </label>
                        <label>
                            Phone
                            <input type="tel" name="tel" id="tel"></input>
                        </label>
                        <button>Send Email</button>
                    </form>

                    {/* <div className={styles.location_map}>
                    <Map id="hello" />
                </div> */}
                </div>

                <footer className={styles.location_data}>
                    <div className={styles.wrapper}>
                        <h1>Head Office</h1>
                        <p>27 Retezat Street, Resita</p>
                        <p>Caras Severin, 320087</p>
                        <p>Romania</p>

                        <p>0040 724 676123</p>
                    </div>
                    <div className={styles.footer_end}>
                        © 2019 LAVINIA UNGAR DESIGN SRL, All Rights Reserved
                    </div>
                </footer>
            </BackgroundImage>
        </>
    )
}

export default ContactPage
