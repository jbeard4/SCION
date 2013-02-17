var x = 0;

function  $log_line_26_column_33(){
    console.log("x",x);
}

function  $assign_line_35_column_47(){
    x = x + 1;
}

function  $assign_line_31_column_47(){
    x = x + 1;
}

function  $expression_line_46_column_73(){
    return x === 1;
}

function  $expression_line_43_column_59(){
    return x === 1;
}

function  $expression_line_50_column_56(){
    return x === 2;
}

module.exports = {
    "transitions": [
        {
            "event": "*",
            "onTransition": $log_line_26_column_33
        }
    ],
    "states": [
        {
            "id": "a",
            "onEntry": $assign_line_31_column_47,
            "onExit": $assign_line_35_column_47,
            "states": [
                {
                    "id": "a1"
                },
                {
                    "id": "a2",
                    "transitions": [
                        {
                            "target": "b",
                            "event": "t2",
                            "cond": $expression_line_43_column_59
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "a2",
                    "event": "t1",
                    "type": "internal",
                    "cond": $expression_line_46_column_73
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "t3",
                    "cond": $expression_line_50_column_56
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};
