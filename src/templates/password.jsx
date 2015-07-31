import React from 'react';
import CenteredBox from 'mnmo-components/lib/themes/mnmo/centeredbox';
import FieldSet from 'mnmo-components/lib/themes/mnmo/fieldset';
import Submit from 'mnmo-components/lib/themes/mnmo/submit';
import Button from 'mnmo-components/lib/themes/mnmo/button';
import NetworkMessages from '../components/networkmessages';
import ErrorDialog from '../components/errordialog';

export default (p, a) => {
    p.passwordForm = {
        submitLabelKey: 'change',
        canSubmit: true
    }
    return (
<CenteredBox>
    <form>
        <FieldSet legend={p.language.messages.password.changePassword}>
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
