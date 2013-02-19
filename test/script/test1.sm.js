//Generated on Monday, February 18, 2013 19:28:55 by the SCION SCXML compiler

var x;

function $script_line_27_column_20(){
    x = 0;
}

function $script_line_35_column_20(){
    x = x + 1;
}

function $expression_line_34_column_48(){
    return x < 100;
}

function $expression_line_39_column_47(){
    return x === 100;
}

module.exports = {
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $script_line_27_column_20
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "b",
                    "cond": $expression_line_34_column_48,
                    "onTransition": $script_line_35_column_20
                },
                {
                    "target": "c",
                    "cond": $expression_line_39_column_47
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};
