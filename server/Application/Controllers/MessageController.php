<?php
class MessageController
{
    // 分页查询有限个 message
    function QueryMessage()
    {
        $docSize = $_GET['docSize'];

        // 判断是否为空
        if (empty($docSize)) {
            return json_encode(['code' => 1, 'data' => '', 'mag' => '参数不正确']);
        };

        $obj = ModelFactory::M('MessageModel');
        $list = $obj->QueryMessage($docSize);
        echo json_encode($list);
    }

    // 插入 messgae
    function InsertMessage()
    {
        $openId = $_GET['openId'];
        $nickName = $_GET['nickName'];
        $message = $_GET['message'];
        $timeStamp = $_GET['timeStamp'];

        if (empty($openId) || empty($nickName) || empty($message) || empty($timeStamp)) {
            return json_encode(['code' => 1, 'data' => '', 'mag' => '参数不正确']);
        };

        $obj = ModelFactory::M('MessageModel');
        $data = $obj->InsertMessage($openId, $nickName, $message, $timeStamp);
        echo json_encode($data);
        echo 'insert success!!!';
    }
}
