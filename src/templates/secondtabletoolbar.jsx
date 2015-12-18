export default (p, a) => {
    let loading = p.rows.secondary.loading === true;
    let autoUpdate = p.rows.secondary.autoUpdate === true;
    // console.log('===RENDER===', autoUpdate);
    let left = p.ui.isMobile ? null : (
        <div
            id={'secondTableToolbarLeft'}
            style={{
                display: p.ui.screenWidth < 780 ? 'none' : 'table-cell',
                verticalAlign: 'middle'
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
        verticalAlign: 'middle',
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
    let varsComboStyle = {
        marginRight: '5%',
        width: 90,
        height: 24,
        lineHeight: '24px',
        minWidth: 90
    };
    let dayButtonStyle = {
        height: 24,
        lineHeight: '24px',
        opacity: (autoUpdate || loading) ? 0.5 : 1
    };
    let startTimeButtonStyle = {
        height: 24,
        lineHeight: '24px',
        width: 50,
        opacity: loading ? 0.5 : 1
    };
    let endTimeButtonStyle = {
        height: 24,
        lineHeight: '24px',
        width: 50,
        opacity: (autoUpdate || loading) ? 0.5 : 1
    };
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
                style={varsComboStyle}
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
                type={'button'}
                id={'secondTableRangeDateCombo'}
                placeholder={'YYYY-MM-DD'}
                style={dayButtonStyle}
                value={p.user.newSecondaryRow.day}
                onClick={a.onDayClick}
                disabled={autoUpdate || loading}
            >
            </input>
            <span
                style={{
                    fontSize: 17,
                    marginRight: '5%',
                    marginLeft: 10,
                    position: 'relative',
                    top: 3
                }}
                className="icon-calendar"
                onClick={a.onDayClick}
            >
            </span>
            <input
                type={'button'}
                id={'secondTableBeginHour'}
                placeholder={'HH:MM'}
                style={startTimeButtonStyle}
                value={p.user.newSecondaryRow.startTime}
                onClick={a.onStartTimeClick}
                disabled={loading}
            >
            </input>
            -
            <input
                type={'button'}
                id={'secondTableEndHour'}
                placeholder={'HH:MM'}
                style={endTimeButtonStyle}
                value={p.user.newSecondaryRow.endTime}
                onClick={a.onEndTimeClick}
                disabled={autoUpdate || loading}
            >
            </input>
            {addButton}
        </div>
    );
    let rightStyle = {
        display: 'table-cell',
        verticalAlign: 'middle',
        fontSize: 12,
        textAlign: 'center',
        cursor: 'pointer',
        opacity: loading ? 0.5 : 1
        // width: '18%',
        // minWidth: 100
    }
    let autoUpdateButton = (
        <div
            style={{
                cursor: 'pointer',
                float: p.ui.isMobile ? 'right': 'none',
                fontSize: p.ui.isMobile ? 12 : 'inherit',
                marginRight: p.ui.isMobile ? 12 : 'inherit'
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
    );
    let right = p.ui.isMobile ? null: (
        <div
            id={'secondTableToolbarRight'}
            style={rightStyle}
        >
            {autoUpdateButton}
        </div>
    );
    let modibleToolbarContent = p.ui.isMobile ? (
        <div>
            {addButton}
            {autoUpdateButton}
        </div>
    ) : null;
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
