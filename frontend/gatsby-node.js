/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// exports.onCreateNode = ({ node, actions, getNode }) => {
//     const { createNodeField } = actions

//     console.log(JSON.stringify(node, null, 2))

//     // if (node.internal.type === `MarkdownRemark`) {
//     //   const value = createFilePath({ node, getNode })
//     //   createNodeField({
//     //     name: `slug`,
//     //     node,
//     //     value,
//     //   })
//     // }
// }

const path = require("path")

exports.onCreateNode = ({ node, getNodesByType, actions }) => {
    const { createParentChildLink } = actions

    if (node.internal.type === "Directory") {
        if (node.sourceInstanceName === "portfolio") {
            // in some case the trailing slash is missing.
            // Always add it and normalize the path to remove duplication
            const parentDirectory = path.normalize(node.dir + "/")
            const parent = getNodesByType("Directory").find(
                n => path.normalize(n.absolutePath + "/") === parentDirectory
            )
            if (parent) {
                node.parent = parent.id
                createParentChildLink({
                    child: node,
                    parent: parent,
                })
            }
        }
    }
}

// exports.onCreateNode = ({ node, getNodesByType, actions }) => {
//     const { createParentChildLink } = actions

//     if (
//         node.sourceInstanceName === "portfolio" && node.internal.type === "Directory"
//     ) {
//         // in some case the trailing slash is missing.
//         // Always add it and normalize the path to remove duplication
//         const parentDirectory = path.normalize(node.dir + "/")
//         const parent = getNodesByType("Directory").find(
//             n => path.normalize(n.absolutePath + "/") === parentDirectory
//         )
//         if (parent) {
//             node.parent = parent.id
//             createParentChildLink({
//                 child: node,
//                 parent: parent,
//             })
//         }
//     }
// }

// exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
//     const { createNode } = actions

//     // Data can come from anywhere, but for now create it manually
//     const myData = {
//         key: 123,
//         foo: `The foo field of my node`,
//         bar: `Baz`,
//     }

//     const nodeContent = JSON.stringify(myData)

//     const nodeMeta = {
//         id: createNodeId(`my-data-${myData.key}`),
//         parent: null,
//         children: [],
//         internal: {
//             type: `MyNodeType`,
//             mediaType: `text/html`,
//             content: nodeContent,
//             contentDigest: createContentDigest(myData),
//         },
//     }

//     const node = Object.assign({}, myData, nodeMeta)
//     console.log(node)
//     createNode(node)
// }
