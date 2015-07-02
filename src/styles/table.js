const getRowClassName = (key, p) => {
    if (p.rows.headers[key] === undefined){
        console.log('something wrong, the table has more lines than headers');
        return ['tableRow'];
    }
    let className = ['tableRow'],
        type = p.rows.headers[key][2];
    if (key % 2 !== 0){
        className.push('even');
    }
    if (key === 0 && p.rows.type === 'merged' && p.user.autoUpdate === true) {
        className.push('firstMergedRow');
    }
    className.push('type' + type);
    return className.join(' ');
};

export default (p) => ({
    borderBottom: {
        height: p.rowHeight - 1,
        borderBottom: '1px solid #000'
    },
    borderRight: {
        width: p.columnWidth - 1,
        minWidth: p.columnWidth - 1,
        borderRight: '1px solid #000'
    },
    getRowClassName: function(key){ return getRowClassName(key, p);}
});