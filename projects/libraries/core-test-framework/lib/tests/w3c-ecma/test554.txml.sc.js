//Generated on 2018-10-16 14:29:05 by the SCION SCXML compiler
function rootConstructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';

    function getDelayInMs(delayString) {
        if (typeof delayString === 'string') {
            if (delayString.slice(-2) === "ms") {
                return parseFloat(delayString.slice(0, -2));
            } else if (delayString.slice(-1) === "s") {
                return parseFloat(delayString.slice(0, -1)) * 1000;
            } else if (delayString.slice(-1) === "m") {
                return parseFloat(delayString.slice(0, -1)) * 1000 * 60;
            } else {
                return parseFloat(delayString);
            }
        } else if (typeof delayString === 'number') {
            return delayString;
        } else {
            return 0;
        }
    }

    function $deserializeDatamodel($serializedDatamodel) {

    }

    function $serializeDatamodel() {
        return {

        };
    }

    function $senddata_l11_c4(_event) {
        return {
            "foo": foo
        }
    };
    $senddata_l11_c4.tagname = 'invoke';
    $senddata_l11_c4.line = 11;
    $senddata_l11_c4.column = 4;

    function $invoke_l11_c4(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l11_c4.id,
            "constructorFunction": $invoke_l11_c4Constructor,

            "params": $senddata_l11_c4.apply(this, arguments),
            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test554.txml.scxml"
        });
    };
    $invoke_l11_c4.tagname = 'invoke';
    $invoke_l11_c4.line = 11;
    $invoke_l11_c4.column = 4;

    $invoke_l11_c4.autoforward = false;

    $invoke_l11_c4.id = "s0.invokeid_0";

    function $senddata_l7_c5(_event) {
        return {}
    };
    $senddata_l7_c5.tagname = 'send';
    $senddata_l7_c5.line = 7;
    $senddata_l7_c5.column = 5;

    function $delayexpr_l7_c35(_event) {
        return '1s'
    };
    $delayexpr_l7_c35.tagname = 'undefined';
    $delayexpr_l7_c35.line = 7;
    $delayexpr_l7_c35.column = 35;

    function $send_l7_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timer",
            data: $senddata_l7_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs($delayexpr_l7_c35.apply(this, arguments)),
        });
    };
    $send_l7_c5.tagname = 'send';
    $send_l7_c5.line = 7;
    $send_l7_c5.column = 5;

    function $expr_l22_c53(_event) {
        return 'pass'
    };
    $expr_l22_c53.tagname = 'undefined';
    $expr_l22_c53.line = 22;
    $expr_l22_c53.column = 53;

    function $log_l22_c27(_event) {
        this.log("Outcome", $expr_l22_c53.apply(this, arguments));
    };
    $log_l22_c27.tagname = 'log';
    $log_l22_c27.line = 22;
    $log_l22_c27.column = 27;

    function $expr_l23_c53(_event) {
        return 'fail'
    };
    $expr_l23_c53.tagname = 'undefined';
    $expr_l23_c53.line = 23;
    $expr_l23_c53.column = 53;

    function $log_l23_c27(_event) {
        this.log("Outcome", $expr_l23_c53.apply(this, arguments));
    };
    $log_l23_c27.tagname = 'log';
    $log_l23_c27.line = 23;
    $log_l23_c27.column = 27;
    return {
        "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
        "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
        "initial": "s0",
        "$type": "scxml",
        "id": "$generated-scxml-0",
        "states": [{
                "id": "s0",
                "$type": "state",
                "onEntry": [
                    $send_l7_c5
                ],
                "invokes": $invoke_l11_c4,
                "transitions": [{
                        "event": "timer",
                        "target": "pass",
                        "$closeLine": 18,
                        "$closeColumn": 45
                    },
                    {
                        "event": "done.invoke",
                        "target": "fail",
                        "$closeLine": 19,
                        "$closeColumn": 51
                    }
                ],
                "$closeLine": 20,
                "$closeColumn": 5
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l22_c27
                ],
                "$closeLine": 22,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l23_c27
                ],
                "$closeLine": 23,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 24,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test554.txml.scxml"
    };
}

function $invoke_l11_c4Constructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';

    function $deserializeDatamodel($serializedDatamodel) {

    }

    function $serializeDatamodel() {
        return {

        };
    }
    return {
        "initial": "subFinal",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
            "id": "subFinal",
            "$type": "final",
            "$closeLine": 14,
            "$closeColumn": 34
        }],
        "$closeLine": 15,
        "$closeColumn": 14,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test554.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0NTU0LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXSTtBQUFBLFVBTVU7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVlQ7QUFBQSxDQUFvQztBQUFBOzs7OztBQUFOLFdBQUs7QUFBQTs7Ozs7QUFBbkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQW9DO0FBQUE7Ozs7O0FBZVksYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFDUixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBIn0=