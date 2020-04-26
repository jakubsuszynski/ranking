import React from 'react';
import "./record.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from '@material-ui/icons/Favorite';
import CardMedia from "@material-ui/core/CardMedia";

class Record extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.prepareLink(this.props.record?.fields.url?.stringValue),
            currentVotesNumber: Number(props.record?.fields.votes?.integerValue)
        }
    }

    vote = () => {
        if ((this.props.disabled && !this.props.currentVote) || this.state.votingInProgress) {
            return
        }
        this.setState({votingInProgress: true});
        const docUrl = "https://firestore.googleapis.com/v1/" + this.props.record?.name;
        fetch(docUrl)
            .then(response => {
                return response.json()
            })
            .then(data => {
                const currentVotes = data?.fields?.votes.integerValue;
                let direction;
                if (this.props.currentVote) {
                    direction = -1;
                    this.removeVotedCookie();
                    this.props.userVoted();
                    this.requestVote(docUrl, Number(currentVotes), direction);
                } else {
                    direction = 1;
                    this.setVotedCookie();
                    this.props.userVoted(this.props.record.name);
                    this.requestVote(docUrl, Number(currentVotes), direction);
                }
            })
            .catch(error => {
                console.log(error)
            })
    };

    requestVote = (docUrl, currentVotes, direction) => {
        fetch(docUrl + "?updateMask.fieldPaths=votes", {
            method: "PATCH",
            body: JSON.stringify({fields: {votes: {integerValue: currentVotes + direction}}})
        })
            .then(() => this.setState({
                currentVotesNumber: this.state.currentVotesNumber + direction,
                votingInProgress: false
            }))
            .catch(errorVote => {
                console.log(errorVote)
            })
    };

    setVotedCookie = () => {
        let d = new Date();
        d.setTime(d.getTime() + (1000 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = `votedOn=${this.props.record?.name}; ${expires};path=/`;
    };

    removeVotedCookie = () => {
        document.cookie = `votedOn= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    };

    prepareLink = (url) => {
        if (url && !url.includes("http")) {
            return "http://" + url;
        }
        return url;
    };

    render = () => {
        const isMobile = window.innerWidth <= 600;
        return (
            <Card className={"page-card"}>
                <div>
                    <CardMedia
                        className={"card-image"}
                        image={this.props.record?.fields.imgUrl?.stringValue}
                        title={this.props.record?.fields.title?.stringValue}
                    />
                </div>
                <CardContent className={"card-content-wrapper"}>
                    <div className={"card-content"}>
                        <a href={this.state.url} target="_blank">
                            <Typography
                                variant={isMobile ? "h6" : "h5"}>
                                {this.props.index + ". " + this.props.record?.fields.title?.stringValue}
                            </Typography>
                            <Typography
                                variant={isMobile ? "subtitle2" : "subtitle1"}
                                color="textSecondary">
                                {this.props.record?.fields.url?.stringValue}
                            </Typography>
                        </a>
                    </div>
                    <div className={"card-votes"}>
                        <div>{this.state.currentVotesNumber}</div>
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

export default Record