import React from 'react';
export default (p) =>
<div 
    className="slider"
    style={{
        marginLeft: p.columnWidth,
        width: p.tableWidth - p.columnWidth - 30,
        height: 30,
        position: 'relative'
    }}
>
    <div 
        className="track"
        style={{
            backgroundColor: '#7f8080',
            height: 2,
            width: '100%',
            position: 'absolute',
            top: 13,
            border: '1px solid #2c2d2d'
        }}
    />
    <div
        className="handle"
        style={{
            backgroundColor: 'white',
            height: 30,
            width: 30,
            borderRadius: 30,
            position: 'absolute',
            cursor: 'grab',
            marginLeft: -15,
            zIndex: 2
        }}
    />
</div>;
