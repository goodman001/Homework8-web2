<?php
$categories = '';
$sort = '';
$search = '';
$categories = $_GET["categories"];
$sort = $_GET["sort"];
$search = $_GET["search"];
$detail = $_GET["detail"];
$ids = $_GET["ids"];
$res = '';
$url = '';
switch ($categories)
{
case '1':
  if($sort == 'all')
  {
	  $url='https://congress.api.sunlightfoundation.com/legislators?fields=party,chamber,district,state,bioguide_id,last_name,first_name&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';
  }else if($sort == 'house')
  {
	if($search != "")
    {
       $url='https://congress.api.sunlightfoundation.com/legislators?fields=party,chamber,district,state,bioguide_id,last_name,first_name&chamber='.$sort.'&query='.$search.'&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';
    }else
    {
       $url='https://congress.api.sunlightfoundation.com/legislators?fields=party,chamber,district,state,bioguide_id,last_name,first_name&chamber='.$sort.'&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';
    }
  }else if($sort == 'senate')
  {
    if($searchflag !="")
    {
       $url='https://congress.api.sunlightfoundation.com/legislators?fields=party,chamber,district,state,bioguide_id,last_name,first_name&chamber='.$sort.'&query='.$search.'&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';
    }
    else
	{
       $url='https://congress.api.sunlightfoundation.com/legislators?fields=party,chamber,district,state,bioguide_id,last_name,first_name&chamber='.$sort.'&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';
	}
  }else if(!empty($sort))
  {
	  $url='https://congress.api.sunlightfoundation.com/legislators?fields=party,chamber,district,state,bioguide_id,last_name,first_name&state_name='.$sort.'&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';
  }
  break;  
case '2':
  if(!empty($sort))
  {
	  if($search != "")
      {
         $url='https://congress.api.sunlightfoundation.com/bills/search?fields=bill_id,chamber,bill_type,sponsor,introduced_on&history.active='.$sort.'&query="'.$search.'"&per_page=25&apikey=542bae46d15c4c5c99bb423075fda3a7';
      }
      else
      {
         $url='https://congress.api.sunlightfoundation.com/bills?fields=bill_id,chamber,bill_type,sponsor,introduced_on&history.active='.$sort.'&per_page=25&apikey=542bae46d15c4c5c99bb423075fda3a7';
      }
  }
  break;
case '3':
  if(!empty($sort))
  {
   if($search !="")
    {
       $url='https://congress.api.sunlightfoundation.com/committees?fields=chamber,committee_id,name,parent_committee_id&chamber='.$sort.'&query='.$searchflag.'&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';
    }else{
        $url='https://congress.api.sunlightfoundation.com/committees?fields=chamber,committee_id,name,parent_committee_id&chamber='.$sort.'&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';
    }
  }
  break;
case '4':
  
  break;
default:
  
}
if($detail == "1" && $ids != '')
{
	$url='https://congress.api.sunlightfoundation.com/legislators?fields=bioguide_id,title,first_name,last_name,oc_email,chamber,phone,party,term_start,term_end,office,state_name,fax,birthday,twitter_id,facebook_id,contact_form&bioguide_id='.$ids.'&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';
    $html=file_get_contents($url);
    $array1 = json_decode($html, true);
    /*get date*/
    $birthday = strtotime($array1['results'][0]['birthday']);
    $term_start = strtotime($array1['results'][0]['term_start']);
    $term_end = strtotime($array1['results'][0]['term_end']);
    $now = time();
    $days=intval(round($now-$term_start)/round($term_end-$term_start)*100);
    //echo $days;
    //var_dump($array1['results'][0]['birthday']);
    

    //$urlbill='https://congress.api.sunlightfoundation.com/bills?fields=last_version.urls.pdf&sponsor.bioguide_id='.$bioguide_id.'&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';

    $urlbill='https://congress.api.sunlightfoundation.com/bills?fields=bill_id,official_title,chamber,bill_type,congress,last_version.urls.pdf&sponsor.bioguide_id='.$ids.'&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';
    $html=file_get_contents($urlbill);
    $array2 = json_decode($html, true);
    //var_dump($array2['results'][0]['last_version']);
    $flag = count($array2['results']);
    if($flag >5)
    {
        $flag =5;
    }
    $arrbill = [];
    for($i=0;$i<$flag;$i++)
    {
        $arrbill[$i] = ["bill_id" => $array2['results'][$i]['bill_id'],"official_title"=>$array2['results'][$i]['official_title'],"chamber"=>$array2['results'][$i]['chamber'],"bill_type" => $array2['results'][$i]['bill_type'],"congress" => $array2['results'][$i]['congress'],"pdf"=>$array2['results'][$i]['last_version']['urls']['pdf']];
    }
    /* Get commit*/
    $urlcom='https://congress.api.sunlightfoundation.com/committees?fields=committee_id,name,chamber&member_ids='.$ids.'&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';
    $html=file_get_contents($urlcom);
    $array3 = json_decode($html, true);
    $flag = count($array3['results']);
    if($flag >5)
    {
       $flag = 5;
    } 
    $arrcom = [];
    for($i=0;$i<$flag;$i++)
    {
        $arrcom[$i] = $array3['results'][$i];
    }
    //var_dump($array3['results']);
    //if()
    //echo strtotime($array1['results'][0]['birthday']);
    $array1['results'][0]['term'] = $days;
    $array1['results'][0]['birthday'] = date('F j, Y',$birthday);
    $array1['results'][0]['term_start'] = date('F j, Y',$term_start);
    $array1['results'][0]['term_end'] = date('F j, Y',$term_end);
    $array1['results'][0]['bills'] = $arrbill; 
    $array1['results'][0]['committee'] = $arrcom;
    $res = json_encode($array1, true);
    echo $res;
    exit;
}
else if($detail == 2 && $ids != '')
{
    $url='https://congress.api.sunlightfoundation.com/bills?fields=bill_id,chamber,bill_type,sponsor,urls,last_version,history,introduced_on&bill_id='.$ids.'&per_page=all&apikey=542bae46d15c4c5c99bb423075fda3a7';
    $html=file_get_contents($url);
    echo $html;
    exit;

}
$html=file_get_contents($url); 
echo $html;
?>