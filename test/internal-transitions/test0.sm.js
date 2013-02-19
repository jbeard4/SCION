//Generated on Monday, February 18, 2013 23:37:27 by the SCION SCXML compiler

var x = $data_line_22_column_31();

function $log_line_26_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("x",$expr_line_26_column_31.apply(this, arguments));
}

function $expr_line_26_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x;
}

function $assign_line_35_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_35_column_45.apply(this, arguments);
}

function $expr_line_35_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_31_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_31_column_45.apply(this, arguments);
}

function $expr_line_31_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $cond_line_46_column_73(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 1;
}

function $cond_line_43_column_59(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 1;
}

function $cond_line_50_column_56(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 2;
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
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
                            "cond": $cond_line_43_column_59
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "a2",
                    "event": "t1",
                    "type": "internal",
                    "cond": $cond_line_46_column_73
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "target": "c",
                    "event": "t3",
                    "cond": $cond_line_50_column_56
                }
            ]
        },
        {
            "id": "c"
        }
    ]
};
