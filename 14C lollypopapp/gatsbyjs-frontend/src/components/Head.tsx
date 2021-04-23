import React from 'react';
//REACT-HELMET
import { Helmet } from 'react-helmet';
import icon from '../images/icon.ico';
//GATSBYJS
import { graphql, useStaticQuery } from 'gatsby';

interface HeadProp {
    title: String;
}

function Head({ title }: HeadProp) {
    const data = useStaticQuery(graphql`
        query {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `)

    return (
        <Helmet>
            <title> {title} | {`${data.site.siteMetadata.title}`} </title>
            <link rel="shortcut icon" type='image/x-icon' href={icon}/>
        </Helmet>
    )
}

export default Head;