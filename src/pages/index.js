import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "bootstrap/dist/css/bootstrap.min.css"
import Record from "../components/record"
import SubmitPageModal from "../components/submitPageModal"

class IndexPage extends React.Component {
    state = {
        loading: true,
        error: false,
        fetchedData: [],
    };

    componentDidMount() {
        this.fetchPages()
    }

    fetchPages = () => {
        fetch("https://firestore.googleapis.com/v1/projects/pagesranking-8d081/databases/(default)/documents/pages/")
            .then(response => {
                return response.json()
            })
            .then(data => {
                    this.setState({
                        loading: false,
                        fetchedData: data.documents,
                    });
                }
            )
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            <Layout>
                <SEO title="Home"/>
                <SubmitPageModal/>
                {this.state.loading ? (
                        <h1>Loading</h1>
                    ) :
                    <>
                        {
                            this.state.fetchedData.sort((r1, r2) => r2?.fields.votes.integerValue - r1?.fields.votes.integerValue).map(page => (
                                <Record record={page} reloadPages={this.fetchPages}/>
                            ))
                        }
                    </>
                }
                {/* <Link to="/page-2/">Go to page 2</Link> */}
            </Layout>
        )
    }
}

export default IndexPage
