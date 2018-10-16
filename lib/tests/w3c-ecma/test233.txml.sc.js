//Generated on 2018-10-16 14:28:48 by the SCION SCXML compiler
function rootConstructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';
    var Var1;

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
        Var1 = $serializedDatamodel["Var1"];
    }

    function $serializeDatamodel() {
        return {
            "Var1": Var1
        };
    }

    function $expr_l24_c36(_event) {
        return _event.data.aParam
    };
    $expr_l24_c36.tagname = 'undefined';
    $expr_l24_c36.line = 24;
    $expr_l24_c36.column = 36;

    function $assign_l24_c7(_event) {
        Var1 = $expr_l24_c36.apply(this, arguments);
    };
    $assign_l24_c7.tagname = 'assign';
    $assign_l24_c7.line = 24;
    $assign_l24_c7.column = 7;

    function $invoke_l11_c3(_event) {
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l11_c3.id,
            "constructorFunction": $invoke_l11_c3Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test233.txml.scxml"
        });
    };
    $invoke_l11_c3.tagname = 'invoke';
    $invoke_l11_c3.line = 11;
    $invoke_l11_c3.column = 3;

    $invoke_l11_c3.autoforward = false;

    $invoke_l11_c3.id = "s0.invokeid_0";

    $invoke_l11_c3.finalize = $assign_l24_c7;

    function $senddata_l9_c5(_event) {
        return {}
    };
    $senddata_l9_c5.tagname = 'send';
    $senddata_l9_c5.line = 9;
    $senddata_l9_c5.column = 5;

    function $send_l9_c5(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "timeout",
            data: $senddata_l9_c5.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs("3s"),
        });
    };
    $send_l9_c5.tagname = 'send';
    $send_l9_c5.line = 9;
    $send_l9_c5.column = 5;

    function $cond_l28_c42(_event) {
        return Var1 == 2
    };
    $cond_l28_c42.tagname = 'undefined';
    $cond_l28_c42.line = 28;
    $cond_l28_c42.column = 42;

    function $expr_l32_c53(_event) {
        return 'pass'
    };
    $expr_l32_c53.tagname = 'undefined';
    $expr_l32_c53.line = 32;
    $expr_l32_c53.column = 53;

    function $log_l32_c27(_event) {
        this.log("Outcome", $expr_l32_c53.apply(this, arguments));
    };
    $log_l32_c27.tagname = 'log';
    $log_l32_c27.line = 32;
    $log_l32_c27.column = 27;

    function $expr_l33_c53(_event) {
        return 'fail'
    };
    $expr_l33_c53.tagname = 'undefined';
    $expr_l33_c53.line = 33;
    $expr_l33_c53.column = 53;

    function $log_l33_c27(_event) {
        this.log("Outcome", $expr_l33_c53.apply(this, arguments));
    };
    $log_l33_c27.tagname = 'log';
    $log_l33_c27.line = 33;
    $log_l33_c27.column = 27;

    function $data_l4_c24(_event) {
        return 1
    };
    $data_l4_c24.tagname = 'undefined';
    $data_l4_c24.line = 4;
    $data_l4_c24.column = 24;

    function $datamodel_l3_c1(_event) {
        if (typeof Var1 === "undefined") Var1 = $data_l4_c24.apply(this, arguments);
    };
    $datamodel_l3_c1.tagname = 'datamodel';
    $datamodel_l3_c1.line = 3;
    $datamodel_l3_c1.column = 1;
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
                    $send_l9_c5
                ],
                "invokes": $invoke_l11_c3,
                "transitions": [{
                        "event": "childToParent",
                        "cond": $cond_l28_c42,
                        "target": "pass",
                        "$closeLine": 28,
                        "$closeColumn": 65
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 29,
                        "$closeColumn": 38
                    }
                ],
                "$closeLine": 30,
                "$closeColumn": 2
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l32_c27
                ],
                "$closeLine": 32,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l33_c27
                ],
                "$closeLine": 33,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 34,
        "$closeColumn": 2,
        "onEntry": [
            $datamodel_l3_c1
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test233.txml.scxml"
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

    function $expr_l17_c39(_event) {
        return 2
    };
    $expr_l17_c39.tagname = 'undefined';
    $expr_l17_c39.line = 17;
    $expr_l17_c39.column = 39;

    function $senddata_l16_c13(_event) {
        return {
            "aParam": $expr_l17_c39.apply(this, arguments)
        }
    };
    $senddata_l16_c13.tagname = 'send';
    $senddata_l16_c13.line = 16;
    $senddata_l16_c13.column = 13;

    function $send_l16_c13(_event) {
        var _scionTargetRef = "#_parent";
        this.send({
            target: _scionTargetRef,
            name: "childToParent",
            data: $senddata_l16_c13.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l16_c13.tagname = 'send';
    $send_l16_c13.line = 16;
    $send_l16_c13.column = 13;
    return {
        "initial": "subFinal",
        "version": "1.0",
        "$type": "scxml",
        "id": "$generated-scxml-1",
        "states": [{
            "id": "subFinal",
            "$type": "final",
            "onEntry": [
                $send_l16_c13
            ],
            "$closeLine": 20,
            "$closeColumn": 12
        }],
        "$closeLine": 21,
        "$closeColumn": 11,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test233.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjMzLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JvQyxhQUFNLENBQUMsSUFBSSxDQUFDLE1BQU87QUFBQTs7Ozs7QUFBaEQsNENBQWlEO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZm5EO0FBQUEsQ0FBZ0M7QUFBQTs7Ozs7QUFBaEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQWdDO0FBQUE7Ozs7O0FBbUJLLFdBQUksRUFBRSxDQUFFO0FBQUE7Ozs7O0FBSUcsYUFBTztBQUFBOzs7OztBQUFqQyx5REFBa0M7QUFBQTs7Ozs7QUFDUixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7OztBQTdCckMsUUFBRTtBQUFBOzs7OztBQUR6Qiw0RUFFRztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZbUMsUUFBRTtBQUFBOzs7OztBQUQ1QjtBQUFBLDhDQUVJO0FBQUE7Ozs7O0FBRko7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBRUk7QUFBQSJ9