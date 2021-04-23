import React from 'react';
import style from './Heading.module.scss';
import Typography from '@material-ui/core/Typography';
import { graphql, useStaticQuery } from 'gatsby';

function Heading() {
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
        <div className={style.heading}>
            <Typography variant="h4" component="p"> {`'${data.site.siteMetadata.title}'`} </Typography>
        </div>
    )
}

export default Heading;