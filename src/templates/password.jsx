import React from 'react';
import CenteredBox from 'mnmo-components/lib/themes/mnmo/centeredbox';
import FieldSet from 'mnmo-components/lib/themes/mnmo/fieldset';
import TextInput from 'mnmo-components/lib/themes/mnmo/textinput';
import Submit from 'mnmo-components/lib/themes/mnmo/submit';
import Button from 'mnmo-components/lib/themes/mnmo/button';
import NetworkMessages from '../components/networkmessages';
import ErrorDialog from '../components/errordialog';

export default (p, a) => {
    return (
<CenteredBox>
    <form>
        <FieldSet legend={p.language.messages.password.changePassword}>
            <TextInput
                value={p.user.currentPassword}
                placeholder={p.language.messages.password.currentPassword}
                onChange={a.currentPasswordChange}
                type="password"
                name="currentPassword"
            />
            <TextInput
                value={p.user.newPassword}
                placeholder={p.language.messages.password.newPassword}
                onChange={a.newPasswordChange}
                type="password"
                name="newPassword"
            />
            <TextInput
                value={p.user.confirmNewPassword}
                placeholder={p.language.messages.password.confirmNewPassword}
                onChange={a.confirmNewPasswordChange}
                type="password"
                name="confirmNewPassword"
            />
        
        
        
        
            <div>
                <div style={{
                    width: 134,
                    float: 'left',
                    marginRight: 5
                }}>
                    <Submit
                        inside={true}
                        value={p.language.messages.password.submit[p.passwordForm.submitLabelKey]}
                        disabled={(! p.passwordForm.canSubmit)}
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
        <FieldSet>
            <p>{p.language.messages.password.info.title}</p>
            <ul>
                {p.language.messages.password.info.requirements.map(
                    (req) => (
                        <li>{req}</li>
                        
                    )
                )}
            </ul>
        </FieldSet>
    </form>
    <NetworkMessages {...p} />
    <ErrorDialog {...p} />
</CenteredBox>
    );
}