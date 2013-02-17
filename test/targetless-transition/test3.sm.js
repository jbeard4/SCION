var i = 1;

function  $expression_line_27_column_50(){
    return i === 100;
}

function  $assign_line_30_column_48(){
    i = i * 20;
}

function  $log_line_31_column_27(){
    console.log();
}

function  $assign_line_37_column_55(){
    i = i * 2;
}

function  $log_line_38_column_35(){
    console.log();
}

function  $assign_line_49_column_63(){
    i = Math.pow(i,3);
}

function  $log_line_50_column_35(){
    console.log();
}

function  $assign_line_60_column_51(){
    i = i - 3;
}

function  $log_line_61_column_31(){
    console.log();
}

module.exports = {
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "transitions": [
                {
                    "target": "done",
                    "cond": $expression_line_27_column_50
                },
                {
                    "event": "bar",
                    "onTransition": [
                        $assign_line_30_column_48,
                        $log_line_31_column_27
                    ]
                }
            ],
            "states": [
                {
                    "id": "a",
                    "states": [
                        {
                            "id": "a1",
                            "transitions": [
                                {
                                    "event": "foo",
                                    "target": "a2",
                                    "onTransition": [
                                        $assign_line_37_column_55,
                                        $log_line_38_column_35
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "a2"
                        }
                    ]
                },
                {
                    "id": "b",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "foo",
                                    "target": "b2",
                                    "onTransition": [
                                        $assign_line_49_column_63,
                                        $log_line_50_column_35
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "b2"
                        }
                    ]
                },
                {
                    "id": "c",
                    "transitions": [
                        {
                            "event": "foo",
                            "onTransition": [
                                $assign_line_60_column_51,
                                $log_line_61_column_31
                            ]
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
