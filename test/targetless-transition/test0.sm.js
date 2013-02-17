var i = 0;

function  $expression_line_30_column_50(){
    return i === 100;
}

function  $assign_line_32_column_47(){
    i = i + 1;
}

module.exports = {
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t"
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "done",
                    "cond": $expression_line_30_column_50
                },
                {
                    "onTransition": $assign_line_32_column_47
                }
            ]
        },
        {
            "id": "done"
        }
    ]
};
