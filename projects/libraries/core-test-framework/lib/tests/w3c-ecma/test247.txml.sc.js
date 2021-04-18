//Generated on 2018-10-16 14:28:57 by the SCION SCXML compiler
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

    function $invoke_l8_c6(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l8_c6.id,
            "constructorFunction": $invoke_l8_c6Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test247.txml.scxml"
        });
    };
    $invoke_l8_c6.tagname = 'invoke';
    $invoke_l8_c6.line = 8;
    $invoke_l8_c6.column = 6;

    $invoke_l8_c6.autoforward = false;

    $invoke_l8_c6.id = "s0.invokeid_0";

    function $senddata_l5_c5(_event) {
        return {}
    };
    $senddata_l5_c5.tagname = 'send';
    $senddata_l5_c5.line = 5;
    $senddata_l5_c5.column = 5;

    function $send_l5_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l5_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("2s"),
        });
    };
    $send_l5_c5.tagname = 'send';
    $send_l5_c5.line = 5;
    $send_l5_c5.column = 5;

    function $expr_l19_c53(_event) {
        return 'pass'
    };
    $expr_l19_c53.tagname = 'undefined';
    $expr_l19_c53.line = 19;
    $expr_l19_c53.column = 53;

    function $log_l19_c27(_event) {
        this.log("Outcome", $expr_l19_c53.apply(this, arguments));
    };
    $log_l19_c27.tagname = 'log';
    $log_l19_c27.line = 19;
    $log_l19_c27.column = 27;

    function $expr_l20_c53(_event) {
        return 'fail'
    };
    $expr_l20_c53.tagname = 'undefined';
    $expr_l20_c53.line = 20;
    $expr_l20_c53.column = 53;

    function $log_l20_c27(_event) {
        this.log("Outcome", $expr_l20_c53.apply(this, arguments));
    };
    $log_l20_c27.tagname = 'log';
    $log_l20_c27.line = 20;
    $log_l20_c27.column = 27;
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
                    $send_l5_c5
                ],
                "invokes": $invoke_l8_c6,
                "transitions": [{
                        "event": "done.invoke",
                        "target": "pass",
                        "$closeLine": 15,
                        "$closeColumn": 51
                    },
                    {
                        "event": "timeout",
                        "target": "fail",
                        "$closeLine": 16,
                        "$closeColumn": 47
                    }
                ],
                "$closeLine": 17,
                "$closeColumn": 5
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l19_c27
                ],
                "$closeLine": 19,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l20_c27
                ],
                "$closeLine": 20,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 21,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test247.txml.scxml"
    };
}

function $invoke_l8_c6Constructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';

    function $deserializeDatamodel($serializedDatamodel) {

    }

    function $serializeDatamodel() {
        return {

        };
    }
    return {
        "version": "1.0",
        "initial": "subFinal",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
            "id": "subFinal",
            "$type": "final",
            "$closeLine": 11,
            "$closeColumn": 32
        }],
        "$closeLine": 12,
        "$closeColumn": 13,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test247.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjQ3LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0s7QUFBQSxDQUFnQztBQUFBOzs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBZ0M7QUFBQTs7Ozs7QUFjZ0IsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFDUixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBIn0=