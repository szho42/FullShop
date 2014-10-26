<?php
class PublicAction extends Action {
	 function _initialize() {
	 	if (!$_SESSION["username"]) {
	 		$this->redirect("/Admin/Login/index");
	 	}
	 }
}