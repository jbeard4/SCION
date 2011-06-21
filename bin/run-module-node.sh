dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`

moduleToRun=$1

shift

node $basedir/lib/js/r.js $basedir/src/main/javascript/runner.js $basedir/build/ $moduleToRun $*
