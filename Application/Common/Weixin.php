<?php

class wechatCallbackapiTest
{	
	public $title;
	public $picurl;
	public $description;
	public $appurl;	

	public function __construct( $title , $picurl , $description , $appurl){
		$this->title = $title;
		$this->picurl = $picurl;
		$this->description = $description;
		$this->appurl = $appurl;		
	}

	public function valid()
    {
        $echoStr = $_GET["echostr"];

        //valid signature , option
        if($this->checkSignature()){
        	echo $echoStr;
        	exit;
        }
    }
	
    public function responseMsg()
    {
		//get post data, May be due to the different environments
		$postStr = $GLOBALS["HTTP_RAW_POST_DATA"];

      	//extract post data
		if (!empty($postStr)){ 
              	$postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
                $fromUsername = $postObj->FromUserName;
                $toUsername = $postObj->ToUserName;
                $keyword = trim($postObj->Content);
                $time = time();
                $event = $postObj->Event;
                $textTpl = "<xml>
							<ToUserName><![CDATA[%s]]></ToUserName>
							<FromUserName><![CDATA[%s]]></FromUserName>
							<CreateTime>%s</CreateTime>
							<MsgType><![CDATA[%s]]></MsgType>
							<Content><![CDATA[%s]]></Content>
							<FuncFlag>0</FuncFlag>
							</xml>";
                  
                $newsTpl = "<xml>
							<ToUserName><![CDATA[%s]]></ToUserName>
							<FromUserName><![CDATA[%s]]></FromUserName>
							<CreateTime>%s</CreateTime>
							<MsgType><![CDATA[%s]]></MsgType>
							<ArticleCount>1</ArticleCount>
							<Articles>
							<item>
							<Title><![CDATA[%s]]></Title>
							<Description><![CDATA[%s]]></Description>
							<PicUrl><![CDATA[%s]]></PicUrl>
							<Url><![CDATA[%s]]></Url>
							</item>
							</Articles>
							</xml>";
				if(!empty( $keyword ))
                {
              		if (preg_match("/\w*商城\w*/i",$keyword)) {
              			$msgType = "news";
	                	$Url = $this->appurl.$fromUsername;
	                	$resultStr = sprintf($newsTpl, $fromUsername, $toUsername, $time, $msgType, $this->title,  $this->description, $this->picurl, $Url);
	                	echo $resultStr;
              		}else{
              			$msgType = "text";
              			$contentStr = "欢迎第一次来到WeShops商店平台,回复'商城'即可体验WeShops商店Demo。如有合作意向，请系统管理员(微信号：LinuxPI), 并且请关注公众号：WeShops，获取第一时间平台信息。";
              			$resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $contentStr);
              			echo $resultStr;
              		}
                	
                }else{
                	if($event=="subscribe"){//首次关注
              			$msgType = "text";
              			$contentStr = "欢迎回到WeShops商店平台,回复'商城'即可体验WeShops商店Demo。如有合作意向，请系统管理员(微信号：LinuxPI), 并且请关注公众号：WeShops，获取第一时间平台信息。";
              			$resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $contentStr);
              			echo $resultStr;
                     }
                	 echo "Input something...";
                }

        }else {
        	echo "";
        	exit;
        }
    }
		
	private function checkSignature() {
		$signature = $_GET ["signature"];
		$timestamp = $_GET ["timestamp"];
		$nonce = $_GET ["nonce"];
		
		$token = TOKEN;
		$tmpArr = array (
				$token,
				$timestamp,
				$nonce 
		);
		sort ( $tmpArr, SORT_STRING );
		$tmpStr = implode ( $tmpArr );
		$tmpStr = sha1 ( $tmpStr );
		
		if ($tmpStr == $signature) {
			return true;
		} else {
			return false;
		}
	}
}

?>
