

(function () {


    var app = angular.module('app', ['ngRoute', 'angular-jwt']);
    app.run(function ($http, $rootScope, $location, $window) {

        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.localStorage.token;

        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {

            if (nextRoute.access.restricted !== undefined && nextRoute.access.restricted === true && !$window.localStorage.token) {
                event.preventDefault();
                $location.path('/login');
            }
            if ($window.localStorage.token && nextRoute.access.restricted === true) {
                $http.post('/api/verify', {
                        token: $window.localStorage.token
                    })
                    .then(function (response) {
                        console.log('Token is valid')
                    }, function (err) {
                        delete $window.localStorage.token;
                        $location.path('/login');
                    })
            }

        });
    });

    
    
    
    app.config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider.when('/', {
            templateUrl: './views/main.html',
            controller: 'MainController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });


        $routeProvider.when('/login', {
            templateUrl: './views/login.html',
            controller: 'LoginController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });


        $routeProvider.when('/register', {
            templateUrl: './views/register.html',
            controller: 'RegisterController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        $routeProvider.when('/polls', {
            templateUrl: './views/polls.html',
            controller: 'PollsController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        $routeProvider.when('/polls/:id', {
            templateUrl: './views/poll.html',
            controller: 'PollsController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });
        
          $routeProvider.when('/polls/:id/update', {
            templateUrl: './views/update.html',
            controller: 'PollsController',
            controllerAs: 'vm',
            access: {
                restricted: false
            }
        });

        $routeProvider.when('/profile', {
            templateUrl: './views/profile.html',
            controller: 'ProfileController',
            controllerAs: 'vm',
            access: {
                restricted: true
            }
        });
        $routeProvider.when('/result', {
            templateUrl: './views/result.html',
            controller: 'PollsController',
            controllerAs: 'vm',
            access: {
                restricted: true
            }
        });

        $routeProvider.otherwise('/');

    });
    //controllers
    
    
    app.controller('UpdateController', UpdateController);
    
    function UpdateController($location,$window) {
        var vm = this;
        vm.title = 'UpdateController';
        
       
    }
    
    
    
    app.controller('MainController', MainController);

    function MainController($location, $window) {
        var vm = this;
        vm.title = 'Make Votes Matter';
        
        vm.searchContent = '';
        
        
        
        
        
        vm.warning = function() {
            alert('Ensure you are logged in to view polls');
        }
        
    }

    app.controller('LoginController', LoginController);

    function LoginController($location, $window, $http) {
        var vm = this;
        vm.title = 'Login or Sign Up';
        vm.error;

        vm.signUp = function() {
            $location.path('/register');
        }
        
        vm.login = function () {
            if (vm.user) {
                $http.post('/api/login', vm.user)
                    .then(function (response) {
                        $window.localStorage.token = response.data;
                        $location.path('/profile');
                    }, function (err) {
                        vm.error = 'Incorrect Credentials Supplied';
                    })
            } else {
                console.log("No credentials supplied");
            }
        }

    }
    //Register Controller
    app.controller('RegisterController', RegisterController);

    function RegisterController($location, $window, $http) {
        var vm = this;
        vm.title = 'Register';
        vm.error;
        vm.register = function () {

            if (!vm.user) {
                alert("Invalid Credentials");
                return;
            }
            $http.post('/api/register', vm.user)
                .then(function (response) {

                    $window.localStorage.token = response.data;
                    $location.path('/profile');
                }, function (err) {
                    vm.error = err.data.errmsg;
                })
        }
    }
    //profile controller
    app.controller('ProfileController', ProfileController);

    function ProfileController($location, $window, jwtHelper) {
        var vm = this;
        vm.title = 'Profile';
        vm.user;
        var token = $window.localStorage.token;
        var payload = jwtHelper.decodeToken(token).data;
        if (payload) {
            vm.user = payload;
        }
        vm.logOut = function () {

            delete $window.localStorage.token;
            vm.user = null;
            $location.path('/login');
        }
        
        vm.goToPolls = function() {
            $location.path('/polls');
        }
    }

    app.controller('PollsController', PollsController);

    function PollsController($location, $window, $http, jwtHelper) {
        var vm = this;
        var user = jwtHelper.decodeToken($window.localStorage.token);
        console.log(user.data._id);
        var id = user.data._id;
        var url = window.location.toString();
        var updatedVote;
      
        vm.param = parseInt(url.charAt(url.length - 1));
        vm.enabledRadioButton = false;
        
        //start of random id function
    
      
         vm.goToProfile = function() {
            $location.path('/profile');
        }
           vm.goToPolls = function() {
            $location.path('/polls');
        }
        
        /*vm.generateUniquePollId = function() {
          var randomNumber = Math.floor((Math.random() * 10000000) + 1).toString();
          var timestamp = new Date().getUTCMilliseconds().toString();
            pollNumberId = randomNumber + timestamp;
            console.log(pollNumberId);
            return;
        }*/
        
    
      
        //var id = user.data._id;
        vm.title = 'Poll List';
      
        vm.polls = []
        vm.poll = {
            options: [],
            name: '',
            user: id
          
            
        }
     

        vm.poll.options = [{
                name: '',
                votes: 0
            }
           ]
        vm.addOption = function () {
            vm.poll.options.push({
                name: '',
                votes: 0
                
            });

        }
        
        
        vm.getAllPolls = function() {
            $http.get('/api/polls')
            .then(function(res) {
                vm.polls = res.data;
                
            }, function(err) {
                console.log(err);
            })
        }
        
        vm.getAllPolls();
        
        
        
        vm.removeOption = function () {
            vm.poll.options.pop();
        }

        vm.addPoll = function () {
            if (!vm.poll) {
                console.log("Invalid data supplied");
                return;
            }
            console.log("this is the poll" + vm.poll)
            $http.post('/api/polls', vm.poll)
                .then(function (res) {
                vm.poll = {};
                vm.getAllPolls();
              
                    console.log(res);
                }, function (err) {
                    console.log(err);
                });
        }
        
      
        
          vm.voteIncrease = function(opNum) {
        
              
    var  newNum =   vm.polls[vm.param].options[opNum].votes++;

    console.log(vm.polls[vm.param].options[opNum].votes);
             
         
    updatedVote =  vm.poll.options[0].votes = newNum + 1;      
                
            
      
                    
           
              $http.put('/api/update', vm.polls[vm.param])
                    .then(function (response) {
                    console.log(url)
                   
                 var str = url.substring(url.length -7, url.length);
                  console.log("this is str " + str);
                  
                       $location.path(str + '/update');
                   
                    }, function (err) {
                        vm.error = err;
                        
                    })
              
              
        
        }
          //////////////////////////
          //google chart api data//
          /////////////////////////
          vm.pie = function() {
          vm.a = function() {
            $http.get('/api/update')
            .then(function(res) {
                
                let chartInfo = res.data;
                vm.chartName = chartInfo.name;
                vm.chartOptions = chartInfo.options;
                console.log("here it is" + chartInfo.name);
              
                
            }, function(err) {
                console.log(err);
            })
          }
          
          
          setTimeout(function(){
                google.charts.load('current', {'packages':['corechart']});
  
        
      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);
      
 
          },800);
      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {
          
         //3d button
          
         
    
          
          
          
          
          let optionsArray =[];
         let chartName = document.getElementById('chartName').innerHTML;
       let listLi = document.querySelectorAll(".chartOptionsList li");
          let names = document.getElementsByClassName('listItemName');
          let votes = document.getElementsByClassName('listItemVotes');
          let arr = [];
         for(var i=0; i< listLi.length; i++){
             var op  = [];
        let optionName = names[i].innerHTML;
        let optionVotes = parseInt(votes[i].innerHTML);
             op.push(optionName);
           
             op.push(optionVotes);
         arr.push(op);
             
             
}
          console.log(arr)
        
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'opName');
       data.addColumn('number', 'Votes');
        data.addRows(arr
            //[
          //[op1, 3],
          //['OptionTwo', 1],
          //['OptionThree', 1],
          //['OptionFour', 1],
          //['OptionFive', 2]
        //]
        );

       
        // Set chart options
        var options = {'title':chartName,
                      
                         titleTextStyle: {
                         color: '#FBBE01',    // any HTML string color ('red', '#cc00cc')
                         fontName: 'Arial',
                         
                         fontSize: 50, // 12, 18 whatever you want (don't specify px)
                         bold: true    // true or false
                         },
                       legend: {textStyle:  {fontSize: 36}},
                       is3D: true,
                          animation: {
                       duration: 1000,
                       easing: 'out',
                       startup: true
                       },
                       backgroundColor: { fill:'transparent' },
                       'width':1550,
                       'height':600
                      };

          
          
          
          
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chartContainer'));
        chart.draw(data, options);
         
      }
          }
        vm.pie();
        
        
        ////barchart
        
            vm.bar = function () {
          vm.a = function() {
            $http.get('/api/update')
            .then(function(res) {
                
                let chartInfo = res.data;
                vm.chartName = chartInfo.name;
                vm.chartOptions = chartInfo.options;
                console.log("here it is" + chartInfo.name);
              
                
            }, function(err) {
                console.log(err);
            })
          }
          
          
          
                google.charts.load('current', {'packages':['corechart']});
  
        
      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);
      
 
      
      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {
          
         //3d button
          
         
    
          
          
          
          
          let optionsArray =[];
         let chartName = document.getElementById('chartName').innerHTML;
       let listLi = document.querySelectorAll(".chartOptionsList li");
          let names = document.getElementsByClassName('listItemName');
          let votes = document.getElementsByClassName('listItemVotes');
          let arr = [];
         for(var i=0; i< listLi.length; i++){
             var op  = [];
        let optionName = names[i].innerHTML;
        let optionVotes = parseInt(votes[i].innerHTML);
             op.push(optionName);
           
             op.push(optionVotes);
         arr.push(op);
             
             
}
          console.log(arr)
        
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'opName');
       data.addColumn('number', 'Votes');
        data.addRows(arr
            //[
          //[op1, 3],
          //['OptionTwo', 1],
          //['OptionThree', 1],
          //['OptionFour', 1],
          //['OptionFive', 2]
        //]
        );

       
        // Set chart options
        var options = {'title':chartName,
                      
                         titleTextStyle: {
                         color: '#FBBE01',    // any HTML string color ('red', '#cc00cc')
                         fontName: 'Arial',
                         
                         fontSize: 50, // 12, 18 whatever you want (don't specify px)
                         bold: true    // true or false
                         },
                       legend: {textStyle:  {fontSize: 26}},
                       is3D: true,
                      animation: {
                      duration: 1000,
                      easing: 'out',
                      startup: true
                       },
                       backgroundColor: { fill:'transparent' },
                       'width':1500,
                       'height':600
                      };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById('chartContainer'));
        chart.draw(data, options);
         
      }
          }
        
                ////columnchart
        
            vm.column = function () {
          vm.a = function() {
            $http.get('/api/update')
            .then(function(res) {
                
                let chartInfo = res.data;
                vm.chartName = chartInfo.name;
                vm.chartOptions = chartInfo.options;
                console.log("here it is" + chartInfo.name);
              
                
            }, function(err) {
                console.log(err);
            })
          }
          
          
          
                google.charts.load('current', {'packages':['corechart']});
  
        
      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);
      
 
      
      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {
          
         //3d button
          
         
    
          
          
          
          
          let optionsArray =[];
         let chartName = document.getElementById('chartName').innerHTML;
       let listLi = document.querySelectorAll(".chartOptionsList li");
          let names = document.getElementsByClassName('listItemName');
          let votes = document.getElementsByClassName('listItemVotes');
          let arr = [];
         for(var i=0; i< listLi.length; i++){
             var op  = [];
        let optionName = names[i].innerHTML;
        let optionVotes = parseInt(votes[i].innerHTML);
             op.push(optionName);
           
             op.push(optionVotes);
         arr.push(op);
             
             
}
          console.log(arr)
        
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'opName');
       data.addColumn('number', 'Votes');
        data.addRows(arr
            //[
          //[op1, 3],
          //['OptionTwo', 1],
          //['OptionThree', 1],
          //['OptionFour', 1],
          //['OptionFive', 2]
        //]
        );

       
        // Set chart options
        var options = {'title':chartName,
                      
                         titleTextStyle: {
                         color: '#FBBE01',    // any HTML string color ('red', '#cc00cc')
                         fontName: 'Arial',
                         
                         fontSize: 50, // 12, 18 whatever you want (don't specify px)
                         bold: true    // true or false
                         },
                       legend: {textStyle:  {fontSize: 26}},
                       is3D: true,
                      animation: {
                       duration: 1000,
                       easing: 'out',
                       startup: true
                        },
                       backgroundColor: { fill:'transparent' },
                       'width':1500,
                       'height':600
                      };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('chartContainer'));
        chart.draw(data, options);
         
      }
          }
            
            //scatter chart
            vm.scatter = function () {
          vm.a = function() {
            $http.get('/api/update')
            .then(function(res) {
                
                let chartInfo = res.data;
                vm.chartName = chartInfo.name;
                vm.chartOptions = chartInfo.options;
                console.log("here it is" + chartInfo.name);
              
                
            }, function(err) {
                console.log(err);
            })
          }
          
          
          
                google.charts.load('current', {'packages':['corechart']});
  
        
      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);
      
 
      
      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {
          
         //3d button
          
         
    
          
          
          
          
          let optionsArray =[];
         let chartName = document.getElementById('chartName').innerHTML;
       let listLi = document.querySelectorAll(".chartOptionsList li");
          let names = document.getElementsByClassName('listItemName');
          let votes = document.getElementsByClassName('listItemVotes');
          let arr = [];
         for(var i=0; i< listLi.length; i++){
             var op  = [];
        let optionName = names[i].innerHTML;
        let optionVotes = parseInt(votes[i].innerHTML);
             op.push(optionName);
           
             op.push(optionVotes);
         arr.push(op);
             
             
}
          console.log(arr)
        
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'opName');
       data.addColumn('number', 'Votes');
        data.addRows(arr
            //[
          //[op1, 3],
          //['OptionTwo', 1],
          //['OptionThree', 1],
          //['OptionFour', 1],
          //['OptionFive', 2]
        //]
        );

       
        // Set chart options
        var options = {'title':chartName,
                      
                         titleTextStyle: {
                         color: '#FBBE01',    // any HTML string color ('red', '#cc00cc')
                         fontName: 'Arial',
                         
                         fontSize: 50, // 12, 18 whatever you want (don't specify px)
                         bold: true    // true or false
                         },
                       legend: {textStyle:  {fontSize: 26}},
                       is3D: true,
                       pointShape: 'triangle',
                       pointSize: 18,
                      animation: {
                       duration: 1000,
                       easing: 'inAndOut',
                       startup: true
                        },
                       backgroundColor: { fill:'transparent' },
                       'width':1500,
                       'height':600
                      };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ScatterChart(document.getElementById('chartContainer'));
        chart.draw(data, options);
         
      }
          }
            
                        //area chart
            vm.area = function () {
          vm.a = function() {
            $http.get('/api/update')
            .then(function(res) {
                
                let chartInfo = res.data;
                vm.chartName = chartInfo.name;
                vm.chartOptions = chartInfo.options;
                console.log("here it is" + chartInfo.name);
              
                
            }, function(err) {
                console.log(err);
            })
          }
          
          
          
                google.charts.load('current', {'packages':['corechart']});
  
        
      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);
      
 
      
      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {
          
         //3d button
          
         
    
          
          
          
          
          let optionsArray =[];
         let chartName = document.getElementById('chartName').innerHTML;
       let listLi = document.querySelectorAll(".chartOptionsList li");
          let names = document.getElementsByClassName('listItemName');
          let votes = document.getElementsByClassName('listItemVotes');
          let arr = [];
         for(var i=0; i< listLi.length; i++){
             var op  = [];
        let optionName = names[i].innerHTML;
        let optionVotes = parseInt(votes[i].innerHTML);
             op.push(optionName);
           
             op.push(optionVotes);
         arr.push(op);
             
             
}
          console.log(arr)
        
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'opName');
       data.addColumn('number', 'Votes');
        data.addRows(arr
            //[
          //[op1, 3],
          //['OptionTwo', 1],
          //['OptionThree', 1],
          //['OptionFour', 1],
          //['OptionFive', 2]
        //]
        );

       
        // Set chart options
        var options = {'title':chartName,
                      
                         titleTextStyle: {
                         color: '#FBBE01',    // any HTML string color ('red', '#cc00cc')
                         fontName: 'Arial',
                         
                         fontSize: 50, // 12, 18 whatever you want (don't specify px)
                         bold: true    // true or false
                         },
                       legend: {textStyle:  {fontSize: 26}},
                       is3D: true,
                       pointShape: 'star',
                       pointSize: 18,
                      animation: {
                       duration: 1000,
                       easing: 'inAndOut',
                       startup: true
                        },
                       backgroundColor: { fill:'transparent' },
                       'width':1500,
                       'height':600
                      };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.AreaChart(document.getElementById('chartContainer'));
        chart.draw(data, options);
         
      }
          }    
          ////////////////////////
          //end of google charts//
          ///////////////////////

    }


    




    app.controller('PollController', PollController);

    function PollController($location, $window, $http) {
        var vm = this;
        vm.title = 'PollController';

        $http.get('/api/poll')
            .then(function(res) {
            
            console.log(res);
        }, function(err) {
            console.log(err);
        })
                 
        

    }


}());
