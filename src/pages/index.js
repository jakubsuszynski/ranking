import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "bootstrap/dist/css/bootstrap.min.css"
import Record from "../components/record"
import SubmitPageModal from "../components/submitPageModal"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

class IndexPage extends React.Component {
    state = {
        loading: true,
        error: false,
        fetchedData: [],
        pageVotedOn: undefined
    };

    componentDidMount() {
        this.checkIfUserVoted();
        this.fetchPages()
    }

    checkIfUserVoted = () => {
        this.setState({pageVotedOn: this.getCookie("votedOn")})
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

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({modalOpen: false});
    };

    showToast = (message, severity) => {
        this.setState({
            modalOpen: true,
            toastMessage: message,
            toastSeverity: severity
        })
    };

    render() {
        return (
            <Layout>
                <SEO title="Home"/>
                <Snackbar open={this.state.modalOpen} autoHideDuration={3000} onClose={this.handleClose}>
                    <MuiAlert elevation={6} variant="filled" onClose={this.handleClose}
                              severity={this.state.toastSeverity}>
                        {this.state.toastMessage}
                    </MuiAlert>
                </Snackbar>
                <SubmitPageModal openToast={this.showToast}/>
                {this.state.loading ? (
                        <h1>Loading</h1>
                    ) :
                    <>
                        {
                            [...this.state.fetchedData]
                                .sort((r1, r2) => r2?.fields.votes.integerValue - r1?.fields.votes.integerValue)
                                .map((page, index) => {
                                    return <Record
                                        key={index}
                                        record={page}
                                        currentVote={page.name === this.state.pageVotedOn}
                                        position={index + 1}
                                        disabled={!!this.state.pageVotedOn}
                                        onUserVote={(direction, selectedPage) => {
                                            page.fields.votes.integerValue = Number(page.fields.votes?.integerValue) + direction;
                                            this.setState({pageVotedOn: selectedPage})
                                        }}
                                        openToast={this.showToast}/>
                                })
                        }
                    </>
                }
            </Layout>
        )
    }
}

export default IndexPage
