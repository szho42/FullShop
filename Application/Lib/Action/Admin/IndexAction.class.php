<?php
// 本类由系统自动生成，仅供测试用途
class IndexAction extends PublicAction {
	function _initialize() {
		parent::_initialize();
	}
	
    public function index(){
    	if (isset($_SESSION["username"])) {
			$this->assign("url",'http://'.$_SERVER['HTTP_HOST']);
    		$this->display();
    	}else{
    		$this->display("Public:login");
    	}
    }
}