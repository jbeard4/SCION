//Generated on Tuesday, February 19, 2013 15:48:59 by the SCION SCXML compiler

var foo = $data_line_22_column_33(), bar = $data_line_23_column_33(), bat = $data_line_24_column_33();

function $send_line_29_column_73(_event, In, _sessionId, _name, _ioprocessors, _x){
    var _scionTargetRef = null;
    if(_scionTargetRef === '#_internal'){
         this.raise(
         {
            target: _scionTargetRef,
            name: $eventexpr_line_29_column_53.apply(this, arguments),
            type: "send",
            data: 
                {
                    "foo":foo,
                    "bar":bar,
                    "bif":$location_line_30_column_48.apply(this, arguments),
                    "belt":$expr_line_31_column_43.apply(this, arguments)
                },
            origin: _sessionId
         });
    }else{
         this.send(
         {
            target: _scionTargetRef,
            name: $eventexpr_line_29_column_53.apply(this, arguments),
            type: "send",
            data: 
                {
                    "foo":foo,
                    "bar":bar,
                    "bif":$location_line_30_column_48.apply(this, arguments),
                    "belt":$expr_line_31_column_43.apply(this, arguments)
                },
            origin: _sessionId
         }, 
           {
               delay: $delayexpr_line_29_column_36.apply(this, arguments),
               sendId: null
           });
    }
}

function $eventexpr_line_29_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 's1';
}

function $location_line_30_column_48(_event, In, _sessionId, _name, _ioprocessors, _x){
    return bat;
}

function $expr_line_31_column_43(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 4;
}

function $delayexpr_line_29_column_36(_event, In, _sessionId, _name, _ioprocessors, _x){
    return '10ms';
}

function $send_line_43_column_54(_event, In, _sessionId, _name, _ioprocessors, _x){
    var _scionTargetRef = null;
    if(_scionTargetRef === '#_internal'){
         this.raise(
         {
            target: _scionTargetRef,
            name: $eventexpr_line_43_column_53.apply(this, arguments),
            type: "send",
            data: 
                "More content.",
            origin: _sessionId
         });
    }else{
         this.send(
         {
            target: _scionTargetRef,
            name: $eventexpr_line_43_column_53.apply(this, arguments),
            type: "send",
            data: 
                "More content.",
            origin: _sessionId
         }, 
           {
               delay: $delayexpr_line_43_column_36.apply(this, arguments),
               sendId: null
           });
    }
}

function $eventexpr_line_43_column_53(_event, In, _sessionId, _name, _ioprocessors, _x){
    return 's2';
}

function $delayexpr_line_43_column_36(_event, In, _sessionId, _name, _ioprocessors, _x){
    return '10ms';
}

function $cond_line_41_column_39(_event, In, _sessionId, _name, _ioprocessors, _x){
    return _event.data.foo === 1 && 
                    _event.data.bar === 2 && 
                    _event.data.bif === 3 &&
                    _event.data.belt === 4;
}

function $cond_line_55_column_50(_event, In, _sessionId, _name, _ioprocessors, _x){
    return _event.data === 'More content.';
}

function $log_line_58_column_47(_event, In, _sessionId, _name, _ioprocessors, _x){
    console.log("_event",$expr_line_58_column_45.apply(this, arguments));
}

function $expr_line_58_column_45(_event, In, _sessionId, _name, _ioprocessors, _x){
    return _event;
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
                    "cond": $cond_line_41_column_39,
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
                    "cond": $cond_line_55_column_50
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
