/**
 * Created by jzheng on 6/23/17.
 */
export const ruleRunner = (field, name, ...validations) => {
    return (state) => {
        for (let v  of validations) {
            let errorMessageFunc = v(state[field], state);
            if (errorMessageFunc) {
                return {[field]: errorMessageFunc(name)};
            }
        }
        return null;
    };
};

export const run = (state, runners) => {
    return runners.reduce((memo, runner) => {
        return Object.assign(memo, runner(state));
    }, {});
};

export const isRequiredPrint = fieldName => `${fieldName} is required`;

export const mustMatchPrint = otherFieldName => {
    return (fieldName) => `${fieldName} must match ${otherFieldName}`;
};

export const minLengthPrint = length => {
    return (fieldName) => `${fieldName} must be at least ${length} characters`;
};

export const mustBeNumberPrint = fieldName => {
    return (fieldName) => `${fieldName} must be a number`;
};

export const mustBeCsvPrint = fieldName => {
    return (fieldName) => `invalid csv format`;
};

export const mustBeBetween0and100 = fieldName =>
    `${fieldName} must be between 0 and 100`;


export const required = (text) => {
    if (text != '' && null != text) {
        return null;
    } else {
        return isRequiredPrint;
    }
};

export const mustMatch = (field, fieldName) => {
    return (text, state) => {
        return state[field] === text ? null : mustMatchPrint(fieldName);
    };
};

export const minLength = (length) => {
    return (text) => {
        return text.length >= length ? null : minLengthPrint(length);
    };
};

export const mustBeNumber = (text) => {
    return (text) => {
        text ? mustBeNumberPrint : null;
    };
};

export const mustBeCsv = (text) => {

    return text.match(/^([a-z0-9A-Z]+\s*(\s*,\s*[a-z0-9A-Z]+\s*)*|[a-z0-9A-Z]+\s*(\s*,\s*[a-z0-9A-Z]+\s*)*,)$/) ?
            null : mustBeCsvPrint();
};

export const between0and100 = (text) => {
        return (parseInt(text) < 0 || parseInt(text) > 100) ? mustBeBetween0and100 : null;
};