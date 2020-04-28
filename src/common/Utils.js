import {Constants, Method} from "./Constants";

export const setVotedCookie = (pageName) => {
    let d = new Date();
    d.setTime(d.getTime() + (1000 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = `${Constants.cookieName}=${pageName}; ${expires};path=/`;
};

export const removeVotedCookie = () => {
    document.cookie = `${Constants.cookieName}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

export const prepareUrl = (url) => {
    if (url && !url.includes(Constants.httpPrefix)) {
        return Constants.httpPrefix + url;
    }
    return url;
};

export const getCookie = (cname) => {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
};

export const fetchPages = (success, failure) => {
    fetch(Constants.pagesApi)
        .then(response => {
            return response.json()
        })
        .then(data => {
                success(data.documents.map(document => ({
                    name: document.name,
                    url: document.fields.url?.stringValue,
                    imgUrl: document.fields.imgUrl?.stringValue,
                    title: document.fields.title?.stringValue,
                    votes: document.fields.votes?.integerValue
                })))
            }
        )
        .catch(error => {
            console.log(error);
            failure();
        })
};

export const isNotEmpty = (testString) => {
    return !testString || testString === ""
};

export const submitPage = (success, failure) => {
    fetch(Constants.submissionsApi, {
        method: Method.post,
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
        .then(() => {
            success()
        })
        .catch(errorVote => {
            console.log(errorVote);
            failure()
        });
    return true;
};

export const isImage = (imgUrl) => {
    return Constants.imageExtensions.find(ext => imgUrl.endsWith(ext))
};