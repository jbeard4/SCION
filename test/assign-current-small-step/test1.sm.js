var i;

function  $assign_line_30_column_43(){
    i = 0;
}

function  $assign_line_36_column_47(){
    i = i + 1;
}

function  $expression_line_35_column_48(){
    return i < 100;
}

function  $expression_line_38_column_47(){
    return i === 100;
}

module.exports = {
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $assign_line_30_column_43
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "b",
                    "cond": $expression_line_35_column_48,
                    "onTransition": $assign_line_36_column_47
                },
                {
                    "target": "c",
                    "cond": $expression_line_38_column_47
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};
