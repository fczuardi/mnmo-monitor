import React from 'react';

export default (p, a) =>
<div>
    <ol className="list-group">
        <ol>
            <li className="list-group-item">
                <label htmlFor="onOffSomething">
                    Menu item
                </label>
                <input type="checkbox" id="onOffSomething" />
            </li>
        </ol>
        <ol>
            <li className="list-group-item">
                <label htmlFor="option1">Option 1</label>
                <input type="radio" id="option1" name="someRadioGroup"/>
            </li>
            <li className="list-group-item">
                <label htmlFor="option2">Option 2</label>
                <input type="radio" id="option2" name="someRadioGroup"/>
            </li>
            <li className="list-group-item">
                <label htmlFor="option3">Option 3</label>
                <input type="radio" id="option3" name="someRadioGroup"/>
            </li>
        </ol>
        <ol>
            <li className="list-group-item">
                <a href="#">Menu item</a>
            </li>
            <li className="list-group-item">
                <a href="#">Menu item</a>
            </li>
        </ol>
        <ol>
            <li className="list-group-item">
                <a href="#">Menu item</a>
            </li>
            <li className="list-group-item">
                <a href="#">Menu item</a>
            </li>
        </ol>
        <ol>
            <li className="list-group-item">
                <a href="#">Menu item</a>
            </li>
            <li className="list-group-item">
                <a onClick={a.logoutClick} href="#">Logout</a>
            </li>
        </ol>
    </ol>
</div>;
