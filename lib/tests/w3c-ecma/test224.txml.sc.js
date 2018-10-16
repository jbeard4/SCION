//Generated on 2018-10-16 14:28:43 by the SCION SCXML compiler
function rootConstructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'undefined';
    var Var1, Var2;

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

    var $invokeIdCounter = 0;
    var $invokeIdAccumulator = [];

    function $generateInvokeId(parentStateId) {
        var id;
        do {
            id = parentStateId + ".invokeid_" + $invokeIdCounter++; //make sure we dont clobber an existing sendid or invokeid
        } while ($invokeIdAccumulator.indexOf(id) > -1)
        return id;
    };

    function $deserializeDatamodel($serializedDatamodel) {
        Var1 = $serializedDatamodel["Var1"];
        Var2 = $serializedDatamodel["Var2"];
    }

    function $serializeDatamodel() {
        return {
            "Var1": Var1,
            "Var2": Var2
        };
    }

    function $idlocation_l10_c56(_event) {
        return Var1 = $generateInvokeId.call(this, "s0")
    };
    $idlocation_l10_c56.tagname = 'undefined';
    $idlocation_l10_c56.line = 10;
    $idlocation_l10_c56.column = 56;

    function $invoke_l10_c2(_event) {
        $invoke_l10_c2.id = $idlocation_l10_c56.apply(this, arguments);
        this.invoke({
            "autoforward": false,
            "type": "http://www.w3.org/TR/scxml/",
            "src": null,
            "id": $invoke_l10_c2.id,
            "constructorFunction": $invoke_l10_c2Constructor,


            "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test224.txml.scxml"
        });
    };
    $invoke_l10_c2.tagname = 'invoke';
    $invoke_l10_c2.line = 10;
    $invoke_l10_c2.column = 2;

    $invoke_l10_c2.autoforward = false;

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
            delay: getDelayInMs("1s"),
        });
    };
    $send_l8_c5.tagname = 'send';
    $send_l8_c5.line = 8;
    $send_l8_c5.column = 5;

    function $cond_l23_c20(_event) {
        return (function(str, starts) {
            if (starts === '') return true;
            if (str == null || starts == null) return false;
            str = String(str);
            starts = String(starts);
            return str.length >= starts.length && str.slice(0, starts.length) === starts;
        })(Var1, Var2)
    };
    $cond_l23_c20.tagname = 'undefined';
    $cond_l23_c20.line = 23;
    $cond_l23_c20.column = 20;

    function $expr_l27_c53(_event) {
        return 'pass'
    };
    $expr_l27_c53.tagname = 'undefined';
    $expr_l27_c53.line = 27;
    $expr_l27_c53.column = 53;

    function $log_l27_c27(_event) {
        this.log("Outcome", $expr_l27_c53.apply(this, arguments));
    };
    $log_l27_c27.tagname = 'log';
    $log_l27_c27.line = 27;
    $log_l27_c27.column = 27;

    function $expr_l28_c53(_event) {
        return 'fail'
    };
    $expr_l28_c53.tagname = 'undefined';
    $expr_l28_c53.line = 28;
    $expr_l28_c53.column = 53;

    function $log_l28_c27(_event) {
        this.log("Outcome", $expr_l28_c53.apply(this, arguments));
    };
    $log_l28_c27.tagname = 'log';
    $log_l28_c27.line = 28;
    $log_l28_c27.column = 27;

    function $data_l3_c25(_event) {
        return 's0.'
    };
    $data_l3_c25.tagname = 'undefined';
    $data_l3_c25.line = 3;
    $data_l3_c25.column = 25;

    function $datamodel_l1_c2(_event) {
        if (typeof Var2 === "undefined") Var2 = $data_l3_c25.apply(this, arguments);
    };
    $datamodel_l1_c2.tagname = 'datamodel';
    $datamodel_l1_c2.line = 1;
    $datamodel_l1_c2.column = 2;
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
                "invokes": $invoke_l10_c2,
                "transitions": [{
                    "event": "*",
                    "target": "s1",
                    "$closeLine": 19,
                    "$closeColumn": 36
                }],
                "$closeLine": 20,
                "$closeColumn": 2
            },
            {
                "id": "s1",
                "$type": "state",
                "transitions": [{
                        "cond": $cond_l23_c20,
                        "target": "pass",
                        "$closeLine": 23,
                        "$closeColumn": 283
                    },
                    {
                        "target": "fail",
                        "$closeLine": 24,
                        "$closeColumn": 28
                    }
                ],
                "$closeLine": 25,
                "$closeColumn": 4
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l27_c27
                ],
                "$closeLine": 27,
                "$closeColumn": 74
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l28_c27
                ],
                "$closeLine": 28,
                "$closeColumn": 74
            }
        ],
        "$closeLine": 30,
        "$closeColumn": 2,
        "onEntry": [
            $datamodel_l1_c2
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test224.txml.scxml"
    };
}

function $invoke_l10_c2Constructor(_x, _sessionid, _ioprocessors, In) {
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
            "$closeLine": 14,
            "$closeColumn": 27
        }],
        "$closeLine": 15,
        "$closeColumn": 8,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test224.txml.scxml"
    };
}
module.exports = rootConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MjI0LnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVXdELFdBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDLENBQUUsSUFBSSxDQUFqQztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZ4RDtBQUFBLENBQWdDO0FBQUE7Ozs7O0FBQWhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFnQztBQUFBOzs7OztBQWVqQixRQUFDLFFBQVEsQ0FBQyxHQUFHLEMsQ0FBRSxNQUFNLENBQUMsQ0FBQyxFLENBQUcsQ0FBQyxNLENBQU8sRyxDQUFJLEVBQUUsQyxDQUFFLE0sQ0FBTyxJQUFJLENBQUMsRSxDQUFHLENBQUMsRyxDQUFJLEUsQ0FBRyxJLENBQUssRSxDQUFHLE0sQ0FBTyxFLENBQUcsSUFBSSxDLENBQUUsTSxDQUFPLEtBQUssQ0FBQyxHLENBQUksQyxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQyxDQUFFLE0sQ0FBTyxDLENBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE0sQ0FBTyxHQUFHLENBQUMsTSxDQUFPLEUsQ0FBRyxNQUFNLENBQUMsTSxDQUFPLEUsQ0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQyxDQUFFLE1BQU0sQ0FBQyxNQUFNLEMsQ0FBRSxHLENBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQyxDQUFFLElBQUksQ0FBYTtBQUFBOzs7OztBQUl2TixhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7OztBQUNSLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUE7Ozs7O0FBekJwQyxZQUFNO0FBQUE7Ozs7O0FBRjdCLDRFQUdHO0FBQUEifQ==