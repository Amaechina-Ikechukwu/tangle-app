// middleware/checkTokenExpiryMiddleware.js

const checkTokenExpiryMiddleware = storeAPI => next => action => {
    if (action.type.includes('rejected') && action.error.message === 'Token expired' && action.error.message === 'Token expired') {
        // You can customize the condition based on the actual error message from your server
        storeAPI.dispatch(logoutUserAsync());
    }
    return next(action);
};

export default checkTokenExpiryMiddleware;
