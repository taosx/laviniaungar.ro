module.exports = {
    siteMetadata: {
        title: `Lavinia Ungar - Interior Design`,
        description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
        author: `@gatsbyjs`,
        menuLinks: [
            {
                link: "/",
                content: "Home",
            },
            {
                link: "/#services",
                content: "Services",
            },
            {
                link: "/portfolio",
                content: "Portfolio",
            },
            {
                link: "/#art-around-art",
                content: "Art around Art",
            },
            {
                link: "/contact/",
                content: "Contact",
            },
        ],
    },
    plugins: [
        `gatsby-background-image`,
        `gatsby-plugin-react-helmet`,
        "gatsby-plugin-extract-image-colors",
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-plugin-sharp`,
            options: {
                useMozJpeg: true,
                stripMetadata: true,
                defaultQuality: 85,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/assets/images`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `slides`,
                path: `${__dirname}/slideshow`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/portfolio`,
                name: `portfolio`,
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `gatsby-starter-default`,
                short_name: `starter`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/assets/images/gatsby-icon.png`, // This path is relative to the root of the site.
            },
        },
        `gatsby-plugin-sass`,
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // `gatsby-plugin-offline`,
    ],
}
