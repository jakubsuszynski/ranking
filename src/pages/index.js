import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "bootstrap/dist/css/bootstrap.min.css"
import Record from "../components/record"

class IndexPage extends React.Component {
    state = {
        loading: true,
        error: false,
        fetchedData: [],
    }

    componentDidMount() {
        fetch("http://dummy.restapiexample.com/api/v1/employees")
            .then(response => {
                return response.json()
            })
            .then(data =>
                this.setState({
                    loading: false,
                    fetchedData: data.data,
                })
            )
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            <Layout>
                <SEO title="Home"/>

                {this.state.loading ? (
                        <h1>Loading</h1>
                    ) :
                    <>{
                        this.state.fetchedData.map(char => (
                            <Record singleRecord={char}></Record>
                        ))
                    }</>
                }
                {/* <Link to="/page-2/">Go to page 2</Link> */}
            </Layout>
        )
    }
}

export default IndexPage
