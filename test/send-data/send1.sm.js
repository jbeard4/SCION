//Generated on Thursday, February 21, 2013 18:44:39 by the SCION SCXML compiler

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

var foo = $data_line_22_column_33(), bar = $data_line_23_column_33(), bat = $data_line_24_column_33();

function $eventexpr_line_29_column_73(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 's1';
}

function $location_line_30_column_50(_event, In, _sessionId, _name, _ioprocessors, _x){
    return bat;
}

function $expr_line_31_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 4;
}

function $delayexpr_line_29_column_73(_event, In, _sessionId, _name, _ioprocessors, _x){
    return '10ms';
}

function $send_line_29_column_73(_event, In, _sessionId, _name, _ioprocessors, _x){
    var _scionTargetRef = null;
    if(_scionTargetRef === '#_internal'){
         this.raise(
         {
            target: _scionTargetRef,
            name: $eventexpr_line_29_column_73.apply(this, arguments),
            type: "send",
            data: 
                {
                    "foo":foo,
                    "bar":bar,
                    "bif":$location_line_30_column_50.apply(this, arguments),
                    "belt":$expr_line_31_column_45.apply(this, arguments)
                },
            origin: _sessionId
         });
    }else{
         this.send(
         {
            target: _scionTargetRef,
            name: $eventexpr_line_29_column_73.apply(this, arguments),
            type: "send",
            data: 
                {
                    "foo":foo,
                    "bar":bar,
                    "bif":$location_line_30_column_50.apply(this, arguments),
                    "belt":$expr_line_31_column_45.apply(this, arguments)
                },
            origin: _sessionId
         }, 
           {
               delay: getDelayInMs($delayexpr_line_29_column_73.apply(this, arguments)),
               sendId: null
           });
    }
}

function $eventexpr_line_43_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 's2';
}

function $delayexpr_line_43_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    return '10ms';
}

function $send_line_43_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    var _scionTargetRef = null;
    if(_scionTargetRef === '#_internal'){
         this.raise(
         {
            target: _scionTargetRef,
            name: $eventexpr_line_43_column_54.apply(this, arguments),
            type: "send",
            data: 
                "More content.",
            origin: _sessionId
         });
    }else{
         this.send(
         {
            target: _scionTargetRef,
            name: $eventexpr_line_43_column_54.apply(this, arguments),
            type: "send",
            data: 
                "More content.",
            origin: _sessionId
         }, 
           {
               delay: getDelayInMs($delayexpr_line_43_column_54.apply(this, arguments)),
               sendId: null
           });
    }
}

function $cond_line_41_column_40(_event, In, _sessionId, _name, _ioprocessors, _x){
    return _event.data.foo === 1 && 
                    _event.data.bar === 2 && 
                    _event.data.bif === 3 &&
                    _event.data.belt === 4;
}

function $cond_line_55_column_52(_event, In, _sessionId, _name, _ioprocessors, _x){
    return _event.data === 'More content.';
}

function $expr_line_58_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    return _event;
}

function $log_line_58_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("_event",$expr_line_58_column_47.apply(this, arguments));
}

function $data_line_22_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 1;
}

function $data_line_23_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 2;
}

function $data_line_24_column_33(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 3;
}

module.exports = {
    "": "http://www.w3.org/2005/07/scxml",
    "states": [
        {
            "id": "a",
            "transitions": [
                {
                    "target": "b",
                    "event": "t",
                    "onTransition": $send_line_29_column_73
                }
            ]
        },
        {
            "id": "b",
            "transitions": [
                {
                    "event": "s1",
                    "target": "c",
                    "cond": $cond_line_41_column_40,
                    "onTransition": $send_line_43_column_54
                },
                {
                    "event": "s1",
                    "target": "f"
                }
            ]
        },
        {
            "id": "c",
            "transitions": [
                {
                    "event": "s2",
                    "target": "d",
                    "cond": $cond_line_55_column_52
                },
                {
                    "event": "s2",
                    "target": "f",
                    "onTransition": $log_line_58_column_47
                }
            ]
        },
        {
            "id": "d",
            "transitions": [
                {
                    "event": "t2",
                    "target": "e"
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
