import {Store} from 'flummox';

class ColumnsStore extends Store {
    constructor() {
        super();
        this.state = {
            enabled: [
                {
                    label: 'A'
                },
                {
                    label: 'B'
                },
                {
                    label: 'C'
                }
            ],
            disabled: [
                {
                    label: 'D'
                },
                {
                    label: 'E'
                },
                {
                    label: 'F'
                }
            ]
        };
    }
}

export default ColumnsStore;
