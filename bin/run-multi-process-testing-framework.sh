dn=`dirname $0`
abspath=`cd $dn; pwd`

$abspath/run-module.sh scxml/test/multi-process/server node $*
