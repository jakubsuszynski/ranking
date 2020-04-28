/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import {useStaticQuery, graphql} from "gatsby"

import Header from "../header/header"
import "./layout.css"
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";

const Layout = ({children}) => {
    const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

    return (
        <>
            <Header
                siteTitle={data.site.siteMetadata.title}
                siteDesc={data.site.siteMetadata.description}
            />
            <div
                style={{
                    margin: `0 auto`,
                    maxWidth: 960,
                    padding: `0 1.0875rem 1.45rem`,
                }}
            >
                <main>{children}</main>
                <footer>© {new Date().getFullYear()}</footer>
            </div>
        </>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
