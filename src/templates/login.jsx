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
import Submit from 'mnmo-components/lib/themes/mnmo/submit';
export default (p, s, a) =>
<CenteredBox>
    <form>
        <FieldSet legend={p.messages.login.welcome}>
            <TextInput
                value={s.user.username}
                placeholder={p.messages.login.username}
                onChange={a.usernameChange}
                onBlur={a.usernameBlur}
                name="username"
            />
            <TextInput
                value={s.user.password}
                placeholder={p.messages.login.password}
                onChange={a.passwordChange}
                onBlur={a.passwordBlur}
                type="password"
                name="password"
            />
            <div>
                <Select
                    value={p.country.selected}
                    onChange={a.countrySelect}
                    onBlur={a.countryBlur}
                    name="country"
                >
                    {p.countryOptions.map( (country, key) =>
                        <option key={key} value={country.id}>
                            {country.label}
                        </option>
                    )}
                </Select>
                <Checkbox
                    id="saveInfoCheckbox"
                    checked={s.user.rememberLogin}
                    onChange={a.saveInfoChange}
                    name="saveInfo"
                >
                    {p.messages.login.saveInfo}
                </Checkbox>
            </div>
        </FieldSet>
        <FieldSet className="no-bg">
            <div>
                <Checkbox
                    id="TOSCheckBox"
                    checked={s.user.tosAgree}
                    onChange={a.agreementChange}
                    name="agree"
                >
                    <FormattedMessage
                        message={p.messages.login.iAgree}
                        tosLink={(
                            <a href={p.country.tosURL}>
                                {p.messages.login.tos}
                            </a>
                        )}
                    />
                </Checkbox>
            </div>
        </FieldSet>
        <Submit
            value={s.loginForm.submitButtonLabel}
            disabled={s.loginForm.submitButtonDisabled}
        />
    </form>
</CenteredBox>;
