//Generated on Thursday, February 21, 2013 18:37:32 by the SCION SCXML compiler

function getDelayInMs(delayString){
    if (!delayString) {
        return 0;
    } else {
        if (delayString.slice(-2) === "ms") {
            return parseFloat(delayString.slice(0, -2));
        } else if (delayString.slice(-1) === "s") {
            return parseFloat(delayString.slice(0, -1)) * 1000;
        } else {
            return parseFloat(delayString);
        }
    }
}



function $log_line_12_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_12_column_53.apply(this, arguments));
}

function $expr_line_12_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "exiting state A";
}

function $log_line_9_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_9_column_54.apply(this, arguments));
}

function $expr_line_9_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "entering state A";
}

function $log_line_15_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_15_column_53.apply(this, arguments));
}

function $expr_line_15_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "triggered by e1";
}

function $log_line_20_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_20_column_53.apply(this, arguments));
}

function $expr_line_20_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "triggered by e2";
}

function $log_line_30_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_30_column_51.apply(this, arguments));
}

function $expr_line_30_column_51(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "exiting state C";
}

function $log_line_27_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log($expr_line_27_column_52.apply(this, arguments));
}

function $expr_line_27_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return "entering state C";
}

module.exports = {
    "ns0": "http://www.w3.org/2005/07/scxml",
    "name": "root",
    "states": [
        {
            "id": "AB",
            "states": [
                {
                    "type": "initial",
                    "transitions": [
                        {
                            "target": "A"
                        }
                    ]
                },
                {
                    "id": "A",
                    "onEntry": $log_line_9_column_54,
                    "onExit": $log_line_12_column_53,
                    "transitions": [
                        {
                            "target": "B",
                            "event": "e1",
                            "onTransition": $log_line_15_column_53
                        }
                    ]
                },
                {
                    "id": "B",
                    "transitions": [
                        {
                            "target": "A",
                            "event": "e2",
                            "onTransition": $log_line_20_column_53
                        }
                    ]
                }
            ],
            "transitions": [
                {
                    "target": "C",
                    "event": "e1"
                }
            ]
        },
        {
            "id": "C",
            "onEntry": $log_line_27_column_52,
            "onExit": $log_line_30_column_51
        }
    ]
};
