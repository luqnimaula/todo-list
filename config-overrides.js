const path = require('path');
const {override, addLessLoader, addWebpackAlias, adjustWorkbox} = require('customize-cra');

const overrideProcessEnv = value => config => {
    config.resolve.modules = [
        path.join(__dirname, 'src')
    ].concat(config.resolve.modules);
    return config;
};

module.exports = override(
    addLessLoader({
        modifyVars: {
            'nav-dark-text-color': '#ffffff',
        },
        javascriptEnabled: true,
    }),
    overrideProcessEnv({
        VERSION: JSON.stringify(require('./package.json').version),
    }),
    addWebpackAlias({
        ['@app']: path.resolve(__dirname, 'src'),
        ['@reduxActions']: path.resolve(__dirname, 'src/appRedux/actions'),
        ['@reduxReducers']: path.resolve(__dirname, 'src/appRedux/reducers'),
        ['@reduxStore']: path.resolve(__dirname, 'src/appRedux/store'),
        ['@constants']: path.resolve(__dirname, 'src/constants'),
        ['@containers']: path.resolve(__dirname, 'src/containers'),
        ['@routes']: path.resolve(__dirname, 'src/routes'),
        ['@config']: path.resolve(__dirname, 'src/config'),
        ['@util']: path.resolve(__dirname, 'src/util'),
    }),
    adjustWorkbox(wb =>
        Object.assign(wb, {
            skipWaiting: true,
            exclude: (wb.exclude || []).concat("index.html")
        })
    )
);
