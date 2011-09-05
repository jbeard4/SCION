# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

dn=`dirname $0`
abspath=`cd $dn; pwd`

$abspath/run-module.sh scxml/test/multi-process/server node $*
