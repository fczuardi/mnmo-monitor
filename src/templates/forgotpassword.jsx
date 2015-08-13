import React from 'react';
import CenteredBox from 'mnmo-components/lib/themes/mnmo/centeredbox';
import FieldSet from 'mnmo-components/lib/themes/mnmo/fieldset';
import TextInput from 'mnmo-components/lib/themes/mnmo/textinput';
import Select from 'mnmo-components/lib/themes/mnmo/select';
import Submit from 'mnmo-components/lib/themes/mnmo/submit';
import Button from 'mnmo-components/lib/themes/mnmo/button';
import NetworkMessages from '../components/networkmessages';
import ErrorDialog from '../components/errordialog';

export default (p, a) => {
    return (
<CenteredBox>
    <form onSubmit={a.formSubmit}>
        <FieldSet legend={p.language.messages.password.forgotPasswordTitle}>
            <TextInput
                value={p.user.email}
                placeholder={p.language.messages.password.email}
                onChange={a.emailChange}
                name="email"
            />
            <div>
                <Select
                    value={p.user.countryID}
                    onChange={a.countrySelect}
                    name="country"
                >
                    {p.country.options.map( (country, key) =>
                        <option key={key} value={country.id}>
                            {country.label}
                        </option>
                    )}
                </Select>
            </div>
            <div style={{
                clear:'both',
                paddingTop: 15
            }}>
                <div style={{
                    width: 134,
                    float: 'left',
                    marginRight: 5
                }}>
                    <Submit
                        inside={true}
                        value={p.language.messages.password.submit[p.forgotPasswordForm.submitLabelKey]}
                        disabled={(! p.forgotPasswordForm.canSubmit)}
                    />
                </div>
                <div style={{
                    width: 134,
                    float: 'left'
                }}>
                    <Button
                        inside={true}
                        value={p.language.messages.password.cancel}
                        onClick={a.cancelClick}
                    />
                </div>
            </div>
        </FieldSet>
    </form>
<div style={{
    position: 'fixed',
    left: 0
}}>
<NetworkMessages {...p} />
<ErrorDialog {...p} />
</div>
</CenteredBox>
    );
}
