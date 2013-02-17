var x;

function  $assign_line_28_column_44(){
    x = -1;
}

function  $assign_line_29_column_44(){
    x = 99;
}

function  $assign_line_34_column_47(){
    x = x + 1;
}

function  $expression_line_33_column_57(){
    return x === 99;
}

function  $script_line_41_column_20(){
    x *= 2;
}

function  $expression_line_46_column_47(){
    return x === 200;
}

module.exports = {
    "states": [
        {
            "id": "a",
            "onEntry": [
                $assign_line_28_column_44,
                $assign_line_29_column_44
            ],
            "transitions": [
                {
                    "event": "t",
                    "target": "b",
                    "cond": $expression_line_33_column_57,
                    "onTransition": $assign_line_34_column_47
                }
            ]
        },
        {
            "id": "b",
            "onEntry": $script_line_41_column_20,
            "transitions": [
                {
                    "target": "c",
                    "cond": $expression_line_46_column_47
                },
                {
                    "target": "f"
                }
            ]
        },
        {
            "id": "c"
        },
        {
            "id": "f"
        }
    ]
};
