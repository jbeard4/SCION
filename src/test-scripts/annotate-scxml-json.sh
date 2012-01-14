f=`readlink -f $0`
dn=`dirname $f`
abspath=`cd $dn; pwd`
t=`dirname $abspath`
basedir=`dirname $t`

#TODO: this file is mostly here to provide a convenient target for package.json bin
#it's not really a test script, so should probably be moved somewhere else, like src/main/bash/util/

in=${1-"-"}
out=${2-"-"}
$basedir/src/test-scripts/run-module.sh util/annotate-scxml-json node $in $out
