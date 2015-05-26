
export default (p) => ({
    borderBottom: {
        height: p.rowHeight,
        borderBottom: '1px solid #000',
        boxSizing: 'border-box'
    },
    borderRight: {
        minWidth: p.columnWidth - 1,
        borderRight: '1px solid #000'
    }
});