//Generated on Thursday, February 21, 2013 19:49:12 by the SCION SCXML compiler



var x;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        x = $data_line_22_column_31.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_30_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_30_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_30_column_47.apply(this, arguments);
}

function $expr_line_27_column_46(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x +1;
}

function $assign_line_27_column_46(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_27_column_46.apply(this, arguments);
}

function $cond_line_49_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 6;
}

function $expr_line_38_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_38_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_38_column_51.apply(this, arguments);
}

function $expr_line_35_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x + 1;
}

function $assign_line_35_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    x = $expr_line_35_column_51.apply(this, arguments);
}

function $cond_line_43_column_62(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 2;
}

function $cond_line_54_column_58(_event, In, _sessionId, _name, _ioprocessors, _x){
    return x === 8;
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 0;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "p",
            "type": "parallel",
            "onEntry": $assign_line_27_column_46,
            "onExit": $assign_line_30_column_47,
            "states": [
                {
                    "id": "a",
                    "onEntry": $assign_line_35_column_51,
                    "onExit": $assign_line_38_column_51,
                    "transitions": [
                        {
                            "target": "a",
                            "event": "t1",
                            "cond": $cond_line_43_column_62
                        }
                    ]
                },
                {
                    "id": "b"
                }
            ],
            "transitions": [
                {
                    "target": "c",
                    "event": "t2",
                    "cond": $cond_line_49_column_58
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "target": "d",
                    "event": "t3",
                    "cond": $cond_line_54_column_58
                }
            ]
        },
        {
            "id": "d"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};
