'use strict';

/* Controllers */
function DocController($scope, $routeParams, $http, $route, $location, $anchorScroll, $window) {
	if($routeParams.lang == '' || typeof($routeParams.lang) == 'undefined') {
		$routeParams.lang = 'en';
	}
	if(typeof($routeParams.part1) == 'undefined') {
		$routeParams.part1 = 'home.md';
	}

	var page = $routeParams.lang + '/' + $routeParams.part1;

	if(typeof($routeParams.part2) != 'undefined') {
		page += '/' + $routeParams.part2;
	}

	if(typeof($routeParams.part3) != 'undefined') {
		page += '/' + $routeParams.part3;
	}

	if(typeof($routeParams.part4) != 'undefined') {
		page += '/' + $routeParams.part4;
	}

	$http.get('docs/' + page).success(function(data) {
		$scope.pageContent = data;
		/* point the edit to the original master, then you are prompted to fork if you don't have write access */
		$scope.sourceEdit = 'https://github.com/devXive/developer-docs/edit/master/docs/' + page;
	});
}
/* // Original menu controller
 function MenuController($scope, $http, $route) {
 $http.get('docs/menu.md').success(function(data) {
 $scope.menu = data;
 });
 }
 */
function MenuController($scope, $http, $route, $templateCache) {
	$scope.method = 'GET';
	// reference the official devXive repo
	$scope.commitUrl = 'https://api.github.com/repos/devXive/developer-docs/commits?path=docs';

	// get the commits that affect the docs path only
	$http({method: $scope.method, url: $scope.commitUrl, cache: $templateCache}).
		success(function(data, status) {
			$scope.status = status;
			$scope.commit = data;
			$scope.commitSha = [
				{}
			];
			$scope.treeDetails = [
				{}
			];
			$scope.treeJSONarray = [
				{}
			];

			var treeArray = [];

			$scope.count = 0;
			var treeJSON = {
				name: "",
				path: "",
				depth: 0
			};

			// regex for filtering and splitting paths and files
			var markdownCMSFiles = /^docs\/.{2}\/cms\/.*?md$/;
			var markdownFrameworkFiles = /^docs\/.{2}\/framework\/.*?md$/;
			var markdownIDEFiles = /^docs\/.{2}\/ide\/.*?md$/;
			var markdownServerFiles = /^docs\/.{2}\/server\/.*?md$/;

			var separatePath = /(.*)[\/\\]([^\/\\]+\.\w+)$/;
			var isOfficial = /^http\:\/\/developer\.docs\.devxive\.com/;

			// Utility variables used throughout the function
			var splitPath = "";
			var lastPath = "";
			var fileCounter = 0;
			var pathCounter = 0;
			var matchingPath = 0;
			var lastDepth = 0;
			var lastFolder = "";
			
			// Variable used to build the HTML tree
			var menuTreeHTML = "";

			// get the current url to see if we need to specify the repo name or not
			var currentURL = window.location.href;
//			console.log( $scope );
			// foreach loop to get the sha of the latest commit for the tree
			angular.forEach($scope.commit, function(value, key) {
				if($scope.count > 0) return;
				$scope.commitSha.push({sha: value});

				// Reference the official devXive repo
				$scope.treeUrl = 'https://api.github.com/repos/devXive/developer-docs/git/trees/' + value.sha + '?recursive=1';

				// get the tree details - unfortunately it is a flat tree, not nested with children, so we have to create the hierachy
				$http({method: $scope.method, url: $scope.treeUrl, cache: $templateCache}).
					success(function(data, status) {
						$scope.status = status;
						$scope.treeDetails = data;

						// only store the paths that begin with "docs/**/cms/" or "docs/**/framework" and ends with "md"
						angular.forEach($scope.treeDetails.tree, function(value, key) {
							if(
								value.path.match(markdownCMSFiles) != null |
								value.path.match(markdownFrameworkFiles) != null |
								value.path.match(markdownIDEFiles) != null |
								value.path.match(markdownServerFiles) != null
							) {
								// Get a list of paths
								var splitRoute = value.path.match(separatePath);

								if(splitRoute != null) {
									treeJSON.name = splitRoute[2];
									treeJSON.path = splitRoute[1].replace(/^docs\//, "");
									treeJSON.depth = treeJSON.path.split("/").length;
									// use angular.copy to de-reference treeJSON and create a new instance.
									// Otherwise you get an array full of the last value only
									$scope.treeJSONarray.push(angular.copy(treeJSON));

									// Override path
									var treePath = treeJSON.path; // treeJSON.path.replace(/^en\//, "");

									// Check if we have to create a treePath array or not
									if( treeArray[treePath] instanceof Array ) {
										// Is in array
									} else {
										// Is not in array
										var obj = {};
										obj[treePath] = "";
										
										treeArray[treePath] = [];
									}

									// Push treeJSON Object to treePath array
									treeArray[treePath].push( angular.copy(treeJSON) );
								}
								fileCounter++;
							}
						});

						// Open List Menu
						menuTreeHTML += '<ul class="list-group">';

						// Insert home at top of the menu tree
						menuTreeHTML += '<li class="list-group-item"><a href="/developer-docs/#/en/home.md" title="Home">Home</a></li>';

						// Iterate through treeArray to build the list groups
						for( var i in treeArray ) {
							// Set vars
							var treeBuild = i.split("/");
							var treeLength = treeBuild.length;
							var treeCount = i.length;

							var langFolder = treeBuild[0];
							var picUrl = ( langFolder === 'de' ) ? '<span class="pull-right"><img src="http://images.apple.com/global/elements/flags/16x16/germany.png" /></span>' : '<span class="pull-right"><img src="http://images.apple.com/global/elements/flags/16x16/united_kingdom.png" /></span>'

							// Build and open submenu if necessary
							if( treeLength > 2 ) {
								menuTreeHTML += '<li class="list-group-item"><label class="tree-toggler">' + treeBuild[1].toUpperCase() + '</label><span class="badge">' + treeCount +'</span>';
								menuTreeHTML += '<ul class="nav nav-pills nav-stacked tree">';
							}
							
							// Iterate through the given treeArray[i]
							angular.forEach(treeArray[i], function(value, key) {
								var linkName = value.name.replace(/\.md$/, "").charAt(0).toUpperCase() + value.name.replace(/\.md$/, "").slice(1).toLowerCase();
								var linkUrl = '/developer-docs/#/' + value.path + '/' + value.name;
								menuTreeHTML += '<li><a href="' + linkUrl + '">' + linkName + '</a></li>';

								console.log( value );
							});
							
							// Build and close submenu if necessary
							if( treeLength > 2 ) {
								menuTreeHTML += '</ul>';
								menuTreeHTML += '</li>';
							}

							console.log( '--------------' + i + '--------------');
						}

						// Open List Menu
						menuTreeHTML += '</ul>';

						console.log( treeArray );
//						console.log( $scope.treeJSONarray );

						// build the html menu tree
						angular.forEach($scope.treeJSONarray, function(value, key) {
							console.log( value );
							// insert home to the top of the tree
							if(homeMenuLink === "undefined") {
								var homeMenuLink = "";
//								menuTreeHTML += '<ul class="list-group"><li class="list-group-item"><a href="/developer-docs/#/en/home.md" title="Home">Home</a></li>';
							}

							if(key == 2) {
								lastFolder = $scope.treeJSONarray[key].path.split("/");
//								menuTreeHTML += '<li class="list-group-item"><label class="tree-toggler">' + lastFolder[lastFolder.length-1].toUpperCase() + '</label><ul class="nav nav-pills nav-stacked tree">';
								if(currentURL.match(isOfficial)) {
//									menuTreeHTML += '<li><a href="/#/' + $scope.treeJSONarray[key].path + '/' + $scope.treeJSONarray[key].name + '" title="' + $scope.treeJSONarray[key].name + '">' + linkName + '</a></li>';										
								}
								else {
//									menuTreeHTML += '<li><a href="/developer-docs/#/' + $scope.treeJSONarray[key].path + '/' + $scope.treeJSONarray[key].name + '" title="' + $scope.treeJSONarray[key].name + '">' + linkName + '</a></li>';											
								}
							}
							else {
								if($scope.treeJSONarray[key].depth > lastDepth) {
									lastFolder = $scope.treeJSONarray[key].path.split("/");
//									menuTreeHTML += '<li class="list-group-item"><label class="tree-toggler">' + lastFolder[$scope.treeJSONarray[key].depth-1].toUpperCase() + '</label><ul class="nav nav-pills nav-stacked tree">';
									if(currentURL.match(isOfficial)) {
//										menuTreeHTML += '<li><a href="/#/' + $scope.treeJSONarray[key].path + '/' + $scope.treeJSONarray[key].name + '" title="' + $scope.treeJSONarray[key].name + '">' + $scope.treeJSONarray[key].name.replace(/\.md$/, "") + '</a></li>';										
									}
									else {
//										menuTreeHTML += '<li><a href="/developer-docs/#/' + $scope.treeJSONarray[key].path + '/' + $scope.treeJSONarray[key].name + '" title="' + $scope.treeJSONarray[key].name + '">' + $scope.treeJSONarray[key].name.replace(/\.md$/, "") + '</a></li>';											
									}
								}
								if($scope.treeJSONarray[key].depth == lastDepth) {
									lastFolder = $scope.treeJSONarray[key].path.split("/");
									if(currentURL.match(isOfficial)) {
//										menuTreeHTML += '<li><a href="/#/' + $scope.treeJSONarray[key].path + '/' + $scope.treeJSONarray[key].name + '" title="' + $scope.treeJSONarray[key].name + '">' + $scope.treeJSONarray[key].name.replace(/\.md$/, "") + '</a></li>';										
									}
									else {
//										menuTreeHTML += '<li class="list-group-item"><a href="/developer-docs/#/' + $scope.treeJSONarray[key].path + '/' + $scope.treeJSONarray[key].name + '" title="' + $scope.treeJSONarray[key].name + '">' + $scope.treeJSONarray[key].name.replace(/\.md$/, "") + '</a></li>';											
									}
//									menuTreeHTML += '</li>';
								}
								else if($scope.treeJSONarray[key].depth < lastDepth) {
//									menuTreeHTML += '</ul>';
									if($scope.treeJSONarray[key].depth == 2) {
										lastFolder = $scope.treeJSONarray[key].path.split("/");
										if(lastFolder[1] != $scope.treeJSONarray[key - 1].path.split("/")[1]) {
//											menuTreeHTML += '</ul>';
//											menuTreeHTML += '<li><label class="tree-toggler">' + lastFolder[$scope.treeJSONarray[key].depth-1].toUpperCase() + '</label><ul class="nav nav-list tree">';
										}
										if(currentURL.match(isOfficial)) {
//											menuTreeHTML += '<li><a href="/#/' + $scope.treeJSONarray[key].path + '/' + $scope.treeJSONarray[key].name + '" title="' + $scope.treeJSONarray[key].name + '">' + $scope.treeJSONarray[key].name.replace(/\.md$/, "") + '</a></li>';										
										}
										else {
//											menuTreeHTML += '<li><a href="/developer-docs/#/' + $scope.treeJSONarray[key].path + '/' + $scope.treeJSONarray[key].name + '" title="' + $scope.treeJSONarray[key].name + '">' + $scope.treeJSONarray[key].name.replace(/\.md$/, "") + '</a></li>';											
										}
//										menuTreeHTML += '</li>';
									}
								}
							}
							if(key == $scope.treeJSONarray.length) {
//								menuTreeHTML += '</ul></ul>';
							}
							lastDepth = $scope.treeJSONarray[key].depth;
						});
						$scope.treeJSONarray = menuTreeHTML;
					}).
					error(function(data, status) {
						$scope.treeDetails = data || "Request failed";
						$scope.status = status;
					});
				$scope.count++;
			});
		}).
		error(function(data, status) {
			$scope.commit = data || "Request failed";
			$scope.status = status;
		});
} // end of menuController
