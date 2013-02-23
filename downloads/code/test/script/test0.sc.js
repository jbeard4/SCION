//Generated on Thursday, February 21, 2013 19:56:28 by the SCION SCXML compiler

var x;

function $script_line_27_column_20(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = 100;
}

function $cond_line_34_column_59(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 100;
}

module.exports = {
    "states": [
        {
            "id": "intitial1",
            "transitions": [
                {
                    "target": "a",
                    "onTransition": $script_line_27_column_20
                }
            ]
        },
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "cond": $cond_line_34_column_59
                },
                {
                    "target": "f",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "f"
        }
    ]
};
