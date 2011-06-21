/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(){
	var args, argOffset;
	if(typeof process === "undefined"){
		argOffset = 0;

		//we are running under rhino - arguments are passed in on "arguments"
		args = Array.prototype.slice.call(arguments);

		this.console = {
			log : this.print,
			info : this.print,
			error : this.print,
			debug : this.print
		};
	}else{
		//we are running under node
		args = process.argv;
		argOffset = 2;
		if(!this.console.debug){
			this.console.debug = this.console.log;
		}

		var fs = require("fs");

		//also, add a synchronous API for reading files
		this.readFile = function(fileName){
			return fs.readFileSync(fileName,"utf8");
		};
	}

	//note: spartan shell environments cannot reliably accept command-line args, so the entry point (e.g. unit test harness) is called directly for them
	//this is accomplished by creating a launch script, which symlinks desired entry point module to main.js in pwd

	if(args.length >= 3+argOffset){
		var preparedArguments = args.slice(3+argOffset);

		//if we only have one big argument with at least one space in it, assume we're being called by ant or maven, 
		//which, due to passing multiple args in as -D"arg1 arg2 arg3", shows up here as one big string with spaces 
		if(preparedArguments.length == 1 && preparedArguments[0].search(" ")){
			preparedArguments = preparedArguments[0].replace(/^\s+|\s+$/g, '').split(/ +/); 
		}

		var basedir = args[1+argOffset];
		var mainFunction = args[2+argOffset]; 

		//console.log("basedir ",basedir); 
		//console.log("mainFunction ",mainFunction ); 

		//bootstrap require.js
		require({
				baseUrl : basedir,
				paths : {
					text : "lib/text"
				}
			},
			[mainFunction],
			function(fn){
				fn.apply(this,preparedArguments);
			}
		);

	}

}).apply(this,typeof arguments === "undefined" ? [] : arguments);
