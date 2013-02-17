var i = 1;

function  $assign_line_27_column_47(){
    i = i * 2;
}

function  $expression_line_36_column_48(){
    return i === 8;
}

function  $assign_line_32_column_59(){
    i = Math.pow(i,3);
}

module.exports = {
    "states": [
        {
            "id": "A",
            "transitions": [
                {
                    "event": "foo",
                    "onTransition": $assign_line_27_column_47
                },
                {
                    "target": "done",
                    "cond": $expression_line_36_column_48
                }
            ],
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "bar",
                            "onTransition": $assign_line_32_column_59
                        }
                    ]
                }
            ]
        },
        {
            "id": "done"
        }
    ]
};
