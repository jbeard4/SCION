var x = 2;

function $assign_line_32_column_47(){
    x = x * 3;
}

function $log_line_33_column_37(){
    console.log();
}

function $expression_line_60_column_65(){
    return x === 4410;
}

function $expression_line_62_column_69(){
    return x === 1470;
}

function $assign_line_44_column_51(){
    x = x * 5;
}

function $log_line_45_column_42(){
    console.log();
}

function $assign_line_52_column_51(){
    x = x * 7;
}

function $log_line_53_column_42(){
    console.log();
}

module.exports = {
    "initial": "a",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "h",
                    "event": "t1"
                }
            ]
        },
        {
            "id": "b",
            "initial": "b1",
            "onEntry": [
                $assign_line_32_column_47,
                $log_line_33_column_37
            ],
            "states": [
                {
                    "id": "h",
                    "type": "history",
                    "transitions": [
                        {
                            "target": "b2"
                        }
                    ]
                },
                {
                    "id": "b1"
                },
                {
                    "id": "b2",
                    "onEntry": [
                        $assign_line_44_column_51,
                        $log_line_45_column_42
                    ],
                    "transitions": [
                        {
                            "event": "t2",
                            "target": "b3"
                        }
                    ]
                },
                {
                    "id": "b3",
                    "onEntry": [
                        $assign_line_52_column_51,
                        $log_line_53_column_42
                    ],
                    "transitions": [
                        {
                            "event": "t3",
                            "target": "a"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t4",
                    "target": "success",
                    "cond": $expression_line_60_column_65
                },
                {
                    "event": "t4",
                    "target": "really-fail",
                    "cond": $expression_line_62_column_69
                },
                {
                    "event": "t4",
                    "target": "fail"
                }
            ]
        },
        {
            "id": "success"
        },
        {
            "id": "fail"
        },
        {
            "id": "really-fail"
        }
    ]
};
