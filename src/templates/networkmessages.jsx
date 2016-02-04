import React from 'react';

const textColor = '#a89c7f';

export default (p) => {
    let bottom = (
        p.ui.isLoading ||
        p.ui.isFakeLoading ||
        p.rows.nonBlockingErrorMessage ||
        (p.ui.secondTableVisible && p.rows.secondary.loading)
    ) ? 0 : -100;
    return (
<div
    style={{
        position: 'fixed',
        width: 240,
        left: '50%',
        marginLeft: -130,
        bottom: bottom,
        backgroundColor: '#181818',
        borderRadius: '10px 10px 0 0',
        boxShadow: '3px 4px 20px 0px rgba(0, 0, 0, 0.3)',
        padding: 15,
        color: textColor,
        fontSize: 14,
        lineHeight: '25px',
        transition: 'bottom 1s',
        zIndex: 3
    }}
>
    <div
        style={{
            border: '1px solid ' + textColor,
            width: 25,
            height: 25,
            borderRadius: 25,
            fontSize: 16,
            float: 'left',
            marginRight: 10,
            textAlign: 'center'
        }}
    >
        i
    </div>
    <span>
        {
            p.rows.nonBlockingErrorMessage ||
            p.language.messages.network.loadingData
        }
    </span>
</div>
    );
}
