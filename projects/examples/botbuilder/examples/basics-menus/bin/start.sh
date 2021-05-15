#!/bin/bash
echo $0
x=`readlink "$0"`
y=`dirname "$0"`
z=`dirname "$x"`
w=`dirname $y/$z`
cd $w
echo `pwd`
npm run start
