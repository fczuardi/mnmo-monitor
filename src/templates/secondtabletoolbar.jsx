export default (p, a) => {
    let loading = p.rows.secondary.loading === true;
    let autoUpdate = p.rows.secondary.autoUpdate === true;
    // console.log('===RENDER===', autoUpdate);
    let left = p.ui.isMobile ? null : (
        <div
            id={'secondTableToolbarLeft'}
            style={{
                display: p.ui.screenWidth < 670 ? 'none' : 'table-cell'
            }}
        >
            <span
                id={'secondTabtleToolbarTitle'}
                style={{
                    color: '#389D97',
                    marginLeft: 10,
                    whiteSpace: 'nowrap'
                }}
            >
                {p.language.messages.rows.secondTable}
            </span>
        </div>
    );
    let centerStyle = {
        display: 'table-cell',
        // width: '50%',
        // minWidth: 362,
        fontSize: 12,
        textAlign: 'center'
    }
    let addButtonIcon = autoUpdate ? 'icon-check' : 'icon-plus';
    addButtonIcon += loading ? ' addRowButtonDisabled' :  ' addRowButton';
    let addButton = (
        <div
            className={addButtonIcon}
            style={{
                marginLeft: 10,
                border: '2px solid white',
                color: 'white',
                backgroundColor: 'black',
                borderRadius: 17,
                width:  17,
                height: 17,
                fontSize: 17,
                lineHeight: '17px',
                cursor: loading ? 'auto': 'pointer',
                textAlign: 'center',
                display: 'inline-block',
                position: 'relative',
                top: '3px'
            }}
            onClick={loading ? null :
                                p.ui.isMobile ? a.onMobileAddClicked :
                                                            a.onAddClicked}
        ></div>

    );
    let center = p.ui.isMobile ? null: (
        <div
            id={'secondTableToolbarCenter'}
            style={centerStyle}
        >
            <label
                htmlFor={'secondTableVarsCombo'}
                style={{
                    marginRight: 10
                }}
            >
                {p.language.messages.vars.title}
            </label>
            <select
                id={'secondTableVarsCombo'}
                onChange={a.onVarChange}
                onBlur={a.onVarChange}
                value={p.user.newSecondaryRow.variableComboID}
                disabled={autoUpdate || loading}
                style={{
                    borderColor: 'transparent'
                }}
            >
                { p.vars.rawCombos.map( (item, key) => (
                    <option
                        key={key}
                        value={item.id}
                    >
                        {item.label}
                    </option>
                ))}
            </select>
            <label
                htmlFor={'secondTableRangeDateCombo'}
                style={{
                    marginLeft: 10,
                    marginRight: 10
                }}
            >
                {p.language.messages.rows.range}
            </label>
            <input
                type={'text'}
                id={'secondTableRangeDateCombo'}
                placeholder={'YYYY-MM-DD'}
                style={{
                    width: 65,
                    opacity: (autoUpdate || loading) ? 0.5 : 1
                }}
                value={p.user.newSecondaryRow.day}
                onChange={a.onDayChange}
                onBlur={a.onDayChange}
                disabled={autoUpdate || loading}
            >
            </input>
            <input
                type={'text'}
                id={'secondTableBeginHour'}
                placeholder={'HH:MM'}
                style={{
                    width: 32,
                    opacity: loading ? 0.5 : 1
                }}
                value={p.user.newSecondaryRow.startTime}
                onChange={a.onStartTimeChange}
                onBlur={a.onStartTimeChange}
                disabled={loading}
            >
            </input>
            <input
                type={'text'}
                id={'secondTableEndHour'}
                placeholder={'HH:MM'}
                style={{
                    width: 32,
                    opacity: (autoUpdate || loading) ? 0.5 : 1
                }}
                value={p.user.newSecondaryRow.endTime}
                onChange={a.onEndTimeChange}
                onBlur={a.onEndTimeChange}
                disabled={autoUpdate || loading}
            >
            </input>
            {addButton}
        </div>
    );
    let rightStyle = {
        display: 'table-cell',
        fontSize: 12,
        textAlign: 'center',
        cursor: 'pointer',
        opacity: loading ? 0.5 : 1
        // width: '18%',
        // minWidth: 100
    }
    let right = p.ui.isMobile ? null: (
        <div
            id={'secondTableToolbarRight'}
            style={rightStyle}
        >
            <div
                style={{
                    cursor: 'pointer'
                }}
                onClick={a.onAutoUpdateClicked}
            >
                {p.language.messages.settings.autoUpdateStatus}
                <div
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        display: 'inline-block',
                        backgroundColor: autoUpdate ? '#389D97': 'rgba(255, 255, 255, 0.5)',
                        marginLeft: 10
                    }}
                >
                </div>
            </div>
        </div>
    );
    let modibleToolbarContent = p.ui.isMobile ? addButton : null;
    return (
<div
    id={'secondTableToolbar'}
    style={{
        width: '100%',
        backgroundColor: p.ui.isMobile ? '#000' : 'rgba(255,255,255,0.2)',
        height: 50,
        lineHeight: '40px',
        overflow: 'hidden',
        display: 'table'
    }}
>
    {left}
    {center}
    {right}
    {modibleToolbarContent}
</div>
    );
}
