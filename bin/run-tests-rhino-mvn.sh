#!/bin/sh
# Copyright (C) 2011 Jacob Beard
# Released under GNU LGPL, read the file 'COPYING' for more information

dn=`dirname $0`
abspath=`cd $dn; pwd`
basedir=`dirname $abspath`
mvn -q -o -f $basedir/pom.xml exec:java -DscxmlArgs="$*"
