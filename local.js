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
/*
* renew favorites url
*/
function renewUrl(categories,sort){
   //localStorage.setItem(sort,"");
   var tmp = localStorage.getItem(sort);
   return "mgr.php?categories="+categories+"&sort=" + sort + "&store=" + tmp;
}
(function() {

        
        var app = angular.module('myApp', ['angularMoment']);
        app.controller('MainController', function ($scope, moment,$http){
            $scope.flag1 = false;
            $scope.flag2 = true;
            $scope.flag3 = true;
            $scope.flag4 = true;
            $scope.flagfav1 = true;
            $scope.flagfav2 = true;
            $scope.flagnav = false;
            $scope.flagpage = false;
			$scope.term = 0;
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
                   requestString = renewUrl(result['categories'],result['sort']);
				   //alert(requestString);
                   break;
                default:
                   //alert(result['categories']);
                   return 0;
                }
                $http.get(requestString).then(function (response) {
                    $scope.data = response.data.results;
					if($scope.data == null)
					{
						$scope.lists ="";
						$scope.pageList =[];
						return 0;
					}
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
				var result = {};
                result = getPara(requestString);
				           
                $http.get(requestString).then(function (response) {
                    $scope.detaildata = response.data.results;
					if(result["detail"]==1){
						$scope.flagfav1=false;
						$scope.flagfav2 = true;
						var date1 = new moment($scope.detaildata[0]["term_start"]);
						$scope.detaildata[0]["term_start"] = date1.format("MMM Do, YYYY");
						var date2 = new moment($scope.detaildata[0]["term_end"]);
						$scope.detaildata[0]["term_end"] = date2.format("MMM Do, YYYY");
						var now = moment();
						$scope.detaildata[0]["term"] = Math.round(100*(now.diff(date1, 'days')/date2.diff(date1, 'days')));
						var date3 = new moment($scope.detaildata[0]["birthday"]);
						$scope.detaildata[0]["birthday"] = date3.format("MMM Do, YYYY");
					}
					else{
						$scope.flagfav1=true; 
						$scope.flagfav2 = false;
						var date0 = new moment($scope.detaildata[0]["introduced_on"]);
						$scope.detaildata[0]["introduced_on"] = date0.format("MMM Do, YYYY");
					}  
                });
            }
			$scope.favorite = function(requestString,flagString){ //legislator bill committee
                var tmp="";
                tmp = localStorage.getItem(flagString);
                
                if(("."+flagString+requestString) == 'null' || ($("."+flagString+requestString).attr("class")).search("text-warning") !=-1)
                {
                    $("."+flagString+requestString).removeClass("text-warning");
                    if(tmp != null)
                    {
                        localStorage.setItem(flagString,tmp.replace('!!!'+requestString,''));
                    }
                    
                }else{
                    $("."+flagString+requestString).addClass("text-warning");
                    if(tmp == null)
                    {
                        localStorage.setItem(flagString,'!!!'+requestString);
                    }else
                    {
                        if(tmp.search(requestString) == -1)
                        {
                            localStorage.setItem(flagString,tmp + '!!!' + requestString);
                        }
                    }
                }
               
                //alert(localStorage.getItem(flagString));
                //alert(flagString);
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
            $scope.delStar = function(requestString,flagString){
                var tmp="";
                tmp = localStorage.getItem(flagString);
                tmp = tmp.replace("!!!"+requestString,"");
                localStorage.setItem(flagString,tmp);
				$scope.showList("mgr.php?categories=4&sort="+flagString);
                
            }
			$scope.showList('mgr.php?categories=1&sort=all');                                
        });          
    })();

