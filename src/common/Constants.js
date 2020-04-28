export const Constants = {
    firebaseUrl: "https://firestore.googleapis.com/v1/",
    pagesApi: "https://firestore.googleapis.com/v1/projects/pagesranking-8d081/databases/(default)/documents/pages/",
    submissionsApi: "https://firestore.googleapis.com/v1/projects/pagesranking-8d081/databases/(default)/documents/submissions/",
    imageExtensions: [".png", ".jpg", ".jpeg", ".gif"],
    cookieName: "votedOn",
    imageFormatError: "Image must end up with .jpg, .jpeg, .png or .gif format",
    genericError: "An error occured. Try again later",
    pageSubmitted: "Page submitted",
    imageCantBeEmpty: "Image address cannot be empty",
    addressCantBeEmpty: "Address cannot be empty",
    titleCantBeEmpty: "Title cannot be empty",
    imageUrl: "Image URL",
    pageAddress: "Page Address",
    title: "Title",
    httpPrefix: "http://",
    updateMask: "?updateMask.fieldPaths=votes"
};

export const Method = {
    post: "POST",
    patch: "PATCH",
    get: "GET"
};

export const ToastType = {
    success: "success",
    error: "error"
};
