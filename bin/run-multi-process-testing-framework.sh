dn=`dirname $0`
abspath=`cd $dn; pwd`

$abspath/run-module-node.sh scxml/test/multi-process-2/server $*
