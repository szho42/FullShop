<?php
class YunAction extends PublicAction {
	function _initialize() {
		parent::_initialize();
	}
	
	public function index(){
    	$this->display();
	}
	public function plugin() {
		$this->error("正在开发中。。。","__APP__/Index/index");
	}
}