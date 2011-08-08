define ["spartanLoaderForAllTests", "class-transition-lookup-optimization-array-loader", "switch-transition-lookup-optimization-array-loader", "table-transition-lookup-optimization-array-loader"],(testTuples,classTransitionOpts,switchTransitionOpts,tableTransitionOpts) ->

	merge = (from,to) ->
		for k,v of from
			to[k] = v
		return to

	testName = (test) -> "(#{test.name}/#{test.group}[#{test.transitionSelector.selectorKey};#{test.set.setTypeKey};#{test.extraModelInfo}])"

	#set up optimizations
	#TODO: when we have other optimizations, this is where their initialization will also go
	jsonTests = []
	for i in [0...testTuples.length]
		

		transitionSelectors =
			"default-transition-lookup" : "scxml/default-transition-selector"
			"class-transition-lookup" : classTransitionOpts[i]
			"switch-transition-lookup" : switchTransitionOpts[i]
			"table-transition-lookup" : tableTransitionOpts[i]

		setTypes =
			bitVector : "util/set/BitVector"
			boolArray : "util/set/BooleanArray"
			objectSet : "util/set/ObjectSet"
			arraySet : "util/set/ArraySet"

		
		extraModelInfo = [false]

		for selectorKey,selector of transitionSelectors
			for setTypeKey,setTypeVal of setTypes
				for info in extraModelInfo
					test =
						merge testTuples[i],
							transitionSelector :
								selectorKey : selectorKey
								selector : selector
							set :
								setTypeKey : setTypeKey
								setType : setTypeVal
							extraModelInfo : info

					test.id = testName test

					jsonTests.push test
					
	return jsonTests
