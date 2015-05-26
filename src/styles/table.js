
export default (p) => ({
    borderBottom: {
        height: p.rowHeight - 1,
        borderBottom: '1px solid #000'
    },
    borderRight: {
        width: p.columnWidth - 1,
        minWidth: p.columnWidth - 1,
        borderRight: '1px solid #000'
    }
});