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

/*
This module contains utilities for parsing command-line arguments
using the Apache Commons CLI library, and for converting these
native Java objects back to JavaScript objects. 
*/

define({
	parseCommandLine: function(optionsMap,args){
	
		var Options = Packages.org.apache.commons.cli.Options;
		var OptionBuilder = Packages.org.apache.commons.cli.OptionBuilder;
		var PosixParser = Packages.org.apache.commons.cli.PosixParser;

		var lineMap;
		
		var options = new Options();
		for( var optionName in optionsMap){
			var optionVal = optionsMap[optionName];
			options.addOption(
				typeof optionVal == "boolean" ? 
					OptionBuilder.create( optionName ) : 
					OptionBuilder.withArgName(optionVal.argName).hasArg().create( optionName )
			);	
		}

		var parser = new PosixParser();

		try {
			// parse the command line arguments
			line = parser.parse( options, args );

			lineMap = this.lineToJsMap(line);
			lineMap.args = Array.prototype.slice.call(line.getArgs());

			/*
			for (var optName in lineMap){
				print(optName);
				print(lineMap[optName]);
				print("--------------");
			}

			lineMap.args.forEach(function(f){print(f)});
			*/
		}
		catch( exp ) {
			// oops, something went wrong
			print( "Parsing failed.  Reason: " + exp.getMessage() );
		}
	
		return lineMap;
	},

	lineToJsMap : function(line){
		var toReturn = {};

		var processedOptions = line.getOptions();
		processedOptions.forEach(function(pOpt){

			var pval = pOpt.getValue();

			if(pval){
				//if pval is defined, copy him so that we have a native, primitive js string
				//otherwise, switch statement won't work in rhino
				toReturn[pOpt.getOpt()] = pval.slice();
			}else{
				toReturn[pOpt.getOpt()] = true; 
			}
			
		}) 
		
		return toReturn;
	}

});

