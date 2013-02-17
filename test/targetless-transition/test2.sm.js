var i = 1;

function  $assign_line_27_column_47(){
    i = i * 2;
}

function  $assign_line_30_column_55(){
    i = Math.pow(i,3);
}

function  $expression_line_39_column_49(){
    return i === 27;
}

function  $assign_line_35_column_51(){
    i = i + 2;
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
                    "event": "bar",
                    "onTransition": $assign_line_30_column_55
                },
                {
                    "target": "done",
                    "cond": $expression_line_39_column_49
                }
            ],
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "foo",
                            "onTransition": $assign_line_35_column_51
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
