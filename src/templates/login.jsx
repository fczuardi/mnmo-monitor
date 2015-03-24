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
import Submit from 'mnmo-components/lib/themes/mnmo/submit';
export default (p, a) =>
<CenteredBox>
    <form onSubmit={a.formSubmit}>
        <FieldSet legend={p.messages.login.welcome}>
            <TextInput
                value={p.user.username}
                placeholder={p.messages.login.username}
                onChange={a.usernameChange}
                onBlur={a.usernameBlur}
                name="username"
            />
            <TextInput
                value={p.user.password}
                placeholder={p.messages.login.password}
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
                <Checkbox
                    id="saveInfoCheckbox"
                    checked={p.user.rememberLogin}
                    onChange={a.saveInfoChange}
                    name="saveInfo"
                >
                    {p.messages.login.saveInfo}
                </Checkbox>
            </div>
        </FieldSet>
        <FieldSet legend={p.loginForm.captchaQuestion}>
            {p.loginForm.captchaAnswers.map( (answer, key) =>
                <RadioButton 
                    id={('radio-' + key)}
                    name="captcha-answer"
                    key={key}
                    value={key}
                    first={(key === 0)}
                    onChange={a.captchaAnswerChange}
                >
                    {answer}
                </RadioButton>
            )}
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
                        message={p.messages.login.iAgree}
                        tosLink={(
                            <a target='_blank' href={p.user.tosURL}>
                                {p.messages.login.tos}
                            </a>
                        )}
                    />
                </Checkbox>
            </div>
        </FieldSet>
        <Submit
            value={p.messages.login.submit[p.loginForm.submitLabelKey]}
            disabled={(! p.loginForm.canSubmit)}
        />
    </form>
</CenteredBox>;
