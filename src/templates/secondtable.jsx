export default (p) =>
<div
    id={'secondTableContainer'}
>
    <div
        id={'secondTableToolbar'}
        style={{
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            height: 50,
            lineHeight: '50px',
            overflow: 'hidden'
        }}
    >
        <div
            id={'secondTableToolbarLeft'}
            style={{
                display: 'table-cell',
                width: '20%'
            }}
        >
            <span
                id={'secondTabtleToolbarTitle'}
                style={{
                    color: '#389D97',
                    marginLeft: 10
                }}
            >
                {p.language.messages.rows.secondTable}
            </span>
        </div>
        <div
            id={'secondTableToolbarCenter'}
            style={{
                display: 'table-cell',
                width: '50%',
                fontSize: 12,
                textAlign: 'center'
            }}
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
                placeholder={'DD/MM/YYYY'}
                style={{
                    width: 80
                }}
            >
            </input>
            <input
                type={'text'}
                id={'secondTableBeginHour'}
                placeholder={'HH:MM'}
                style={{
                    width: 40
                }}
            >
            </input>
            <input
                type={'text'}
                id={'secondTableEndHour'}
                placeholder={'HH:MM'}
                style={{
                    width: 40
                }}
            >
            </input>
            <div
                className={'addRowButton'}
                style={{
                    marginLeft: 10,
                    border: '2px solid white',
                    color: 'white',
                    backgroundColor: 'black',
                    borderRadius: 20,
                    width:  20,
                    height: 20,
                    fontSize: 20,
                    lineHeight: '20px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    display: 'inline-block'
                }}
            >
                +
            </div>
        </div>
        <div
            id={'secondTableToolbarRight'}
            style={{
                display: 'table-cell',
                fontSize: 12,
                textAlign: 'right',
                width: '15%'
            }}
        >
            <div>
                {p.language.messages.settings.autoUpdateStatus}
                <div
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        display: 'inline-block',
                        backgroundColor: '#389D97'

                    }}
                >
                </div>
            </div>
        </div>
    </div>
</div>;
