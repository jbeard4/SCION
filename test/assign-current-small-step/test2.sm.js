var i;

function  $assign_line_30_column_43(){
    i = 0;
}

function  $assign_line_49_column_47(){
    i = i * 2;
}

function  $expression_line_48_column_47(){
    return i === 100;
}

function  $assign_line_38_column_51(){
    i = i + 1;
}

function  $expression_line_37_column_52(){
    return i < 100;
}

function  $assign_line_44_column_51(){
    i = i + 1;
}

function  $expression_line_43_column_52(){
    return i < 100;
}

function  $expression_line_55_column_47(){
    return i === 200;
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
            "id": "A",
            "states": [
                {
                    "id": "b",
                    "transitions": [
                        {
                            "target": "c",
                            "cond": $expression_line_37_column_52,
                            "onTransition": $assign_line_38_column_51
                        }
                    ]
                },
                {
                    "id": "c",
                    "transitions": [
                        {
                            "target": "b",
                            "cond": $expression_line_43_column_52,
                            "onTransition": $assign_line_44_column_51
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "d",
                    "cond": $expression_line_48_column_47,
                    "onTransition": $assign_line_49_column_47
                }
            ]
        },
        {
            "id": "d",
            "transitions": [
                {
                    "target": "e",
                    "cond": $expression_line_55_column_47
                },
                {
                    "target": "f"
                }
            ]
        },
        {
            "id": "e"
        },
        {
            "id": "f"
        }
    ]
};
