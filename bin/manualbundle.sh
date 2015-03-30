cat \
./dist/classic/lib/js/es5-shim.js \
./dist/classic/lib/js/es5-sham.js \
./dist/classic/lib/js/console-polyfill.js \
./dist/classic/lib/js/Intl.js \
./dist/classic/lib/js/Promise.js \
./dist/classic/lib/js/fetch.js \
 > ./dist/classic/polyfills.js

# cat \
# ./dist/classic/lib/js/react-with-addons.js \
# ./dist/classic/lib/js/eventemitter.js \
# ./dist/classic/lib/js/object-assign.js \
# ./dist/classic/lib/js/uniqueid.js \
# ./dist/classic/lib/js/flux.js \
# ./dist/classic/lib/js/flummox.js \
# ./dist/classic/lib/js/flummox-component.js \
#  > ./dist/classic/flummox.js

cat \
./dist/classic/lib/js/react.js \
./dist/classic/lib/js/flummox.js \
./dist/classic/lib/js/flummox-component.js \
 > ./dist/classic/flummox.js

cat \
./dist/classic/lib/js/react-intl.js \
 > ./dist/classic/react-intl.js

cat \
./dist/classic/lib/js/lodash-merge.js \
./dist/classic/lib/js/component-shared.js \
./dist/classic/lib/js/component-stage.js \
./dist/classic/lib/js/component-drawer.js \
./dist/classic/lib/js/component-centeredbox.js \
./dist/classic/lib/js/component-fieldset.js \
./dist/classic/lib/js/component-textinput.js \
./dist/classic/lib/js/component-select.js \
./dist/classic/lib/js/component-checkbox.js \
./dist/classic/lib/js/component-radio.js \
./dist/classic/lib/js/component-submit.js \
./dist/classic/lib/js/component-list.js \
./dist/classic/lib/js/component-li.js \
./dist/classic/lib/js/component-switch.js \
 > ./dist/classic/mnmo-components.js

cat \
./dist/classic/js/actions/country.js \
./dist/classic/js/actions/user.js \
./dist/classic/js/actions/loginValidation.js \
./dist/classic/js/actions/session.js \
 > ./dist/classic/actions.js

cat \
./dist/classic/lib/js/local.js \
./dist/classic/js/entrypoints.js \
./dist/classic/js/apiHelpers.js \
./dist/classic/js/stores/country.js \
./dist/classic/js/stores/user.js \
./dist/classic/js/stores/loginValidation.js \
./dist/classic/js/stores/session.js \
 > ./dist/classic/stores.js

cat \
./dist/classic/js/components/login.js \
./dist/classic/js/components/dashboard.js \
./dist/classic/js/components/router.js \
./dist/classic/js/flux.js \
./dist/classic/js/app.js \
 > ./dist/classic/app.js



# ./dist/classic/lib/js/react-with-addons.js \
# ./dist/classic/lib/js/eventemitter.js \
# ./dist/classic/lib/js/object-assign.js \
# ./dist/classic/lib/js/uniqueid.js \
# ./dist/classic/lib/js/flux.js \
# ./dist/classic/lib/js/flummox.js \
# ./dist/classic/lib/js/flummox-component.js \


echo '-------------------------------------------------------------------------'

cat \
./dist/classic/lib/js/es5-shim.js \
./dist/classic/lib/js/es5-sham.js \
./dist/classic/lib/js/console-polyfill.js \
./dist/classic/lib/js/Intl.js \
./dist/classic/lib/js/Promise.js \
./dist/classic/lib/js/fetch.js \
\
./dist/classic/lib/js/react.js \
./dist/classic/lib/js/flummox.js \
./dist/classic/lib/js/flummox-component.js \
\
./dist/classic/lib/js/react-intl.js \
\
./dist/classic/lib/js/lodash-merge.js \
./dist/classic/lib/js/component-shared.js \
./dist/classic/lib/js/component-stage.js \
./dist/classic/lib/js/component-drawer.js \
./dist/classic/lib/js/component-centeredbox.js \
./dist/classic/lib/js/component-fieldset.js \
./dist/classic/lib/js/component-textinput.js \
./dist/classic/lib/js/component-select.js \
./dist/classic/lib/js/component-checkbox.js \
./dist/classic/lib/js/component-radio.js \
./dist/classic/lib/js/component-submit.js \
./dist/classic/lib/js/component-list.js \
./dist/classic/lib/js/component-li.js \
./dist/classic/lib/js/component-switch.js \
\
./dist/classic/js/actions/country.js \
./dist/classic/js/actions/user.js \
./dist/classic/js/actions/loginValidation.js \
./dist/classic/js/actions/session.js \
\
./dist/classic/lib/js/local.js \
./dist/classic/js/entrypoints.js \
./dist/classic/js/apiHelpers.js \
./dist/classic/js/stores/country.js \
./dist/classic/js/stores/user.js \
./dist/classic/js/stores/loginValidation.js \
./dist/classic/js/stores/session.js \
\
./dist/classic/js/components/login.js \
./dist/classic/js/components/dashboard.js \
./dist/classic/js/components/router.js \
./dist/classic/js/flux.js \
./dist/classic/js/app.js \
 > ./dist/classic/manualbundle.js