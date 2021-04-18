//Generated on 2018-10-16 14:28:41 by the SCION SCXML compiler
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

    function $invoke_l6_c6(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l6_c6.id,
            "constructorFunction": $invoke_l6_c6Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test220.txml.scxml"
        });
    };
    $invoke_l6_c6.tagname = 'invoke';
    $invoke_l6_c6.line = 6;
    $invoke_l6_c6.column = 6;

    $invoke_l6_c6.autoforward = false;

    $invoke_l6_c6.id = "s0.invokeid_0";

    function $senddata_l4_c5(_event) {
        return {}
    };
    $senddata_l4_c5.tagname = 'send';
    $senddata_l4_c5.line = 4;
    $senddata_l4_c5.column = 5;

    function $send_l4_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l4_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("5s"),
        });
    };
    $send_l4_c5.tagname = 'send';
    $send_l4_c5.line = 4;
    $send_l4_c5.column = 5;

    function $expr_l17_c53(_event) {
        return 'pass'
    };
    $expr_l17_c53.tagname = 'undefined';
    $expr_l17_c53.line = 17;
    $expr_l17_c53.column = 53;

    function $log_l17_c27(_event) {
        this.log("Outcome", $expr_l17_c53.apply(this, arguments));
    };
    $log_l17_c27.tagname = 'log';
    $log_l17_c27.line = 17;
    $log_l17_c27.column = 27;

    function $expr_l18_c53(_event) {
        return 'fail'
    };
    $expr_l18_c53.tagname = 'undefined';
    $expr_l18_c53.line = 18;
    $expr_l18_c53.column = 53;

    function $log_l18_c27(_event) {
        this.log("Outcome", $expr_l18_c53.apply(this, arguments));
    };
    $log_l18_c27.tagname = 'log';
    $log_l18_c27.line = 18;
    $log_l18_c27.column = 27;
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
                    $send_l4_c5
                ],
                "invokes": $invoke_l6_c6,
                "transitions": [{
                        "event": "done.invoke",
                        "target": "pass",
                        "$closeLine": 13,
                        "$closeColumn": 48
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 14,
                        "$closeColumn": 38
                    }
                ],
                "$closeLine": 15,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l17_c27
                ],
                "$closeLine": 17,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l18_c27
                ],
                "$closeLine": 18,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 20,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test220.txml.scxml"
    };
}

function $invoke_l6_c6Constructor(_x, _sessionid, _ioprocessors, In) {
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
            "$closeLine": 10,
            "$closeColumn": 32
        }],
        "$closeLine": 11,
        "$closeColumn": 12,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test220.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjIwLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUs7QUFBQSxDQUFnQztBQUFBOzs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBZ0M7QUFBQTs7Ozs7QUFhZ0IsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFDUixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBIn0=