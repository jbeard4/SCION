

function  $expression_line_22_column_53(){
    return false;
}

function  $expression_line_23_column_52(){
    return true;
}

module.exports = {
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "f",
                    "event": "t",
                    "cond": $expression_line_22_column_53
                },
                {
                    "target": "b",
                    "event": "t",
                    "cond": $expression_line_23_column_52
                }
            ]
        },
        {
            "id": "b"
        },
        {
            "id": "f"
        }
    ]
};
