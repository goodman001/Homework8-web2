/*
*get url paras
*/
function getPara(urlString){
   var reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
   var res = {};
   var match;
   var key;
   var value;
   while (match = reg.exec(urlString)) {
      key = match[2];
      value = match[3] || '';
      res[key] = decodeURIComponent(value);
   };
   return res;
}
(function() {

        
        var app = angular.module('myApp', []);
        app.controller('FilesController', function ($scope, $sce, $http){
            $scope.files = [];
            $scope.flag1 = false;
            $scope.flag2 = true;
            $scope.flag3 = true;
            $scope.flag4 = true;
            $scope.flagfav1 = true;
            $scope.flagfav2 = true;
            $scope.flagnav = false;
            //$scope.title = new array();
            //$scope.flagpart1 = false;
            //$scope.flagpart2 = true;
            //$scope.flagpart3 = true;
            //$scope.flagpart4 = true;
            /*showlist
               categories= 1,2,3,4,5 
               category =1: sort=all,house,senate,statename
            */
            $scope.showList = function(requestString){
                
                $scope.flag1 = false;
                $scope.flag2 = true;
                $scope.flag3 = true;
                $scope.flag4 = true;
                var result = {};
                result = getPara(requestString);
                /*set rightmain hide or show*/
                switch(result['categories'])
                {
                case "1":
                   //alert("ddd"+result['categories']);
                   $scope.flag1 = false;
                   $scope.flag2 = true;
                   $scope.flag3 = true;
                   $scope.flag4 = true;
                  break;
                case "2":
                   $scope.flag1 = true;
                   $scope.flag2 = false;
                   $scope.flag3 = true;
                   $scope.flag4 = true;
                  break;
                case "3":
                   $scope.flag1 = true;
                   $scope.flag2 = true;
                   $scope.flag3 = false;
                   $scope.flag4 = true;
                  break;
                case "4":
                   $scope.flag1 = true;
                   $scope.flag2 = true;
                   $scope.flag3 = true;
                   $scope.flag4 = false;
                   break;
                default:
                   //alert(result['categories']);
                   return 0;
                }
                /*
                if(result['searchflag'] != undefined)
                {
                    //alert(result['searchflag']);
                    var invals = $scope.bioguide;
                    if(invals)
                    {
                        //alert("back?category="+result['category']+"&searchflag="+invals);
                        requestString = "back.php?category="+result['category']+"&searchflag="+invals;
                    }
                }*/
                $http.get(requestString).then(function (response) {
                    $scope.data = response.data.results;
                    if(result['categories']==1){
                            $scope.data.sort(function(a, b) {
                                var tmp1 = a.last_name.toUpperCase();
                                var tmp2 = b.last_name.toUpperCase();
                                return (tmp1 < tmp2) ? -1 : (tmp1 > tmp2) ? 1 : 0;
                            });
                    }
                    $scope.pageSize = 10;
                    $scope.pages = Math.ceil($scope.data.length / $scope.pageSize); //
                    $scope.newPages = $scope.pages > 10 ? 10 : $scope.pages;
                    $scope.pageList = [];
                    $scope.selPage = 1;
                    $scope.setData = function () {
                        $scope.lists = $scope.data.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));//
                    }
                    $scope.lists = $scope.data.slice(0, $scope.pageSize);

                    //
                    for (var i = 0; i < $scope.newPages; i++) {
                        $scope.pageList.push(i + 1);
                    }
                    
                    $scope.selectPage = function (page) {
                   
                        if (page < 1 || page > $scope.pages) return;
                        if (page >= 1) {
                            var newpageList = [];
                            for (var i = (page - 2) ; i < ((page + 8) > $scope.pages ? $scope.pages : (page + 8)) ; i++) {
                                if(i>=0){
                                   newpageList.push(i + 1);
                                }
                            }
                            $scope.pageList = newpageList;
                        }
                        
                        $scope.selPage = page;
                        $scope.setData();
                        $scope.isActivePage(page);
                        console.log("select page:" + page);
                    };
                    $scope.isActivePage = function (page) {
                        return $scope.selPage == page;
                    };
                    $scope.Previous = function () {
                        $scope.selectPage($scope.selPage - 1);
                    }
                    $scope.Next = function () {
                        $scope.selectPage($scope.selPage + 1);
                    };
                    });
            }    
            $scope.showDetail = function(requestString){
                $scope.flagfav1=false;
                $scope.flagfav2 = true;
                $http.get(requestString).then(function (response) {
                    $scope.detaildata = response.data.results; 
                });
            }  
            /**/
            /*
            *init
            */
            $scope.showList('mgr.php?categories=1&sort=all');
            
            $scope.doSomething = function(requestString){
                $scope.flag1 = false;
                $scope.flag2 = true;
                $scope.flag3 = true;
                $scope.flag4 = true;
                var result = {};
                result = getPara(requestString);
                if(result['searchflag'] != undefined)
                {
                    //alert(result['searchflag']);
                    var invals = $scope.bioguide;
                    if(invals)
                    {
                        //alert("back?category="+result['category']+"&searchflag="+invals);
                        requestString = "back.php?category="+result['category']+"&searchflag="+invals;
                    }
                }
                $http.get(requestString).then(function (response) {
                    $scope.data = response.data.results;
                    $scope.data.sort(function(a, b) {
                        var textA = a.last_name.toUpperCase();
                        var textB = b.last_name.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });
                    $scope.pageSize = 10;
                    $scope.pages = Math.ceil($scope.data.length / $scope.pageSize); //
                    $scope.newPages = $scope.pages > 10 ? 10 : $scope.pages;
                    $scope.pageList = [];
                    $scope.selPage = 1;
                    $scope.setData = function () {
                        $scope.items = $scope.data.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));//
                    }
                    $scope.items = $scope.data.slice(0, $scope.pageSize);

                    //
                    for (var i = 0; i < $scope.newPages; i++) {
                        $scope.pageList.push(i + 1);
                    }
                    
                    $scope.selectPage = function (page) {
                   
                        if (page < 1 || page > $scope.pages) return;
                        if (page >= 1) {
                            var newpageList = [];
                            for (var i = (page - 2) ; i < ((page + 8) > $scope.pages ? $scope.pages : (page + 8)) ; i++) {
                                if(i>=0){
                                   newpageList.push(i + 1);
                                }
                            }
                            $scope.pageList = newpageList;
                        }
                        
                        $scope.selPage = page;
                        $scope.setData();
                        $scope.isActivePage(page);
                        console.log("select page:" + page);
                    };
                    $scope.isActivePage = function (page) {
                        return $scope.selPage == page;
                    };
                    $scope.Previous = function () {
                        $scope.selectPage($scope.selPage - 1);
                    }
                    $scope.Next = function () {
                        $scope.selectPage($scope.selPage + 1);
                    };
                    });
            }
            $scope.detail_part1 = function(requestString){
                $scope.flagfav1=false;
                $scope.flagfav2 = true;
                $http.get(requestString).then(function (response) {
                    $scope.data_detail1 = response.data.results; 
                });
            }
            
            //$scope.doSomething('back.php?category=1');
            $scope.dobill= function(requestString){
                $scope.flag1 = true;
                $scope.flag2 = false;
                $scope.flag3 = true;
                $scope.flag4 = true;
                var reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
                var result = {};
                var match;
                var key;
                var value;
                while (match = reg.exec(requestString)) {
                    key = match[2];
                    value = match[3] || '';
                    result[key] = decodeURIComponent(value);
                }
                if(result['searchflag'] != undefined)
                {
                    var invals = $scope.bill;
                    if(invals)
                    {
                        requestString = "back.php?bill="+result['bill']+"&searchflag="+invals;
                    }
                }
                $http.get(requestString).then(function (response) {
                    $scope.data = response.data.results;
                    $scope.pageSize = 10;
                    $scope.pages = Math.ceil($scope.data.length / $scope.pageSize); 
                    $scope.newPages = $scope.pages > 10 ? 10 : $scope.pages;
                    $scope.pageList = [];
                    $scope.selPage = 1;
                    $scope.setData = function () {
                        $scope.billitems = $scope.data.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));
                    }
                    $scope.billitems = $scope.data.slice(0, $scope.pageSize);
                    for (var i = 0; i < $scope.newPages; i++) {
                        $scope.pageList.push(i + 1);
                    }
                    $scope.selectPage = function (page) {
                        if (page < 1 || page > $scope.pages) return;
                        if (page >= 1) {
                            var newpageList = [];
                            for (var i = (page - 2) ; i < ((page + 8) > $scope.pages ? $scope.pages : (page + 8)) ; i++) {
                                if(i>=0){
                                   newpageList.push(i + 1);
                                }
                            }
                            $scope.pageList = newpageList;
                        }
                        $scope.selPage = page;
                        $scope.setData();
                        $scope.isActivePage(page);
                        console.log("select page:" + page);
                    };
                    $scope.isActivePage = function (page) {
                        return $scope.selPage == page;
                    };
                    $scope.Previous = function () {
                        $scope.selectPage($scope.selPage - 1);
                    }
                    $scope.Next = function () {
                        $scope.selectPage($scope.selPage + 1);
                    };
                    });
            }
            $scope.detail_part2 = function(requestString){
                $scope.flagfav1=true;
                $scope.flagfav2 = false;
                $http.get(requestString).then(function (response) {
                    $scope.data_detail2 = response.data.results;                
                });
            }
            /*end bill*/
            $scope.doCom= function(requestString){
                $scope.flag1 = true;
                $scope.flag2 = true;
                $scope.flag3 = false;
                $scope.flag4 = true;
                var reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
                var result = {};
                var match;
                var key;
                var value;
                while (match = reg.exec(requestString)) {
                    key = match[2];
                    value = match[3] || '';
                    result[key] = decodeURIComponent(value);
                }
                if(result['searchflag'] != undefined)
                {
                    //alert(result['searchflag']);
                    var invals = $scope.com;
                    if(invals)
                    {
                        //alert("back?com="+result['com']+"&searchflag="+invals);
                        requestString = "back.php?com="+result['com']+"&searchflag="+invals;
                    }
                }
                $http.get(requestString).then(function (response) {
                    $scope.data = response.data.results;
                    $scope.pageSize = 10;
                    $scope.pages = Math.ceil($scope.data.length / $scope.pageSize);
                    $scope.newPages = $scope.pages > 10 ? 10 : $scope.pages;
                    $scope.pageList = [];
                    $scope.selPage = 1;
                    $scope.setData = function () {
                        $scope.comitems = $scope.data.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));
                    }
                    $scope.comitems = $scope.data.slice(0, $scope.pageSize);
                    for (var i = 0; i < $scope.newPages; i++) {
                        $scope.pageList.push(i + 1);
                    }
                    $scope.selectPage = function (page) {
                        if (page < 1 || page > $scope.pages) return;
                        if (page >= 1) {
                            var newpageList = [];
                            for (var i = (page - 2) ; i < ((page + 8) > $scope.pages ? $scope.pages : (page + 8)) ; i++) {
                                if(i>=0){
                                   newpageList.push(i + 1);
                                }
                            }
                            $scope.pageList = newpageList;
                        }
                        $scope.selPage = page;
                        $scope.setData();
                        $scope.isActivePage(page);
                        console.log("select page:" + page);
                    };
                    $scope.isActivePage = function (page) {
                        return $scope.selPage == page;
                    };
                    $scope.Previous = function () {
                        $scope.selectPage($scope.selPage - 1);
                    }
                    $scope.Next = function () {
                        $scope.selectPage($scope.selPage + 1);
                    };
                    });
            }
            $scope.detail_part3 = function(requestString){
                $http.get(requestString).then(function (response) {
                    $scope.data_detail3 = response.data.results;                
                });
            }
            /*end commit*/
            /*favorite add */
            $scope.favorite = function(requestString,flagString){ //bioguide bill committee
                var tmp="";
                tmp = localStorage.getItem(flagString);
                
                if(("."+flagString+requestString) == 'null' || ($("."+flagString+requestString).attr("class")).search("text-warning") !=-1)
                {
                    $("."+flagString+requestString).removeClass("text-warning");
                    if(tmp != null)
                    {
                        localStorage.setItem(flagString,tmp.replace('$$'+requestString,''));
                    }
                    
                }else{
                    $("."+flagString+requestString).addClass("text-warning");
                    if(tmp == null)
                    {
                        localStorage.setItem(flagString,'$$'+requestString);
                    }else
                    {
                        if(tmp.search(requestString) == -1)
                        {
                            localStorage.setItem(flagString,tmp + '$$' + requestString);
                        }
                    }
                }
               
                //alert(localStorage.getItem(flagString));
                //alert(flagString);
            }
            /*end favorite*/
            /*start favorite list*/
            $scope.doFav = function(requestString){
                $scope.flag1 = true;
                $scope.flag2 = true;
                $scope.flag3 = true;
                $scope.flag4 = false;
                var reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
                var result = {};
                var match;
                var key;
                var value;
                while (match = reg.exec(requestString)) {
                    key = match[2];
                    value = match[3] || '';
                    result[key] = decodeURIComponent(value);
                }
                var tmp = '';
                tmp = localStorage.getItem(result['fav'])
                requestString = "back.php?fav="+result['fav'] + "&content=" + tmp;
                //alert(requestString);
                //return 0;
                $http.get(requestString).then(function (response) {
                    $scope.data = response.data.results;
                    $scope.pageSize = 10;
                    $scope.pages = Math.ceil($scope.data.length / $scope.pageSize);
                    $scope.newPages = $scope.pages > 10 ? 10 : $scope.pages;
                    $scope.pageList = [];
                    $scope.selPage = 1;
                    $scope.setData = function () {
                        $scope.favitems = $scope.data.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));
                    }
                    $scope.favitems = $scope.data.slice(0, $scope.pageSize);
                    for (var i = 0; i < $scope.newPages; i++) {
                        $scope.pageList.push(i + 1);
                    }
                    $scope.selectPage = function (page) {
                        if (page < 1 || page > $scope.pages) return;
                        if (page >= 1) {
                            var newpageList = [];
                            for (var i = (page - 2) ; i < ((page + 8) > $scope.pages ? $scope.pages : (page + 8)) ; i++) {
                                if(i>=0){
                                   newpageList.push(i + 1);
                                }
                            }
                            $scope.pageList = newpageList;
                        }
                        $scope.selPage = page;
                        $scope.setData();
                        $scope.isActivePage(page);
                        console.log("select page:" + page);
                    };
                    $scope.isActivePage = function (page) {
                        return $scope.selPage == page;
                    };
                    $scope.Previous = function () {
                        $scope.selectPage($scope.selPage - 1);
                    }
                    $scope.Next = function () {
                        $scope.selectPage($scope.selPage + 1);
                    };
                    });
            }
            /*change*/
            $scope.changecolor = function(requestString){
                $("."+requestString).removeClass("text-warning");
            }
            $scope.doHidenav= function(requestString){
                //alert(requestString);
                if(requestString)
                {
                    $scope.flagnav = false;
                }else
                {
                    $scope.flagnav = true;
                }
            }
            /*change*/
            $scope.deletesome = function(requestString,flagString){
                var tmp="";
                tmp = localStorage.getItem(flagString);
                tmp = tmp.replace("$$"+requestString,"");
                localStorage.setItem(flagString,tmp);
                if(flagString == "bioguide" )
                {
                    $scope.doFav('back.php?fav=bioguide');
                }else if(flagString == "bill" )
                {
                    $scope.doFav('back.php?fav=bill');
                }
                else if(flagString == "committee" )
                {
                    $scope.doFav('back.php?fav=committee');
                }
            }
            
            
        });          
    })();

