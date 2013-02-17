var x = 0;

function  $assign_line_31_column_47(){
    x = x + 1;
}

function  $assign_line_27_column_47(){
    x = x + 1;
}

function  $assign_line_40_column_51(){
    x = x + 1;
}

function  $assign_line_36_column_51(){
    x = x + 1;
}

function  $expression_line_67_column_77(){
    return x === 3;
}

function  $assign_line_49_column_55(){
    x = x + 1;
}

function  $assign_line_45_column_55(){
    x = x + 1;
}

function  $assign_line_59_column_55(){
    x = x + 1;
}

function  $assign_line_55_column_55(){
    x = x + 1;
}

function  $expression_line_63_column_64(){
    return x === 5;
}

function  $expression_line_82_column_56(){
    return x === 8;
}

module.exports = {
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "onEntry": $assign_line_27_column_47,
            "onExit": $assign_line_31_column_47,
            "states": [
                {
                    "id": "a",
                    "onEntry": $assign_line_36_column_51,
                    "onExit": $assign_line_40_column_51,
                    "states": [
                        {
                            "id": "a1",
                            "onEntry": $assign_line_45_column_55,
                            "onExit": $assign_line_49_column_55
                        },
                        {
                            "id": "a2",
                            "onEntry": $assign_line_55_column_55,
                            "onExit": $assign_line_59_column_55,
                            "transitions": [
                                {
                                    "target": "c",
                                    "event": "t2",
                                    "cond": $expression_line_63_column_64
                                }
                            ]
                        }
                    ],
                    "transitions": [
                        {
                            "target": "a2",
                            "event": "t1",
                            "type": "internal",
                            "cond": $expression_line_67_column_77
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1"
                        },
                        {
                            "id": "b2"
                        }
                    ]
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d",
                    "event": "t3",
                    "cond": $expression_line_82_column_56
                }
            ]
        },
        {
            "id": "d"
        }
    ]
};
