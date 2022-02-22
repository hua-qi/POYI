<?php
class WordController
{
    // 随机查询四个 word
    function RandomQuery()
    {
        // 接收参数 collectionName
        $collname = $_GET['collectionName'];

        // 判断参数是否为空
        if (empty($collname)) {
            return json_encode(['code' => 1, 'data' => '', 'mag' => '参数不正确']);
        };

        // 调用ModelFactory的静态方法M，并接收WordModel对象
        $obj = ModelFactory::M('WordModel');
        // WordModel对象调用其RandomQuery方法，并接收返回值$list
        $list = $obj->RandomQuery($collname);
        // 向前端返回$list经json格式化后的结果
        echo json_encode($list);
    }

    function QueryId()
    {
        $collname = $_GET['collectionName'];
        $_id = $_GET['_id'];

        if (empty($collname) || empty($_id)) {
            return json_encode(['code' => 1, 'data' => '', 'mag' => '参数不正确']);
        };

        $obj = ModelFactory::M('WordModel');
        $list = $obj->QueryId($collname, $_id);
        echo json_encode($list);
    }

    // 根据 openid 查询单词
    function QueryWrongs()
    {
        $collname = $_GET['collectionName'];
        $openId = $_GET['openId'];

        if (empty($collname) || empty($openId)) {
            return json_encode(['code' => 1, 'data' => '', 'mag' => '参数不正确']);
        };

        $obj = ModelFactory::M('WordModel');
        $list = $obj->QueryWrongs($collname, $openId);
        echo json_encode($list);
    }

    // 根据 单词 _id 增加 用户标志：openId
    function PushOpenId()
    {
        $collname = $_GET['collectionName'];
        $_id = $_GET['_id'];
        $openId = $_GET['openId'];

        if (empty($collname) || empty($_id) || empty($openId)) {
            return json_encode(['code' => 1, 'data' => '', 'mag' => '参数不正确']);
        };

        $obj = ModelFactory::M('WordModel');
        $data = $obj->PushOpenId($collname, $_id, $openId);
        echo json_encode($data);
    }

    // 根据 单词 _id 删除 用户标志：openId
    function PullOpenId()
    {
        $collname = $_GET['collectionName'];
        $_id = $_GET['_id'];
        $openId = $_GET['openId'];

        if (empty($collname) || empty($_id) || empty($openId)) {
            return json_encode(['code' => 1, 'data' => '', 'mag' => '参数不正确']);
        };

        $obj = ModelFactory::M('WordModel');
        $data = $obj->PullOpenId($collname, $_id, $openId);
        echo json_encode($data);
    }
}
