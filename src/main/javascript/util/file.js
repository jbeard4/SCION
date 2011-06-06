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
This module contains functions to simplify File operations when
running under Rhino.
*/

define({
	deleteDir : function (dir) {
	    if (dir.isDirectory()) {
		children = dir.list();
		for (var i=0; i<children.length; i++) {
		    var success = deleteDir(new java.io.File(dir, children[i]));
		    if (!success) {
			return false;
		    }
		}
	    }

	    // The directory is now empty so delete it
	    return dir["delete"]();
	},

	writeFile : function (str,pathStr){
		var out = new java.io.FileWriter(pathStr);
		out.write(str);
		out.flush();
	    out.close();
	},

	//not currently used.
	copyFile : function (from,to){
	    var fr = new java.io.FileReader(from);
	    var fw = new java.io.FileWriter(to);
	    var c;

	    while ((c = fr.read()) != -1){
	      fw.write(c);
	    }

	    fr.close();
	    fw.close();
	}
});
