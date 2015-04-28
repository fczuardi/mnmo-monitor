export default {
    baseUrl: 'http://192.168.1.132:9001',
    country: {
        list: '/country/list'
    },
    validation: {
        captcha: '/validation/captcha'
    },
    session: {
        login: '/auth/login'
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
        merged: '/rows/merged'
    },
    frequency: {
        list: '/frequencies',
        countryParam: 'countryID'
    }
};
