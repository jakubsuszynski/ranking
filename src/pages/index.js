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
        fetchedData: []
    };

    componentDidMount() {
        this.checkIfUserVoted();
        this.fetchPages()
    }

    checkIfUserVoted = () => {
        this.setState({haveUserVoted: !!this.getCookie("voted")})
    };

    getCookie = (cname) => {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
    };

    userHaveVoted = () => {
        this.setState({
            haveUserVoted: true
        })
    };

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
    };

    render() {
        let i = 0;
        return (
            <Layout>
                <SEO title="Home"/>
                <SubmitPageModal/>
                {this.state.loading ? (
                        <h1>Loading</h1>
                    ) :
                    <>
                        {
                            this.state.fetchedData
                                .sort((r1, r2) => r2?.fields.votes.integerValue - r1?.fields.votes.integerValue)
                                .map(page => {
                                    i++;
                                    return <Record
                                        key={i}
                                        record={page}
                                        reloadPages={this.fetchPages}
                                        index={i}
                                        disabled={this.state.haveUserVoted}
                                        userHaveVoted={this.userHaveVoted}/>
                                })
                        }
                    </>
                }
            </Layout>
        )
    }
}

export default IndexPage
