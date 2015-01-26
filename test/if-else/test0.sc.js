//Generated on Tuesday, June 17, 2014 21:23:27 by the SCION SCXML compiler
module.exports = (function(_x,_sessionid,_name,_ioprocessors,In){
    
    
    
    
    var x;
    
    var $scion_early_binding_datamodel_has_fired= false;
    function $initEarlyBindingDatamodel(_event){
        if(!$scion_early_binding_datamodel_has_fired){
            x = $data_line_22_column_31.apply(this, arguments);
            $scion_early_binding_datamodel_has_fired = true; 
        }
    }
    
    function $deserializeDatamodel($serializedDatamodel){
        x = $serializedDatamodel["x"];
        $scion_early_binding_datamodel_has_fired = true;
    }
    
    function $serializeDatamodel(){
       return {
        "x" : x
       };
    }
    
    function $expr_line_45_column_37(_event){
        return x;
    }
    
    function $log_line_45_column_37(_event){
        this.log("x",$expr_line_45_column_37.apply(this, arguments));
    }
    
    function $cond_line_46_column_32(_event){
        return x !== 10;
    }
    
    function $expr_line_47_column_51(_event){
        return x * 3;
    }
    
    function $assign_line_47_column_51(_event){
        x = $expr_line_47_column_51.apply(this, arguments);
    }
    
    function $expr_line_49_column_51(_event){
        return x * 2;
    }
    
    function $assign_line_49_column_51(_event){
        x = $expr_line_49_column_51.apply(this, arguments);
    }
    
    function $if_line_46_column_32(_event){
        if($cond_line_46_column_32.apply(this, arguments)){
            $assign_line_47_column_51.apply(this, arguments);
        }else{
            $assign_line_49_column_51.apply(this, arguments);
        }
    }
    
    function $expr_line_51_column_37(_event){
        return x;
    }
    
    function $log_line_51_column_37(_event){
        this.log("x",$expr_line_51_column_37.apply(this, arguments));
    }
    
    function $expr_line_28_column_37(_event){
        return x;
    }
    
    function $log_line_28_column_37(_event){
        this.log("x",$expr_line_28_column_37.apply(this, arguments));
    }
    
    function $cond_line_29_column_31(_event){
        return x === 0;
    }
    
    function $expr_line_30_column_48(_event){
        return 10;
    }
    
    function $assign_line_30_column_48(_event){
        x = $expr_line_30_column_48.apply(this, arguments);
    }
    
    function $cond_line_31_column_41(_event){
        return x === 10;
    }
    
    function $expr_line_32_column_48(_event){
        return 20;
    }
    
    function $assign_line_32_column_48(_event){
        x = $expr_line_32_column_48.apply(this, arguments);
    }
    
    function $expr_line_34_column_48(_event){
        return 30;
    }
    
    function $assign_line_34_column_48(_event){
        x = $expr_line_34_column_48.apply(this, arguments);
    }
    
    function $if_line_29_column_31(_event){
        if($cond_line_29_column_31.apply(this, arguments)){
            $assign_line_30_column_48.apply(this, arguments);
        }else if($cond_line_31_column_41.apply(this, arguments)){
            $assign_line_32_column_48.apply(this, arguments);
        }else{
            $assign_line_34_column_48.apply(this, arguments);
        }
    }
    
    function $expr_line_36_column_37(_event){
        return x;
    }
    
    function $log_line_36_column_37(_event){
        this.log("x",$expr_line_36_column_37.apply(this, arguments));
    }
    
    function $expr_line_40_column_47(_event){
        return x + 1;
    }
    
    function $assign_line_40_column_47(_event){
        x = $expr_line_40_column_47.apply(this, arguments);
    }
    
    function $cond_line_39_column_58(_event){
        return x === 10;
    }
    
    function $expr_line_58_column_37(_event){
        return x;
    }
    
    function $log_line_58_column_37(_event){
        this.log("x",$expr_line_58_column_37.apply(this, arguments));
    }
    
    function $cond_line_59_column_31(_event){
        return x === 0;
    }
    
    function $expr_line_60_column_49(_event){
        return 100;
    }
    
    function $assign_line_60_column_49(_event){
        x = $expr_line_60_column_49.apply(this, arguments);
    }
    
    function $cond_line_61_column_41(_event){
        return x === 21;
    }
    
    function $expr_line_62_column_51(_event){
        return x + 2;
    }
    
    function $assign_line_62_column_51(_event){
        x = $expr_line_62_column_51.apply(this, arguments);
    }
    
    function $expr_line_63_column_51(_event){
        return x + 3;
    }
    
    function $assign_line_63_column_51(_event){
        x = $expr_line_63_column_51.apply(this, arguments);
    }
    
    function $expr_line_65_column_49(_event){
        return 200;
    }
    
    function $assign_line_65_column_49(_event){
        x = $expr_line_65_column_49.apply(this, arguments);
    }
    
    function $if_line_59_column_31(_event){
        if($cond_line_59_column_31.apply(this, arguments)){
            $assign_line_60_column_49.apply(this, arguments);
        }else if($cond_line_61_column_41.apply(this, arguments)){
            $assign_line_62_column_51.apply(this, arguments);
            $assign_line_63_column_51.apply(this, arguments);
        }else{
            $assign_line_65_column_49.apply(this, arguments);
        }
    }
    
    function $cond_line_68_column_32(_event){
        return x === 26;
    }
    
    function $expr_line_69_column_51(_event){
        return x + 1;
    }
    
    function $assign_line_69_column_51(_event){
        x = $expr_line_69_column_51.apply(this, arguments);
    }
    
    function $if_line_68_column_32(_event){
        if($cond_line_68_column_32.apply(this, arguments)){
            $assign_line_69_column_51.apply(this, arguments);
        }
    }
    
    function $cond_line_72_column_32(_event){
        return x === 26;
    }
    
    function $cond_line_73_column_41(_event){
        return x === 27;
    }
    
    function $expr_line_74_column_51(_event){
        return x + 1;
    }
    
    function $assign_line_74_column_51(_event){
        x = $expr_line_74_column_51.apply(this, arguments);
    }
    
    function $expr_line_76_column_52(_event){
        return x + 10;
    }
    
    function $assign_line_76_column_52(_event){
        x = $expr_line_76_column_52.apply(this, arguments);
    }
    
    function $if_line_72_column_32(_event){
        if($cond_line_72_column_32.apply(this, arguments)){
        }else if($cond_line_73_column_41.apply(this, arguments)){
            $assign_line_74_column_51.apply(this, arguments);
        }else{
            $assign_line_76_column_52.apply(this, arguments);
        }
    }
    
    function $cond_line_79_column_32(_event){
        return x === 28;
    }
    
    function $expr_line_80_column_52(_event){
        return x + 12;
    }
    
    function $assign_line_80_column_52(_event){
        x = $expr_line_80_column_52.apply(this, arguments);
    }
    
    function $cond_line_81_column_36(_event){
        return x === 40;
    }
    
    function $expr_line_82_column_56(_event){
        return x + 10;
    }
    
    function $assign_line_82_column_56(_event){
        x = $expr_line_82_column_56.apply(this, arguments);
    }
    
    function $if_line_81_column_36(_event){
        if($cond_line_81_column_36.apply(this, arguments)){
            $assign_line_82_column_56.apply(this, arguments);
        }
    }
    
    function $if_line_79_column_32(_event){
        if($cond_line_79_column_32.apply(this, arguments)){
            $assign_line_80_column_52.apply(this, arguments);
            $if_line_81_column_36.apply(this, arguments);
        }
    }
    
    function $cond_line_86_column_32(_event){
        return x === 50;
    }
    
    function $expr_line_87_column_51(_event){
        return x + 1;
    }
    
    function $assign_line_87_column_51(_event){
        x = $expr_line_87_column_51.apply(this, arguments);
    }
    
    function $cond_line_88_column_36(_event){
        return x !== 51;
    }
    
    function $expr_line_90_column_56(_event){
        return x + 20;
    }
    
    function $assign_line_90_column_56(_event){
        x = $expr_line_90_column_56.apply(this, arguments);
    }
    
    function $if_line_88_column_36(_event){
        if($cond_line_88_column_36.apply(this, arguments)){
        }else{
            $assign_line_90_column_56.apply(this, arguments);
        }
    }
    
    function $if_line_86_column_32(_event){
        if($cond_line_86_column_32.apply(this, arguments)){
            $assign_line_87_column_51.apply(this, arguments);
            $if_line_88_column_36.apply(this, arguments);
        }
    }
    
    function $expr_line_94_column_37(_event){
        return x;
    }
    
    function $log_line_94_column_37(_event){
        this.log("x",$expr_line_94_column_37.apply(this, arguments));
    }
    
    function $cond_line_97_column_48(_event){
        return x === 71;
    }
    
    function $data_line_22_column_31(_event){
        return 0;
    }
    
    return {
        "": "http://www.w3.org/2005/07/scxml",
        "$type": "scxml",
        "states": [
            {
                "id": "a",
                "onEntry": [
                    $log_line_28_column_37,
                    $if_line_29_column_31,
                    $log_line_36_column_37
                ],
                "transitions": [
                    {
                        "event": "t",
                        "target": "b",
                        "cond": $cond_line_39_column_58,
                        "onTransition": $assign_line_40_column_47
                    }
                ],
                "onExit": [
                    $log_line_45_column_37,
                    $if_line_46_column_32,
                    $log_line_51_column_37
                ]
            },
            {
                "id": "b",
                "onEntry": [
                    $log_line_58_column_37,
                    $if_line_59_column_31,
                    $if_line_68_column_32,
                    $if_line_72_column_32,
                    $if_line_79_column_32,
                    $if_line_86_column_32,
                    $log_line_94_column_37
                ],
                "transitions": [
                    {
                        "target": "c",
                        "cond": $cond_line_97_column_48
                    },
                    {
                        "target": "f"
                    }
                ]
            },
            {
                "id": "c"
            },
            {
                "id": "f"
            }
        ],
        "onEntry": [
            $initEarlyBindingDatamodel
        ],
        "$deserializeDatamodel": $deserializeDatamodel,
        "$serializeDatamodel": $serializeDatamodel
    };});
