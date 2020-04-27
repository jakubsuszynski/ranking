import React from 'react';
import "./submitPageModal.css";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

class SubmitPageModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            titleError: false,
            imgError: false,
            addressError: false
        }
    }

    handleClickOpen = () => {
        this.setState({open: true})
    };

    handleClose = () => {
        this.setState({open: false})
    };
    handlePageSubmit = () => {
        return this.validateFields() ? false : this.sendRequest();
    };

    sendRequest = () => {
        fetch("https://firestore.googleapis.com/v1/projects/pagesranking-8d081/databases/(default)/documents/submissions/", {
            method: "POST",
            body: JSON.stringify({
                fields: {
                    title: {
                        stringValue: this.state.title
                    },
                    url: {
                        stringValue: this.state.address
                    },
                    imgUrl: {
                        stringValue: this.state.img
                    },
                    dateOfSubmission: {
                        stringValue: new Date().toLocaleString()
                    }
                }
            })
        })
            .then(response => {
                this.props.openToast("Page submitted", "success");
                this.handleClose();
            })
            .catch(errorVote => {
                console.log(errorVote);
                this.props.openToast("An error occured. Try again later", "error")
            });
        return true;
    };

    validateFields() {
        if (!this.state.title || this.state.title === "") {
            this.setState({
                titleErrorText: "Title cannot be empty",
                titleError: true
            });
            return true;
        } else {
            this.setState({
                titleError: false,
                titleErrorText: undefined
            });
        }
        if (!this.state.address || this.state.address === "") {
            this.setState({
                addressErrorText: "Address cannot be empty",
                addressError: true
            });
            return true;
        } else {
            this.setState({
                addressError: false,
                addressErrorText: undefined
            })
        }

        if (!this.state.img || this.state.img === "") {
            this.setState({
                imgErrorText: "Image address cannot be empty",
                imgError: true
            });
            return true;
        } else if (!this.state.img.includes(".png")
            && !this.state.img.includes(".jpg")
            && !this.state.img.includes(".jpeg")
            && !this.state.img.includes(".gif")) {
            this.setState({
                imgErrorText: "Image must end up with .jpg, .jpeg, .png or .gif format",
                imgError: true
            });
            return true;
        } else {
            this.setState({
                imgError: false,
                imgErrorText: undefined
            })
        }
    }

    render() {
        return (
            <div>
                <Fab variant="extended" aria-label="add" className={"my-button"} onClick={this.handleClickOpen}>
                    <AddIcon/>
                    Submit your page
                </Fab>

                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Submit your page</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To submit your page, provide all the informations below:
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="Title"
                            type="text"
                            fullWidth
                            error={this.state.titleError}
                            onChange={(title) => this.setState({
                                title: title.target.value
                            })}
                            helperText={this.state.titleErrorText}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="url"
                            label="Page Address"
                            type="text"
                            fullWidth
                            error={this.state.addressError}
                            onChange={(address) => this.setState({
                                address: address.target.value
                            })}
                            helperText={this.state.addressErrorText}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="img"
                            label="Image URL"
                            type="text"
                            fullWidth
                            error={this.state.imgError}
                            onChange={(img) => this.setState({
                                img: img.target.value
                            })}
                            helperText={this.state.imgErrorText}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} style={{color: "orangered"}}>
                            Cancel
                        </Button>
                        <Button onClick={this.handlePageSubmit} style={{color: "orangered"}}>
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
};

export default SubmitPageModal
