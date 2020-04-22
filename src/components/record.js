import React from 'react';
import "./record.css";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from '@material-ui/icons/Favorite';

class Record extends React.Component {

    vote = (id) => {
        if (this.props.disabled) {
            return
        }
        const docUrl = "https://firestore.googleapis.com/v1/" + id;
        fetch(docUrl)
            .then(response => {
                return response.json()
            })
            .then(data => {
                const currentVotes = data?.fields?.votes.integerValue;
                this.requestVote(docUrl, currentVotes);
                this.props.userHaveVoted();
                this.setVotedCookie()
            })
            .catch(error => {
                console.log(error)
            })
    };


    requestVote = (docUrl, currentVotes) => {
        fetch(docUrl + "?updateMask.fieldPaths=votes", {
            method: "PATCH",
            body: JSON.stringify({fields: {votes: {integerValue: Number(currentVotes) + 1}}})
        })
            .then(this.props.reloadPages)
            .catch(errorVote => {
                console.log(errorVote)
            })
    };

    setVotedCookie = () => {
        let d = new Date();
        d.setTime(d.getTime() + (1000 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = "voted=true" + ";" + expires + ";path=/";
    };

    render = () => {
        return (
            <Card className={"page-card"}>
                <CardMedia
                    className={"card-image"}
                    image={this.props.record?.fields.imgUrl?.stringValue}
                    title={this.props.record?.fields.title?.stringValue}
                />
                <CardContent className={"card-content"}>
                    <div>
                        <Typography
                            component="h5"
                            variant="h5">
                            {this.props.index + ". " + this.props.record?.fields.title?.stringValue}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="textSecondary">
                            {this.props.record?.fields.url?.stringValue}
                        </Typography>
                    </div>
                    <div className={"card-votes"}>
                        <div>{this.props.record?.fields.votes?.integerValue}</div>
                        <IconButton
                            className={"like-button"}
                            color={"secondary"}
                            onClick={() => this.vote(this.props.record?.name)}
                            disabled={this.props.disabled}>
                            <FavoriteIcon fontSize={"large"} disabled={true}/>
                        </IconButton>
                    </div>
                </CardContent>
            </Card>
        )
    }
}

export default Record