dn=`dirname $0`
abspath=`cd $dn; pwd`

#NODE_NO_READLINE=1 node repl.js $1
NODE_NO_READLINE=1 node $abspath/repl+http-debug-listener.js $1

