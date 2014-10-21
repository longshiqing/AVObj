/*
 * Copyright (c) 2014 Ian Carson - LinkedIn http://lnkd.in/9qJWap
 *
 * Project : AVObj - Making JS Simple.
 * Version : 0.6.1
 * License : MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * For the latest updates go to http://AVObject.net
 * Visit the wiki for howto information on getting started at https://github.com/Kabe0/AVObj/wiki
 *
 * Referenced https://github.com/ccampbell/rainbow/ for ideas on how to implement the matching algorithms AVObject.
 */

var CodeDecorator = AVObj.extend( {initOnPageLoad: true } );
	CodeDecorator.properties =
{
	typeOptions: {},

	detectNewType: function ( language, codeTree )
	{
		this.lastObject = null;
		this.currentObjectScope = [];

		this.typeOptions[language] = codeTree;
	},

	/**
	 * @classdef The Code decorator on page load, goes through all the elements in the document and tries to fined elements labeled code.
	 * If the element is found, it will do a regular expression to find and replace all the values with spans with class codes to be coloured by a
	 * CSS sheet.
	 *
	 * @memberof CodeDecorator
	 * @constructor CodeDecorator
	 */
	init: function ()
	{
		this.codeElements = P( 'code' );

		for ( var i = this.codeElements.length; i--; )
		{
			this.startDecorating( this.codeElements[i] );
		}
	},

	startDecorating: function ( node )
	{
		var type;
		if ( ( type = this.typeOptions[node.attribute( 'type' )] ) != null )
		{
			var text = node.getText();
			var changeList = {};

			this.findMatches( text, type, changeList );


			/*
			var modifications = {};
			var newObject = {};

			this.currentObjectScope.push( this.lastObject = newObject );


			this.findMatchesSuperior( modifications, stringObj, type.tree, [] );

			console.log(newObject);

			//this.findMatches( modifications, text, type );

			console.log( modifications );
			//var newString = this.generateDecoratedText( modifications, text );

			var fullString = "";

			for( var i = 0; i < stringObj.length; i++ )
			{
				fullString += stringObj[i] + stringOther[i];
			}

			newString = fullString;
			newString = newString.replace( /(\n)/g, "</br>" );
			newString = newString.replace( /(\t|\s{3,4})/g, "&nbsp;&nbsp;&nbsp;&nbsp;" );

			node.text( newString, true );

			*/

		}
	},

	findMatches : function( text, parser, changeList )
	{
		// Tracks object Creation.
		var changeListScope = [changeList];
		var lastValue = null;
		var scopeIndex = 0;

		function currentScope()
		{
			return changeListScope[scopeIndex];
		}

		// Parses through the text argument and pulls the important information.
		var stringObj = [];					// Values of importance
		var stringOther = [];				// Values that can be ignored.

		var match = [];

		// Loop through string and split the important and unimportant information.
		while ( ( match = parser.pattern.exec( text ) ) !== null )
		{
			stringObj.push( match[1] );
			stringOther.push( match[2] );
		}


		var treeQuickLinks = {};						// Used for tree jumping by name.
		var quickLinks = {};							// Links to objects
		var treeStack = [parser.tree];					// The current position on the tree stack
		var treeIndex = 0;								// The current position on the tree reader

		findTreeNodes(parser.tree);

		function findTreeNodes( tree )
		{
			for( var i = tree.length; i--; )
			{
				if ( tree[i].name )
				{
					quickLinks[trees[i].name] = tree[i];
				}
				if ( tree[i].tree != null )
				{
					if ( tree[i].treeName)
					{
						treeQuickLinks[tree[i].treeName] = tree[i].tree;
					}
					findTreeNodes(tree[i].tree);
				}
			}
		}

		console.log("hgi", treeIndex);

		function currentTree()
		{
			return treeStack[treeIndex];
		}

		var obj = 0;						// Used to count through all the objects

		function currentObject()
		{
			return stringObj[obj];
		}

		while( obj < stringObj.length )
		{
			for( var i = 0; i < currentTree().length; i++ )
			{
				// The object in the tree matches. Break the loop and execute commands.
				if ( currentObject().match(currentTree()[i].matches) )
				{
					console.log("matches ", " - ",  currentTree()[i].matches, currentObject() );
					for ( var treeCommand in currentTree()[i] )
					{
						if ( treeCommand != "matches" )
						{
							var command = currentTree()[i][treeCommand];
							console.log( "command", treeCommand, " - ", command );
							switch ( treeCommand )
							{
							case "tick":
								obj += Number( command );	// Push the object forwards by user defined.
								break;
							case "storeValue":
								if ( currentScope()[currentObject()] == null )
								{
									lastValue = currentScope()[currentObject()] = { _pos: [obj], _type: [] };
								}
								else
								{
									( lastValue = currentScope()[currentObject()] )._pos.push( obj );
								}
								break;
							case "parent":
								console.log( "parent - ", currentScope() );
								//scopeIndex-= command;
								break;
							case "openScope":
								changeListScope.push( lastValue );
								scopeIndex++;
								break;
							case "closeScope":
								if ( changeListScope.length > 1 )
								{
									changeListScope.pop();
									scopeIndex--;
								}
								console.log( "hi all", changeListScope.length );
								break;
							case "addType":
								//console.log("hi ", currentScope());
								currentScope()._type.push( command );
								break;
							case "goto":
								treeStack.push( treeQuickLinks[command] );
								treeIndex++;
								break;
							case "tree":
								treeStack.push( command );
								treeIndex++;
								break;
							case "returnTree":
								if ( treeIndex - ( command - 1) <= 0 ) command = treeStack.length - 2;
								treeStack.splice( ( treeIndex - (command - 1) ), command );
								treeIndex = (treeStack.length - 1);
								console.log( treeStack.length );
								//console.log(treeStack);
								break;
							}
						}
					}
				}
			}
			obj++;
		}

		console.log(changeList);
	},

	findMatchesSuperior: function ( modificationObject, value, tree, parentTree, startingIndex )
	{
		var checkTreeOption = function ( treeObject, string )
		{
			for ( var option in treeObject )
			{
				var optionValue = treeObject[option];
				switch ( option )
				{
				case "initObject":
					{
						//console.log( "initing object " + string );
						if ( this.currentObjectScope[this.currentObjectScope.length - 1][ string ] == null )
						{
							this.lastObject = this.currentObjectScope[this.currentObjectScope.length - 1][ string ] = { type: treeObject.initObject, pos: [i] };
						}
						else
						{
							this.currentObjectScope[this.currentObjectScope.length - 1][string].type = treeObject.initObject;
							this.lastObject = this.currentObjectScope[this.currentObjectScope.length - 1][ string ].pos.push( i );
						}
					}
					break;
				case "openScope":
					{
						//console.log( "entering scope " + string , this.lastObject );
						this.currentObjectScope.push( this.lastObject );
					}
					break;
				case "closeScope":
					{
						//console.log( "leaving scope " + string );
						if ( this.currentObjectScope.length > 1 )
						{
							this.currentObjectScope.pop();
						}
					}
					break;
				case "addValue":
					{
						console.log( "adding value " + string, this.currentObjectScope );
						if ( this.currentObjectScope[this.currentObjectScope.length - 1][ string ] == null )
						{
							this.currentObjectScope[this.currentObjectScope.length - 1][ string ] = { type: treeObject.addValue, pos: [i] };
						}
						else
						{
							this.currentObjectScope[this.currentObjectScope.length - 1][string].type = treeObject.initObject;
							this.currentObjectScope[this.currentObjectScope.length - 1][ string ].pos.push( i );
						}
					}
					break;
				case "class":
					{
						if ( this.currentObjectScope[this.currentObjectScope.length - 1][string] == null )
						{
							this.currentObjectScope[this.currentObjectScope.length - 1][string] = { type : "unknown", class : string, pos : [] }
						}
						else
						{
							this.currentObjectScope[this.currentObjectScope.length - 1][ string ].class = string;
						}
						//value[i] = "<span class='" + treeObject.class + "'>" + string + "</span>";
					}
					break;
				case "findInScope":
					{
						for ( var k = this.currentObjectScope.length; k--; )
						{

							if ( this.currentObjectScope[k][string] != null )
							{
								//console.log("hi " + string, this.currentObjectScope[k][string] );
								//console.log( this.currentObjectScope[0]);
								this.currentObjectScope[k][string].pos.push( i );
								//value[i] = "<span class='" + this.currentObjectScope[k][string].type + "'>" + string + "</span>";
								break;
							}
						}
					}
					break;
				case "gotoStart":
					{
						var parentTo = parentTree[parentTree.length - treeObject.gotoStart];
						i = this.findMatchesSuperior( modificationObject, value, parentTo, parentTree, i );
					}
					break;
				case "tree":
					{
						parentTree.push(tree);
						i = this.findMatchesSuperior( modificationObject, value, treeObject.tree, parentTree, i + 1 );
					}
					break;
				}
			}
			/*
			//console.log("hi", string);
			for ( var option in treeObject )
			{
				var currentOption = treeObject[option];
				switch ( option )
				{
				case 'class':
					//console.log(string);
					value[i] = "<span class='" + currentOption + "'>" + string + "</span>";
					break;
				case 'initObject':
					lastObject = objectVal[string] = { type : currentOption };
					break;
				case 'addValue':
					currentObjectScope[ string ] = currentOption;
					break;
				case 'openScope':
					console.log( "entering scope " + string );
					currentObjectScope = lastObject;
					break;
				case 'closeScope':
					console.log( "leaving scope " + string );
					currentObjectScope = objectVal;
					break;
				case 'tree':
					i = this.findMatchesSuperior( modificationObject, value, currentOption, objectVal, i + 1 );
					break;
				}
			}*/
		}.bind( this );

		// We assume that stacking index is 0 by default.
		if ( startingIndex == null ) startingIndex = 0;
		//console.log(value);
		for ( var i = startingIndex; i < value.length; i++ )
		{
			var shouldIgnore = false;
			var newString, string = value[i];

			if ( tree.exclude )
			{
				for ( var j = tree.exclude.length; j--; )
				{
					if ( string == tree.exclude[j] )
					{
						shouldIgnore = true;
						break;
					}
				}
			}

			if ( !shouldIgnore )
			{
				if ( tree[string] != null )
				{
					checkTreeOption( tree[string], string );

					if ( tree[string].returnReader )
					{
						return i;
					}
				}
				else if ( tree.default != null )
				{
					checkTreeOption( tree.default, string );

					if ( tree.default.returnReader )
					{
						return i;
					}
				}
			}
		}
	},

	findMatchesOld: function ( modificationObject, text, matchObjects, stackingIndex )
	{
		// We assume that stacking index is 0 by default.
		if ( stackingIndex == null ) stackingIndex = 0;

		for ( var i = matchObjects.length; i--; )
		{
			var match = [];
			while ( match = matchObjects[i].pattern.exec( text ) )
			{
				var modificationIndex = match.index; // The start of the modifications.

				// Append the ignored
				for ( var j = 1; j < match.length; j++ )
				{
					if ( matchObjects[i].matches[j] != null )
					{
						switch ( typeof matchObjects[i].matches[j] )
						{
						case 'array':
							this.findMatches( modificationObject, match[j], matchObjects[i].matches[j], modificationIndex );
							break;
						case 'object':
							// We wrap the object around an array.
							this.findMatches( modificationObject, match[j], [matchObjects[i].matches[j]], modificationIndex );
							break;
						case 'string':
							modificationObject[modificationIndex + stackingIndex] = { length: match[j].length, class: matchObjects[i].matches[j] };
							break
						}
					}
					modificationIndex += match[j].length;
				}

				console.log( match.length );
				console.log( text.slice( 0, match.index ) );
				console.log( match );
			}
			/*
			 for ( var j = 0; j < contentRows.length; j++ )
			 {
			 //					var parsMe = type[i].pattern.exec( contentRows[j] );
			 var parsMe = contentRows[j].split( type[i].pattern );
			 console.log(parsMe);
			 }
			 */
		}
	},

	generateDecoratedText: function ( modifications, text )
	{
		var newString = "";		// The new string generated with spans.
		var previousIndex = 0;	// Used to keep track of unmodified text

		// Loop through all the modifications defined.
		for ( var index in modifications )
		{
			var indexValues = modifications[index];
			// First grab the unmodified text and append it to the string.
			newString += text.substr( previousIndex, index - previousIndex );

			// Add the modified string to the end.
			newString += "<span class='" + indexValues.class + "'>" + text.substr( index, indexValues.length ) + "</span>";

			// Track the next index position from the original text.
			previousIndex = Number( index ) + indexValues.length;
		}

		// append the very last part of the unmodified string to the end.
		newString += text.substr( previousIndex );

		return newString;
	}
};

