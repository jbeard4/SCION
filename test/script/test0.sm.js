//Generated on Monday, February 18, 2013 19:28:55 by the SCION SCXML compiler

var x;

function $script_line_27_column_20(){
    x = 100;
}

function $expression_line_34_column_57(){
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
                    "cond": $expression_line_34_column_57
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
