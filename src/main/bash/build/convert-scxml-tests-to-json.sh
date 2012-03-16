#!/bin/bash
#   Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.


dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`
projdir=`cd $dn/../../../../; pwd`
utildir=`cd $dn/../util/; pwd`

for i in $projdir/src/test/*; do 
    x=`basename $i`; 
    mkdir $projdir/target/test/$x; 
    for scxmlFile in $i/*.scxml; do 
        y=`basename $scxmlFile`; 
        echo converting $scxmlFile to json at "$projdir/target/test/$x/$y.js"; 
        $utildir/scxml-to-json.sh $scxmlFile --param wrapInAsyncModuleDefinition "true()" > $projdir/target/test/$x/$y.js; 
    done; 
done
