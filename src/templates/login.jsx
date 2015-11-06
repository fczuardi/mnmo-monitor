/**
 * Login form in HMTL
 */
import React from 'react';
import {FormattedMessage} from 'react-intl';
import CenteredBox from 'mnmo-components/lib/themes/mnmo/centeredbox';
import FieldSet from 'mnmo-components/lib/themes/mnmo/fieldset';
import TextInput from 'mnmo-components/lib/themes/mnmo/textinput';
import Select from 'mnmo-components/lib/themes/mnmo/select';
import Checkbox from 'mnmo-components/lib/themes/mnmo/checkbox';
import RadioButton from 'mnmo-components/lib/themes/mnmo/radio';
import CaptchaAnswers from 'mnmo-components/lib/themes/mnmo/radiogroup';
import Submit from 'mnmo-components/lib/themes/mnmo/submit';
export default (p, a) => {
    let firstAttempt = (p.session.error === null) && (p.ui.error === null);
    let errorMessage = p.session.error || p.ui.error;
    let submitButton = (
        <Submit
            value={p.language.messages.login.submit[p.loginForm.submitLabelKey]}
            disabled={(! p.loginForm.canSubmit)}
        />
    );
    let tryAgain = (
        <div
            style={{
                paddingLeft: 25,
                paddingRight: 25,
                margin: 0,
                marginBottom: 5
            }}
        >
            <p style={{
                borderRadius: 5,
                padding: 10,
                marginBottom: 5,
                marginTop: 0,
                backgroundColor: 'rgba(255, 0, 0, 0.2)'
            }}>
                {errorMessage}
            </p>
            {submitButton}
        </div>
    );
    return (
<CenteredBox>
    <form onSubmit={a.formSubmit}>
        <FieldSet
            legend={p.language.messages.login.welcome}
            className="LoginFieldset"
        >
            <div
                style={{
                    position: 'absolute',
                    top: 28,
                    right: 28
                }}
            >
                <img src="./img/logo_login_small.png" />
            </div>
            <TextInput
                value={p.user.username}
                placeholder={p.language.messages.login.username}
                onChange={a.usernameChange}
                onBlur={a.usernameBlur}
                name="username"
            />
            <TextInput
                value={p.user.password}
                placeholder={p.language.messages.login.password}
                onChange={a.passwordChange}
                onBlur={a.passwordBlur}
                type="password"
                name="password"
            />
            <div>
                <Select
                    value={p.user.countryID}
                    onChange={a.countrySelect}
                    onBlur={a.countryBlur}
                    name="country"
                >
                    {p.country.options.map( (country, key) =>
                        <option key={key} value={country.id}>
                            {country.label}
                        </option>
                    )}
                </Select>
                <span>
                    <a href="#" onClick={a.forgotPasswordClick}>
                        {p.language.messages.password.forgotPasswordLink}
                    </a>
                </span>
            </div>
            <div style={{
                clear: 'both',
                marginTop: 15
            }}>
                <Checkbox
                    id="saveInfoCheckbox"
                    checked={p.user.rememberLogin}
                    onChange={a.saveInfoChange}
                    name="saveInfo"
                >
                    {p.language.messages.login.saveInfo}
                </Checkbox>
            </div>
        </FieldSet>
        {firstAttempt ? null : tryAgain}
        <FieldSet legend={p.loginForm.captchaQuestion}>
            <CaptchaAnswers>
            {p.loginForm.captchaAnswers.map( (answer, key) =>
                <RadioButton
                    id={('radio-' + key)}
                    name="captcha-answer"
                    key={key}
                    value={answer}
                    first={(key === 0)}
                    checked={(key === p.loginForm.selectedAnswerIndex)}
                    onChange={a.captchaAnswerChange}
                    isBox={true}
                >
                    {answer}
                </RadioButton>
            )}
            </CaptchaAnswers>
        </FieldSet>
        <FieldSet className="no-bg">
            <div>
                <Checkbox
                    id="TOSCheckBox"
                    checked={p.user.tosAgree}
                    onChange={a.agreementChange}
                    name="agree"
                >
                    <FormattedMessage
                        message={p.language.messages.login.iAgree}
                        tosLink={(
                            p.user.tosURL ? (
                                    <a target='_blank' href={p.user.tosURL}>
                                        {p.language.messages.login.tos}
                                    </a>
                                ) : (
                                    p.language.messages.login.tos
                                )
                        )}
                    />
                </Checkbox>
            </div>
        </FieldSet>
        {firstAttempt ? submitButton : null}
    </form>
</CenteredBox>
    );
}
