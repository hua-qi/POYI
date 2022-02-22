<?php
class UserModel extends BaseModel
{
    function Login($code, $nickName, $avatar)
    {
        $appID = 'wx082548b6faa4bfaf';
        $appSecret = 'c3458e1c0d721b5e48e59ac060c9b351';

        // 请求地址
        $url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' . $appID . '&secret=' . $appSecret . '&js_code=' . $code . '&grant_type=authorization_code';

        // 发送请求
        $res = file_get_contents($url);
        // json 解码
        $res = json_decode($res);
        // 验证
        // return $res;
        $arr = [
            'nickName' => $nickName,
            'avatar' => $avatar,
            'code' => $code,
            'session_key' => $res->session_key,
            'openid' => $res->openid
        ];

        // 根据openid 进行document 字段查询
        // 如果有就修改session_key这个字段，如果没有就新添加一条数据
        $collname = 'User';
        $filter = [
            'openid' => $arr['openid']
        ];
        $newObj = [
            '$set' => [
                'session_key' => $arr['session_key'],
                'nickName' => $arr['nickName'],
                'avatar' => $arr['avatar'],
                'code' => $arr['code']
            ]
        ];
        // upsert: true，代表没有该 documen 则添加。fasle，代表不添加
        // multi: true，代表更新找到的所有记录，false默认更新找到的第一条
        $upsert = true;
        $multi = false;

        $data = $this->_dao->update($collname, $filter, $newObj, $upsert, $multi);
        // 返回主键ID
        if ($data) {
            return ['code' => 200, 'openid' =>  $arr['openid'], 'msg' => '登录成功'];
        }
    }
}
