"use strict";

export default ({getState, dispatch}) => next => action => {
    const {promise, type} = action;
    const {PENDING, FULFILLED, REJECTED} = type;


    if (!isAsyncAction(action)) {
        /*
         * 不关心的action直接跳 过
         * */
        return next(action);
    }

    dispatch({
        type: PENDING,
    });

    return promise && promise.then(result => Promise.resolve(dispatch({
            type: FULFILLED,
            data: result
        })), error => {
            dispatch({
                type: REJECTED,
                error: error
            });
            return Promise.reject(error);
        });
};

export class AsyncAction {
    constructor(type) {
        this.type = type;
    }

    get PENDING() {
        return this.type + "::PENDING"
    }

    get FULFILLED() {
        return this.type + "::FULFILLED"

    }

    get REJECTED() {
        return this.type + "::REJECT"

    }

    valueOf() {
        return this.type
    }

    toString() {
        return this.type
    }
}

const isPromise=(val) => {
    return val && typeof val.then === 'function';
}

export const isAsyncAction = (action) => {
    const {promise, type} = action;
    const {PENDING, FULFILLED, REJECTED} = type;
    return (isPromise(promise) && PENDING && FULFILLED && REJECTED);
}