/*

TODO got to get the returnReader to have a number value instead of boolean
TODO get rid of run errors on doc generation. (load using json)
TODO allow for accessing parent element value changes.
TODO regular expressions!
TODO Look into making the objects stored so they can be referenced later and modified... (keep tabs on an object so tags are not required constantly).




// TODO scrapp all the other changes... basically... we are going to use function calls now to generate code. It will pass in the object and by matching will generate
// TODO Lauguage information.

 */

CodeDecorator.detectNewType( 'javascript',
	{
		tree :
		[
			{
				matches: /.*/,			// automatically goes into base scope no matter what.
				treeName: "baseScope",
				tree :
				[
					{
						matches:    ["var"],
						tick:       1,	// Pushes the value forward one
						storeValue: true,	// Store the next value (zero would be current).
						openScope:  true,	// Any objects that are created will appear in this object now.

						tree: [
							{
								matches: ["="],
								tree:    [
									{
										matches:    [/([0-9\.])/],
										storeValue: true,
										addType:    "number"
									},
									{
										matches: ["function"],
										//parent : 1,				// Pops back to the parent element temporally
										addType: "function",	// Adds the type "function" to the parent object.
										goto: "functionScope"	// Sends the reader to the tree with the name functionScope.
									},
									{
										matches:    [";"],
										closeScope: true,
										returnTree: 2			// Pops back two tree levels.
									}
								]
							}
						]
					},
					{
						matches:    ["function"],
						tick:       1,
						storeValue: true,
						openScope:  true,
						addType:    "function",
						closeScope:  true,
						treeName:   "functionScope",		// Allows plopping to different trees.
						tree:       [
							{
								matches: /\(/,
								openScope:  true,
								tree:    [
									{
										matches:    /[\w\d]+/,
										storeValue: true,
										openScope:  true,
										addType:    "argument",
										closeScope: true
									},
									{
										matches:    /\)/,
										closeScope : true,
										goto : "methodScope"
									}
								]
							}
						]
					}
				]
			},
			{
				treeName: "methodScope",
				tree:
				[
					{
						matches : /\{/,
						openScope : true,
						goto : "baseScope"
					},
					{
						// If found, means it is in a child object.
						matches : /\}/,
						closeScope : true,
						returnTree : 1
					}
				]
			},
		],
		/*
		tree:    {
			default :
			{
				findInScope : true
			},
			"//" :
			{
				tree :
				{
					"\n" :
					{
						returnReader : true
					}
				}
			},
			"{":        {
				openScope: true	// Starts inserting values into the current initObject.
			},
			"}":        {
				closeScope: true	// Closes the current initObject.
			},
			var:      {
				class: "vars",
				tree:  {
					default: {
						initObject: "variable",	// Create a new object to insert values into
						class : "name",
						tree :
						{
							"function" :
							{
								gotoStart : 2

							},
							";":
							{
								returnReader : true
							}
						},
						returnReader : true
					}
				}
			},
			function: {
				addValue : "func",
				tree:  {
					exclude : ["\n"],
					default: {
						initObject: "function",	// Create a new object to insert values into
						class : "name"
					},
					"(":     {
						openScope:  true,		// Starts inserting values into the current initObject.
						"tree": {
							exclude : ["\n",","],
							default: {
								addValue:    "argu"
							},
							")":     {
								closeScope:  true,
								returnReader: true
							}
						}
					},
					"{":     {
						openScope : true,
						returnReader: true
					}
				}
			}
		},
		value:   1,
		*/
		pattern: /([^\/\w\t]|[\/]{2}|[^\n\t\s\(\)\{\};,.]+)([ \t]*)/g
	} );