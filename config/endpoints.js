export default {
    baseUrl: 'http://192.168.1.183:9001',
    country: {
        list: '/country/list'
    },
    validation: {
        captcha: '/validation/captcha'
    },
    session: {
        login: '/auth/login',
        loginLanguageParam: 'lang', //ex: 'pt-BR'
        loginError: '/auth/login/error',
        loginErrorStatus: 400
    },
    user: {
        preferences: '/user/preferences',
        password: '/user/password',
        expiredPassword: '/user/expiredPassword',
        forgotPassword: '/user/forgotPassword',
        countryParam: 'countryID',
        emailParam: 'email',
        tokenParam: 'token'
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
        endTimeParam: 'time',
        detailed: '/rows/detailed',
        secondTable: '/rows/secondTable',
        secondTableDayParam: 'day',
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
