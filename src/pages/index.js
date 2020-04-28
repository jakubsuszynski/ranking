import React from "react"

import Layout from "../components/layout/layout"
import SEO from "../components/seo/seo"
import "bootstrap/dist/css/bootstrap.min.css"
import Record from "../components/record/record"
import SubmitPageModal from "../components/submitPageModal/submitPageModal"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {Constants, ToastType} from "../common/Constants";
import * as Utils from "../common/Utils";

class IndexPage extends React.Component {
    state = {
        loading: true,
        error: false,
        fetchedData: [],
        pageVotedOn: undefined
    };

    componentDidMount() {
        this.checkIfUserVoted();
        Utils.fetchPages((pages) => {
            this.setState({
                loading: false,
                fetchedData: pages
            });
        }, () => {
            this.showToast(Constants.generateClassName, ToastType.error)
        })
    }

    checkIfUserVoted = () => {
        this.setState({pageVotedOn: Utils.getCookie(Constants.cookieName)})
    };


    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({toastOpen: false});
    };

    showToast = (message, severity) => {
        this.setState({
            toastOpen: true,
            toastMessage: message,
            toastSeverity: severity
        })
    };

    render() {
        return (
            <Layout>
                <SEO title="Home"/>
                <Snackbar open={this.state.toastOpen} autoHideDuration={3000} onClose={this.handleClose}>
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
                                .sort((r1, r2) => r2?.votes - r1?.votes)
                                .map((page, index) => {
                                    return <Record
                                        key={index}
                                        page={page}
                                        currentVote={page.name === this.state.pageVotedOn}
                                        position={index + 1}
                                        disabled={!!this.state.pageVotedOn}
                                        onUserVote={(direction, selectedPage) => {
                                            page.votes = Number(page.votes) + direction;
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
