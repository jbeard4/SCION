//Generated on Thursday, February 21, 2013 19:56:29 by the SCION SCXML compiler



var i;

var $scion_early_binding_datamodel_has_fired = false;
function $initEarlyBindingDatamodel(_event, In, _sessionId, _name, _ioprocessors, _x){
    if(!$scion_early_binding_datamodel_has_fired){
        i = $data_line_22_column_31.apply(this, arguments);
        $scion_early_binding_datamodel_has_fired = true; 
    }
}

function $expr_line_27_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i * 2;
}

function $assign_line_27_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_27_column_47.apply(this, arguments);
}

function $expr_line_30_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    return Math.pow(i,3);
}

function $assign_line_30_column_55(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_30_column_55.apply(this, arguments);
}

function $cond_line_39_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i === 27;
}

function $expr_line_35_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return i + 2;
}

function $assign_line_35_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    i = $expr_line_35_column_51.apply(this, arguments);
}

function $data_line_22_column_31(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 1;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "A",
            "transitions": [
                {
                    "event": "foo",
                    "onTransition": $assign_line_27_column_47
                },
                {
                    "event": "bar",
                    "onTransition": $assign_line_30_column_55
                },
                {
                    "target": "done",
                    "cond": $cond_line_39_column_51
                }
            ],
            "states": [
                {
                    "id": "a",
                    "transitions": [
                        {
                            "event": "foo",
                            "onTransition": $assign_line_35_column_51
                        }
                    ]
                }
            ]
        },
        {
            "id": "done"
        }
    ],
    "onEntry": [
        $initEarlyBindingDatamodel
    ]
};
