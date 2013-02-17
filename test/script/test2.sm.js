var x;

function  $script_line_27_column_20(){
    x = 0;
}

function  $script_line_52_column_20(){
    x = x * 2;
}

function  $expression_line_51_column_47(){
    return x === 100;
}

function  $script_line_37_column_24(){
    x = x + 1;
}

function  $expression_line_36_column_52(){
    return x < 100;
}

function  $script_line_45_column_24(){
    x = x + 1;
}

function  $expression_line_44_column_52(){
    return x < 100;
}

function  $expression_line_60_column_47(){
    return x === 200;
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
            "id": "A",
            "states": [
                {
                    "id": "b",
                    "transitions": [
                        {
                            "target": "c",
                            "cond": $expression_line_36_column_52,
                            "onTransition": $script_line_37_column_24
                        }
                    ]
                },
                {
                    "id": "c",
                    "transitions": [
                        {
                            "target": "b",
                            "cond": $expression_line_44_column_52,
                            "onTransition": $script_line_45_column_24
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "d",
                    "cond": $expression_line_51_column_47,
                    "onTransition": $script_line_52_column_20
                }
            ]
        },
        {
            "id": "d",
            "transitions": [
                {
                    "target": "e",
                    "cond": $expression_line_60_column_47
                },
                {
                    "target": "f"
                }
            ]
        },
        {
            "id": "e"
        },
        {
            "id": "f"
        }
    ]
};
