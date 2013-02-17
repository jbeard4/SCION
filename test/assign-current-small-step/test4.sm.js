var x;

function  $assign_line_27_column_43(){
    x = 2;
}

function  $assign_line_35_column_47(){
    x = x * 3;
}

function  $log_line_36_column_37(){
    console.log();
}

function  $expression_line_53_column_46(){
    return x === 30;
}

function  $assign_line_41_column_51(){
    x = x * 5;
}

function  $log_line_42_column_42(){
    console.log();
}

function  $assign_line_48_column_51(){
    x = x * 7;
}

function  $log_line_49_column_42(){
    console.log();
}

module.exports = {
    "states": [
        {
            "id": "a",
            "onEntry": $assign_line_27_column_43,
            "transitions": [
                {
                    "event": "t",
                    "target": "b1"
                }
            ]
        },
        {
            "id": "b",
            "onEntry": [
                $assign_line_35_column_47,
                $log_line_36_column_37
            ],
            "states": [
                {
                    "id": "b1",
                    "onEntry": [
                        $assign_line_41_column_51,
                        $log_line_42_column_42
                    ]
                },
                {
                    "id": "b2",
                    "onEntry": [
                        $assign_line_48_column_51,
                        $log_line_49_column_42
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "c",
                    "cond": $expression_line_53_column_46
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
