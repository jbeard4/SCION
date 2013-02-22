//Generated on Thursday, February 21, 2013 19:49:11 by the SCION SCXML compiler







function $expr_line_8_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "exiting state A";
}

function $log_line_8_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_8_column_51.apply(this, arguments));
}

function $expr_line_5_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "entering state A";
}

function $log_line_5_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_5_column_52.apply(this, arguments));
}

function $expr_line_11_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "triggered by e1";
}

function $log_line_11_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_11_column_51.apply(this, arguments));
}

function $expr_line_16_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "triggered by e2";
}

function $log_line_16_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_16_column_51.apply(this, arguments));
}

module.exports = {
    "ns0": "http://www.w3.org/2005/07/scxml",
    "name": "root",
    "states": [
        {
            "id": "A",
            "onEntry": $log_line_5_column_52,
            "onExit": $log_line_8_column_51,
            "transitions": [
                {
                    "target": "B",
                    "event": "e1",
                    "onTransition": $log_line_11_column_51
                }
            ]
        },
        {
            "id": "B",
            "transitions": [
                {
                    "target": "A",
                    "event": "e2",
                    "onTransition": $log_line_16_column_51
                }
            ]
        }
    ]
};
