import React from 'react';
import CenteredBox from 'mnmo-components/lib/themes/mnmo/centeredbox';
import Submit from 'mnmo-components/lib/themes/mnmo/submit';

export default (p, a) => {
    let display = p.ui.error !== null ? 'table' : 'none',
        width = 320;
    
    return (
<div
    style={{
        display: display,
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingTop: 55,
        zIndex: 5
    }}
    onClick={a.buttonClicked}
>
<div
    style={{
        display: 'table-cell',
        verticalAlign: 'middle'
    }}
>
    <div
        style={{
            width: width,
            margin: 'auto',
            padding: 20,
            boxSizing: 'border-box',
            // backgroundColor: '#000000',
            borderRadius:   5,
            marginTop: -250
        }}
        onClick={(event) => {event.stopPropagation();}}
    >
        <div
            style={{
                borderRadius:   5,
                padding: 15,
                backgroundColor: '#5D0000',
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
            <form 
                style={{
                    marginBottom: 0
                }}
                onSubmit={a.buttonClicked}
            >
                <Submit
                    inside={true}
                    value="OK"
                />
            </form>
        </div>
    </div>
</div>
</div>
    );
}
