import React from 'react';
import Submit from 'mnmo-components/lib/themes/mnmo/submit';

export default (p, a) => {
    let display = p.ui.error !== null ? 'block' : 'none';
    return (
<div
    style={{
        display: display,
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        paddingTop: 55,
        zIndex: 5
    }}
>
    <div
        style={{
            padding: 20,
            boxSizing: 'border-box'
        }}
    >
        <div
            style={{
                borderRadius:   5,
                padding: 15,
                backgroundColor: 'rgba(255, 0, 0, 0.3)',
                marginBottom: 20,
                boxSizing: 'border-box'
            }}
        >
            <h1
                style={{
                    fontWeight: 300,
                    letterSpacing: 0.5,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
                    width: '100%'
                }}
            >
                Erro
            </h1>
            <p
                style={{
                    fontSize: 14
                }}
            >
                {p.ui.error}
            </p>
        </div>
    </div>
    <form onSubmit={a.buttonClicked}>
        <Submit 
            value="OK"
        />
    </form>
</div>
    );
}
