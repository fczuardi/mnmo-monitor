import React from 'react';
import CenteredBox from 'mnmo-components/lib/themes/mnmo/centeredbox';
import FieldSet from 'mnmo-components/lib/themes/mnmo/fieldset';
import TextInput from 'mnmo-components/lib/themes/mnmo/textinput';
import Submit from 'mnmo-components/lib/themes/mnmo/submit';
import Button from 'mnmo-components/lib/themes/mnmo/button';
import NetworkMessages from '../components/networkmessages';
import ErrorDialog from '../components/errordialog';

export default (p, a) => {
    let title = p.passwordForm.forgotPasswordToken ? 
                    p.language.messages.password.newPasswordTitle : 
                    p.language.messages.password.changePassword;
    let firstTextField = p.passwordForm.forgotPasswordToken ? null : (
        <TextInput
            value={p.user.currentPassword}
            placeholder={p.language.messages.password.currentPassword}
            onChange={a.currentPasswordChange}
            type="password"
            name="currentPassword"
        />
    );
    return (
<CenteredBox>
    <form onSubmit={a.formSubmit}>
        <FieldSet legend={title}>
            {firstTextField}
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
