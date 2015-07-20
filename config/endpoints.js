export default {
    baseUrl: 'http://192.168.1.132:9001',
    thumbnailsUrl: 'https://c2.staticflickr.com/4/3788/12456893885_fb2499219c_n.jpg',
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
        detailed: '/rows/detailed',
        endTimeParam: 'time',
        rowsError: '/rows/error',
        rowsErrorStatus: 500
    },
    frequency: {
        list: '/frequencies',
        countryParam: 'countryID'
    },
    calendar: {
        days: '/calendar/days',
        monthParam: 'm',
        yearParam: 'y',
        dayLimits: '/calendar/dayLimits',
        countryParam: 'countryID'
    },
    images: {
        groupParam: 'group',
        columnParam: 'columnID',
        dayParam: 'day',
        hourParam: 'hour'
    }
};
