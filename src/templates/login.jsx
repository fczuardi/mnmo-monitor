/**
 * Login form in HMTL
 */
import React from 'react';
import FieldSet from 'mnmo-components/lib/fieldset';
import TextInput from 'mnmo-components/lib/textinput';
export default (p, s, a) =>
<form>
    <FieldSet legend={p.messages.login.welcome}>
        <TextInput 
            value={s.user.username}
            placeholder={p.messages.login.username}
            onChange={a.usernameChange}
            onBlur={a.usernameBlur}
            style={p.styles}
            name="username"
        />
        <TextInput 
            value={s.user.password}
            placeholder={p.messages.login.password}
            onChange={a.passwordChange}
            onBlur={a.passwordBlur}
            style={p.styles}
            name="password"
            type="password"
        />
    </FieldSet>
</form>;
