// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('trackr', ['ionic']).run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			// Don't remove this line unless you know what you are doing. It stops the viewport
			// from snapping when text inputs are focused. Ionic handles this internally for
			// a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
}).factory('Projects', function() {
	return {
		all : function() {
			var projectString = window.localStorage['projects'];
			if (projectString) {
				return angular.fromJson(projectString);
			}
			return [];
		},
		save : function(projects) {
			window.localStorage['projects'] = angular.toJson(projects);
		},
		newProject : function(projectTitle) {
			// Add a new project
			return {
				title : projectTitle,
				tasks : []
			};
		},
		getLastActiveIndex : function() {
			return parseInt(window.localStorage['lastActiveProject']) || 0;
		},
		setLastActiveIndex : function(index) {
			window.localStorage['lastActiveProject'] = index;
		}
	}
}).controller('TodoCtrl', function($scope, $timeout, $ionicModal, $ionicSideMenuDelegate, Projects) {

	// A utility function for creating a new project
	// with the given projectTitle
	var createProject = function(projectTitle) {
		var newProject = Projects.newProject(projectTitle);
		$scope.projects.push(newProject);
		Projects.save($scope.projects);
		$scope.selectProject(newProject, $scope.projects.length - 1);
		$scope.projectModal.hide();
	}
	// Load or initialize projects
	$scope.projects = Projects.all();

	// Grab the last active, or the first project
	$scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

	$scope.showProjectModal = function() {
		$scope.projectModal.show();
	};

	// Called to create a new project
	$scope.newProject = function(project) {
		//var projectTitle = prompt('Project name');
		var projectTitle = project.title;
		if (projectTitle) {
			createProject(projectTitle);
		}
	};

	// Called to select the given project
	$scope.selectProject = function(project, index) {
		$scope.activeProject = project;
		Projects.setLastActiveIndex(index);
		// $scope.sideMenuController.close();
		$ionicSideMenuDelegate.toggleRight();
	};
	// Create our modal
	$ionicModal.fromTemplateUrl('new-task.html', function(modal) {
		$scope.taskModal = modal;
	}, {
		scope : $scope
	});
	$ionicModal.fromTemplateUrl('new-project.html', function(modal) {
		$scope.projectModal = modal;
	}, {
		scope : $scope
	});

	$scope.createTask = function(task) {
		if (!$scope.activeProject || !task) {
			return;
		}
		$scope.activeProject.tasks.push({
			title : task.title,
			time : task.time
		});
		$scope.taskModal.hide();

		// Inefficient, but save all the projects
		Projects.save($scope.projects);

		task.title = "";
	};

	$scope.newTask = function() {
		$scope.taskModal.show();
	};

	$scope.closeNewTask = function() {
		$scope.taskModal.hide();
	}

	$scope.closeNewProject = function() {
		$scope.projectModal.hide();
	}

	$scope.toggleProjects = function() {
		//console.log("---------------------------");
		//console.log($scope);
		//$scope.sideMenuController.toggleLeft();
		$ionicSideMenuDelegate.toggleLeft();
	};

	// Try to create the first project, make sure to defer
	// this by using $timeout so everything is initialized
	// properly
	$timeout(function() {
		if ($scope.projects.length == 0) {
			//while(true) {
			$scope.projectModal.show();
			//var projectTitle = prompt('Your first project title:');
			//if(projectTitle) {
			//createProject(projectTitle);
			//break;
			//}
			//}
		}
	});
});
