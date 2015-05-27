export default {
    baseUrl: 'http://192.168.1.132:9001',
    country: {
        list: '/country/list'
    },
    validation: {
        captcha: '/validation/captcha'
    },
    session: {
        login: '/auth/login',
        loginError: '/auth/login/error',
        loginErrorStatus: 400
    },
    user: {
        preferences: '/user/preferences'
    },
    languages: {
        list: '/languages'
    },
    columns: {
        list: '/columns'
    },
    filters: {
        groups: '/filters/groups',
        subgroups: '/filters/subgroups',
        variables: '/filters/variables'
    },
    rows: {
        list: '/rows',
        merged: '/rows/merged',
        endTimeParam: 'time'
    },
    frequency: {
        list: '/frequencies',
        countryParam: 'countryID'
    },
    calendar: {
        days: '/calendar/days',
        monthParam: 'm',
        yearParam: 'y'
    }
};
