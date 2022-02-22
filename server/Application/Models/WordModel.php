<?php
class WordModel extends BaseModel
{
    function RandomQuery($collname)
    {
        // 对象集合collname具体操作，类似于sql语句中的where
        $pipeline = [
            [
                '$sample' => [
                    'size' => 4
                ]
            ]
        ];
        // 执行查询方法，并接收返回值
        $data = $this->_dao->aggregate($collname, $pipeline);
        return $data;
    }

    function QueryId($collname, $_id)
    {
        $filter = [
            '_id' => $_id
        ];
        return $this->_dao->query($collname, $filter);
    }

    function QueryWrongs($collname, $openId)
    {
        $filter = [
            'userOpenIds' => $openId
        ];
        return $this->_dao->query($collname, $filter);
    }

    function PushOpenId($collname, $_id, $openId)
    {
        $filter = [
            '_id' => $_id
        ];
        $newObj = [
            // $addToSet 添加值到一个数组中去，如果数组中已经存在该值那么将不会有任何的操作。
            '$addToSet' => [
                'userOpenIds' => $openId
            ]
        ];
        $data = $this->_dao->update($collname, $filter, $newObj);
        return $data;
    }

    function PullOpenId($collname, $_id, $openId)
    {
        $filter = [
            '_id' => $_id
        ];
        $newObj = [
            '$pull' => [
                'userOpenIds' => $openId
            ]
        ];
        $data = $this->_dao->update($collname, $filter, $newObj);
        return $data;
    }


    // command 方式： 遇到难以解决的 bug 遂放弃
    // function PushOpenId($collname, $_id, $openId)
    // {
    //     $updates = [
    //         'q' => [
    //             '_id' => new MongoDB\BSON\ObjectId($_id)
    //         ],
    //         'u' => [
    //             // 加入一个值到数组内，而且只有当这个值不在数组内才增加
    //             '$addToSet' => [
    //                 'userOpenIds' => $openId
    //             ]
    //         ],
    //     ];

    //     $data = $this->_dao->update($collname, $updates);
    //     return $data;
    // }
}
