//Generated on 2018-10-16 14:29:01 by the SCION SCXML compiler
function machineNameConstructor(_x, _sessionid, _ioprocessors, In) {
    var _name = 'machineName';

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

    function $raise_l4_c6(_event) {
        this.raise({
            name: "foo",
            data: null
        });
    };
    $raise_l4_c6.tagname = 'raise';
    $raise_l4_c6.line = 4;
    $raise_l4_c6.column = 6;

    function $cond_l6_c33(_event) {
        return 'name' in _event && 'type' in _event && 'sendid' in _event && 'origin' in _event && 'origintype' in _event && 'invokeid' in _event && 'data' in _event
    };
    $cond_l6_c33.tagname = 'undefined';
    $cond_l6_c33.line = 6;
    $cond_l6_c33.column = 33;

    function $senddata_l12_c6(_event) {
        return {}
    };
    $senddata_l12_c6.tagname = 'send';
    $senddata_l12_c6.line = 12;
    $senddata_l12_c6.column = 6;

    function $send_l12_c6(_event) {
        var _scionTargetRef = null;
        this.send({
            target: _scionTargetRef,
            name: "foo",
            data: $senddata_l12_c6.apply(this, arguments),
            sendid: undefined,
            origin: _sessionid
        }, {
            delay: getDelayInMs(null),
        });
    };
    $send_l12_c6.tagname = 'send';
    $send_l12_c6.line = 12;
    $send_l12_c6.column = 6;

    function $cond_l14_c33(_event) {
        return 'name' in _event && 'type' in _event && 'sendid' in _event && 'origin' in _event && 'origintype' in _event && 'invokeid' in _event && 'data' in _event
    };
    $cond_l14_c33.tagname = 'undefined';
    $cond_l14_c33.line = 14;
    $cond_l14_c33.column = 33;

    function $expr_l19_c56(_event) {
        return 'pass'
    };
    $expr_l19_c56.tagname = 'undefined';
    $expr_l19_c56.line = 19;
    $expr_l19_c56.column = 56;

    function $log_l19_c30(_event) {
        this.log("Outcome", $expr_l19_c56.apply(this, arguments));
    };
    $log_l19_c30.tagname = 'log';
    $log_l19_c30.line = 19;
    $log_l19_c30.column = 30;

    function $expr_l20_c56(_event) {
        return 'fail'
    };
    $expr_l20_c56.tagname = 'undefined';
    $expr_l20_c56.line = 20;
    $expr_l20_c56.column = 56;

    function $log_l20_c30(_event) {
        this.log("Outcome", $expr_l20_c56.apply(this, arguments));
    };
    $log_l20_c30.tagname = 'log';
    $log_l20_c30.line = 20;
    $log_l20_c30.column = 30;
    return {
        "{http://www.w3.org/2000/xmlns/}": "http://www.w3.org/2005/07/scxml",
        "{http://www.w3.org/2000/xmlns/}conf": "http://www.w3.org/2005/scxml-conformance",
        "initial": "s0",
        "name": "machineName",
        "$type": "scxml",
        "id": "$generated-scxml-0",
        "states": [{
                "id": "s0",
                "$type": "state",
                "onEntry": [
                    $raise_l4_c6
                ],
                "transitions": [{
                        "event": "foo",
                        "cond": $cond_l6_c33,
                        "target": "s1",
                        "$closeLine": 6,
                        "$closeColumn": 245
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 7,
                        "$closeColumn": 42
                    }
                ],
                "$closeLine": 8,
                "$closeColumn": 5
            },
            {
                "id": "s1",
                "$type": "state",
                "onEntry": [
                    $send_l12_c6
                ],
                "transitions": [{
                        "event": "foo",
                        "cond": $cond_l14_c33,
                        "target": "pass",
                        "$closeLine": 14,
                        "$closeColumn": 247
                    },
                    {
                        "event": "*",
                        "target": "fail",
                        "$closeLine": 15,
                        "$closeColumn": 42
                    }
                ],
                "$closeLine": 16,
                "$closeColumn": 5
            },
            {
                "id": "pass",
                "$type": "final",
                "onEntry": [
                    $log_l19_c30
                ],
                "$closeLine": 19,
                "$closeColumn": 77
            },
            {
                "id": "fail",
                "$type": "final",
                "onEntry": [
                    $log_l20_c30
                ],
                "$closeLine": 20,
                "$closeColumn": 77
            }
        ],
        "$closeLine": 22,
        "$closeColumn": 2,
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel,
        "docUrl": "/Users/jbeard4/workspace/scion/projects/libraries/test-framework/test/w3c-ecma/test330.txml.scxml"
    };
}
module.exports = machineNameConstructor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYmVhcmQ0L3dvcmtzcGFjZS9zY2lvbi9wcm9qZWN0cy9saWJyYXJpZXMvdGVzdC1mcmFtZXdvcmsvdGVzdC93M2MtZWNtYS90ZXN0MzMwLnR4bWwuc2N4bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJTSx1Q0FBa0I7QUFBQTs7Ozs7QUFFUyxhLENBQU8sRSxDQUFHLE0sQ0FBTyxFLENBQUcsTSxDQUFPLEUsQ0FBRyxNLENBQU8sRSxDQUFHLFEsQ0FBUyxFLENBQUcsTSxDQUFPLEUsQ0FBRyxRLENBQVMsRSxDQUFHLE0sQ0FBTyxFLENBQUcsWSxDQUFhLEUsQ0FBRyxNLENBQU8sRSxDQUFHLFUsQ0FBVyxFLENBQUcsTSxDQUFPLEUsQ0FBRyxNLENBQU8sRSxDQUFHLE1BQXVEO0FBQUE7Ozs7O0FBTWxPO0FBQUEsQ0FBaUI7QUFBQTs7Ozs7QUFBakI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQWlCO0FBQUE7Ozs7O0FBRVUsYSxDQUFPLEUsQ0FBRyxNLENBQU8sRSxDQUFHLE0sQ0FBTyxFLENBQUcsTSxDQUFPLEUsQ0FBRyxRLENBQVMsRSxDQUFHLE0sQ0FBTyxFLENBQUcsUSxDQUFTLEUsQ0FBRyxNLENBQU8sRSxDQUFHLFksQ0FBYSxFLENBQUcsTSxDQUFPLEUsQ0FBRyxVLENBQVcsRSxDQUFHLE0sQ0FBTyxFLENBQUcsTSxDQUFPLEUsQ0FBRyxNQUF1RDtBQUFBOzs7OztBQUtoTCxhQUFPO0FBQUE7Ozs7O0FBQWpDLHlEQUFrQztBQUFBOzs7OztBQUNSLGFBQU87QUFBQTs7Ozs7QUFBakMseURBQWtDO0FBQUEifQ==