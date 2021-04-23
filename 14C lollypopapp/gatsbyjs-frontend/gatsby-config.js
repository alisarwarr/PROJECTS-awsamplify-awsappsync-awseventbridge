module.exports = {
    siteMetadata: {
        title: 'Lollypop App'
    },
    plugins: [
        'gatsby-plugin-sass',
        `gatsby-plugin-typescript`,
        `gatsby-plugin-material-ui`,
        'gatsby-plugin-react-helmet',
        {
            resolve: "gatsby-source-graphql",
            options: {
              // Arbitrary name for the remote schema Query type
                typeName: "oneLollypop",     //set own choice
              // Field under which the remote schema will be accessible. You'll use this in your Gatsby query
                fieldName: "ONELOLLYPOP",    //set own choice ( used in 'gatsby-node.js' to get data )
              // Create Apollo Link manually. Can return a Promise.
                url: "https://2qrdpor2qzh5pa25wlwriiiypi.appsync-api.us-east-1.amazonaws.com/graphql",
              // HTTP headers
                headers: {
                    "x-api-key": "da2-2s2kuah24rflbgj6r3td3e2e3u"                                       //ENTER API KEY HERE
                }
            }
        }
    ]
}