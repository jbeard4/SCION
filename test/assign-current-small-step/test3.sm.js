var i;

function  $assign_line_30_column_43(){
    i = 0;
}

function  $expression_line_58_column_56(){
    return i === 0;
}

function  $assign_line_39_column_55(){
    i = i + 1;
}

function  $assign_line_50_column_55(){
    i = i - 1;
}

module.exports = {
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "p",
                    "event": "t1",
                    "onTransition": $assign_line_30_column_43
                }
            ]
        },
        {
            "id": "p",
            "type": "parallel",
            "states": [
                {
                    "id": "b",
                    "initial": "b1",
                    "states": [
                        {
                            "id": "b1",
                            "transitions": [
                                {
                                    "event": "t2",
                                    "target": "b2",
                                    "onTransition": $assign_line_39_column_55
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
                    "initial": "c1",
                    "states": [
                        {
                            "id": "c1",
                            "transitions": [
                                {
                                    "event": "t2",
                                    "target": "c2",
                                    "onTransition": $assign_line_50_column_55
                                }
                            ]
                        },
                        {
                            "id": "c2"
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "event": "t3",
                    "target": "d",
                    "cond": $expression_line_58_column_56
                },
                {
                    "event": "t3",
                    "target": "f"
                }
            ]
        },
        {
            "id": "d"
        },
        {
            "id": "f"
        }
    ]
};
