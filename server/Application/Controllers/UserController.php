<?php
class UserController
{
    function Login()
    {
        // 接收前台传来的值
        $code = $_GET['code'];
        $nickName = $_GET['nickName'];
        $avatar = $_GET['avatar'];

        // 判断是否为空
        if (empty($code) || empty($nickName) || empty($avatar)) {
            return json_encode(['code' => 1, 'data' => '', 'mag' => '参数不正确']);
        }

        $obj = ModelFactory::M('UserModel');
        $data = $obj->Login($code, $nickName, $avatar);
        echo json_encode($data);
    }
}
