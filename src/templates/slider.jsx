import React from 'react';
export default (p) =>
<div 
    id="table-slider"
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
            backgroundColor: '#28292A',
            height: 2,
            width: '100%',
            position: 'absolute',
            top: 13,
            border: '1px solid #000000'
        }}
    />
    <div 
        id="slider-enabled-region"
        style={{
            backgroundColor: '#808181',
            height: 2,
            position: 'absolute',
            top: 13,
            border: '1px solid #2c2d2d'
        }}
    />
    <div
        id="table-slider-handle"
        className="handle"
        onMouseDown={(event) => {event.preventDefault()}}
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
