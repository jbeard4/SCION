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

this.console = {
	log : this.print,
	info : this.print,
	error : this.print
};

(function(){
	var args = Array.prototype.slice.call(arguments);

	if(args.length >= 3){
		var preparedArguments = args.slice(3);

		//if we only have one big argument with at least one space in it, assume we're being called by ant or maven, 
		//which, due to passing multiple args in as -D"arg1 arg2 arg3", shows up here as one big string with spaces 
		if(preparedArguments.length == 1 && preparedArguments[0].search(" ")){
			preparedArguments = preparedArguments[0].replace(/^\s+|\s+$/g, '').split(/ +/); 
		}

		var absoluteScriptDir = args[1];
		var mainFunction = args[2]; 

		//bootstrap require.js
		require({
				baseUrl : absoluteScriptDir + "/target/classes/"	//FIXME: this should also be passed in as an argument
			},
			[mainFunction],
			function(fn){
				fn(preparedArguments);
			}
		);

	}

}).apply(this,arguments);
