<?php
// 本类由系统自动生成，仅供测试用途
class IndexAction extends Action {
    public function index(){
    	if ($_GET['uid']) {
    		$m = M("Theme");
    		$result = $m->select();
    		C("DEFAULT_THEME",$result[0][theme]);
    		 
    		$menuresult = R("App/Interface/getmenu");
    		$this->assign("menu",$menuresult);
    		
    		$inforesult = R("App/Interface/getinfo");
    		$this->assign("info",$inforesult[0]);
    		
    		$goodsresult = R("App/Interface/getgoods");
    		$this->assign("goods",$goodsresult);
    		
    		$uid=$_GET["uid"];
    		$usersresult = R("App/Interface/getusers",array($uid));
    		$this->assign("users",$usersresult[0]);
    		$this->display();
    	}else{
    		echo '请使用微信访问!';
    	}

    }


}