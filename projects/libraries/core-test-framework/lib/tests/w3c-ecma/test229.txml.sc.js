//Generated on 2018-10-16 14:28:45 by the SCION SCXML compiler
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

    function $invoke_l11_c3(_event) {
        this.invoke({
            "autoforward": true,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l11_c3.id,
            "constructorFunction": $invoke_l11_c3Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test229.txml.scxml"
        });
    };
    $invoke_l11_c3.tagname = 'invoke';
    $invoke_l11_c3.line = 11;
    $invoke_l11_c3.column = 3;

    $invoke_l11_c3.autoforward = true;

    $invoke_l11_c3.id = "s0.invokeid_0";

    function $senddata_l8_c5(_event) {
        return {}
    };
    $senddata_l8_c5.tagname = 'send';
    $senddata_l8_c5.line = 8;
    $senddata_l8_c5.column = 5;

    function $send_l8_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l8_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("3s"),
        });
    };
    $send_l8_c5.tagname = 'send';
    $send_l8_c5.line = 8;
    $send_l8_c5.column = 5;

    function $expr_l38_c53(_event) {
        return 'pass'
    };
    $expr_l38_c53.tagname = 'undefined';
    $expr_l38_c53.line = 38;
    $expr_l38_c53.column = 53;

    function $log_l38_c27(_event) {
        this.log("Outcome", $expr_l38_c53.apply(this, arguments));
    };
    $log_l38_c27.tagname = 'log';
    $log_l38_c27.line = 38;
    $log_l38_c27.column = 27;

    function $expr_l39_c53(_event) {
        return 'fail'
    };
    $expr_l39_c53.tagname = 'undefined';
    $expr_l39_c53.line = 39;
    $expr_l39_c53.column = 53;

    function $log_l39_c27(_event) {
        this.log("Outcome", $expr_l39_c53.apply(this, arguments));
    };
    $log_l39_c27.tagname = 'log';
    $log_l39_c27.line = 39;
    $log_l39_c27.column = 27;
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
                    $send_l8_c5
                ],
                "invokes": $invoke_l11_c3,
                "transitions": [{
                        "event": "childToParent",
                        "$closeLine": 33,
                        "$closeColumn": 36
                    },
                    {
                        "event": "eventReceived",
                        "target": "pass",
                        "$closeLine": 34,
                        "$closeColumn": 50
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 35,
                        "$closeColumn": 38
                    }
                ],
                "$closeLine": 36,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l38_c27
                ],
                "$closeLine": 38,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l39_c27
                ],
                "$closeLine": 39,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 41,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test229.txml.scxml"
    };
}

function $invoke_l11_c3Constructor(_x, _sessionid, _ioprocessors, In) {
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

    function $senddata_l20_c14(_event) {
        return {}
    };
    $senddata_l20_c14.tagname = 'send';
    $senddata_l20_c14.line = 20;
    $senddata_l20_c14.column = 14;

    function $send_l20_c14(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childToParent",
            data: $senddata_l20_c14.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l20_c14.tagname = 'send';
    $send_l20_c14.line = 20;
    $send_l20_c14.column = 14;

    function $senddata_l21_c15(_event) {
        return {}
    };
    $senddata_l21_c15.tagname = 'send';
    $senddata_l21_c15.line = 21;
    $senddata_l21_c15.column = 15;

    function $send_l21_c15(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l21_c15.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("3s"),
        });
    };
    $send_l21_c15.tagname = 'send';
    $send_l21_c15.line = 21;
    $send_l21_c15.column = 15;

    function $senddata_l24_c10(_event) {
        return {}
    };
    $senddata_l24_c10.tagname = 'send';
    $senddata_l24_c10.line = 24;
    $senddata_l24_c10.column = 10;

    function $send_l24_c10(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "eventReceived",
            data: $senddata_l24_c10.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l24_c10.tagname = 'send';
    $send_l24_c10.line = 24;
    $send_l24_c10.column = 10;
    return {
        "initial": "sub0",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
                "id": "sub0",
                "$type": "state",
                "onEntry": [
                    $send_l20_c14,
                    $send_l21_c15
                ],
                "transitions": [{
                        "event": "childToParent",
                        "target": "subFinal",
                        "$closeLine": 25,
                        "$closeColumn": 12,
                        "onTransition": $send_l24_c10
                    },
                    {
                        "event": "*",
                        "target": "subFinal",
                        "$closeLine": 26,
                        "$closeColumn": 51
                    }
                ],
                "$closeLine": 27,
                "$closeColumn": 9
            },
            {
                "id": "subFinal",
                "$type": "final",
                "$closeLine": 28,
                "$closeColumn": 29
            }
        ],
        "$closeLine": 29,
        "$closeColumn": 10,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test229.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjI5LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUs7QUFBQSxDQUFnQztBQUFBOzs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBZ0M7QUFBQTs7Ozs7QUE4QmdCLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7O0FBQ1IsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW5CL0M7QUFBQSxDQUE2QztBQUFBOzs7OztBQUE3QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBNkM7QUFBQTs7Ozs7QUFDNUM7QUFBQSxDQUFnQztBQUFBOzs7OztBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBZ0M7QUFBQTs7Ozs7QUFHckM7QUFBQSxDQUE2QztBQUFBOzs7OztBQUE3QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBNkM7QUFBQSJ9