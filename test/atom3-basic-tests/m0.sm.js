//Generated on Thursday, February 21, 2013 18:44:34 by the SCION SCXML compiler





function $expr_line_8_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "exiting A";
}

function $log_line_8_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_8_column_45.apply(this, arguments));
}

function $expr_line_5_column_46(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "entering A";
}

function $log_line_5_column_46(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_5_column_46.apply(this, arguments));
}

function $expr_line_11_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "doing A->B transition";
}

function $log_line_11_column_60(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_11_column_60.apply(this, arguments));
}

module.exports = {
    "ns0": "http://www.w3.org/2005/07/scxml",
    "name": "root",
    "states": [
        {
            "id": "A",
            "onEntry": $log_line_5_column_46,
            "onExit": $log_line_8_column_45,
            "transitions": [
                {
                    "target": "B",
                    "event": "e1",
                    "onTransition": $log_line_11_column_60
                }
            ]
        },
        {
            "id": "B",
            "transitions": [
                {
                    "target": "A",
                    "event": "e2"
                }
            ]
        }
    ]
};
