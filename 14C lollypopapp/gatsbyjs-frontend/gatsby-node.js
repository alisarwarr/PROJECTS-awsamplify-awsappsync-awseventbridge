//Use Gatsby's createPages API
exports.createPages = async ({ actions: { createPage }, graphql }) => {
    const res = await graphql(`
        query {
            ONELOLLYPOP {
                allLollypop {
                    id
                }
            }
        }
    `)

    const { data } = res;
    console.log(data?.ONELOLLYPOP?.allLollypop);             //returns array of objects having 'path' property

    data?.ONELOLLYPOP?.allLollypop.forEach(({ id }) => {     //destructure that 'path' property
        createPage({
            path: `oneLollypop/${id}`,
            component: require.resolve(`./src/templates/oneLollypop.tsx`)
        })
    })
}