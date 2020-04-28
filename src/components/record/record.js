import React from 'react';
import "./record.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from '@material-ui/icons/Favorite';
import CardMedia from "@material-ui/core/CardMedia";
import {Constants, Method, ToastType} from "../../common/Constants";
import * as Utils from "../../common/Utils";

class page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: Utils.prepareUrl(this.props.page?.url)
        }
    }

    vote = () => {
        if ((this.props.disabled && !this.props.currentVote) || this.state.votingInProgress) {
            return
        }
        this.setState({votingInProgress: true});

        // direct url to page user votes on
        const docUrl = Constants.firebaseUrl + this.props.page?.name;

        // fetch current votes number
        fetch(docUrl)
            .then(response => {
                return response.json()
            })
            .then(data => {
                const currentVotes = data?.fields?.votes.integerValue;
                //increment or decrement if user voted on this page already
                let direction;
                if (this.props.currentVote) {
                    direction = -1;
                    Utils.removeVotedCookie();
                    this.props.onUserVote(direction);
                    this.requestVote(docUrl, Number(currentVotes), direction);
                } else {
                    direction = 1;
                    Utils.setVotedCookie(this.props.page?.name);
                    this.props.onUserVote(direction, this.props.page.name);
                    this.requestVote(docUrl, Number(currentVotes), direction);
                }
            })
            .catch(error => {
                console.log(error);
                this.props.openToast(Constants.genericError, ToastType.error)
            })
    };

    requestVote = (docUrl, currentVotes, direction) => {
        fetch(`${docUrl}${Constants.updateMask}`, {
            method: Method.patch,
            body: JSON.stringify({fields: {votes: {integerValue: currentVotes + direction}}})
        })
            .catch(errorVote => {
                console.log(errorVote);
                this.props.openToast(Constants.genericError, ToastType.error);
            });
        this.setState({
            votingInProgress: false
        })
    };

    render = () => {
        const isMobile = window.innerWidth <= 600;
        return (
            <Card className={"page-card"}>
                <div>
                    <CardMedia
                        className={"card-image"}
                        image={this.props.page?.imgUrl}
                        title={this.props.page?.title}
                    />
                </div>
                <CardContent className={"card-content-wrapper"}>
                    <div className={"card-content"}>
                        <a href={this.state.url} target="_blank">
                            <Typography
                                variant={isMobile ? "h6" : "h5"}>
                                {this.props.position + ". " + this.props.page?.title}
                            </Typography>
                            <Typography
                                variant={isMobile ? "subtitle2" : "subtitle1"}
                                color="textSecondary">
                                {this.props.page?.url}
                            </Typography>
                        </a>
                    </div>
                    <div className={"card-votes"}>
                        <div>{this.props.page?.votes}</div>
                        <IconButton
                            className={"like-button"}
                            color={"secondary"}
                            onClick={() => this.vote()}
                            disabled={this.props.currentVote ? false : this.props.disabled}>
                            <FavoriteIcon fontSize={isMobile ? "medium" : "large"} disabled={true}/>
                        </IconButton>
                    </div>
                </CardContent>
            </Card>
        )
    }
}

export default page