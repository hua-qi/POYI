<?php
class MessageModel extends BaseModel
{
    function QueryMessage($docSize)
    {
        $collname = 'messages';
        $pipeline = [
            [
                '$sort' => [
                    'timeStamp' => -1
                ]
            ],
            [
                // (int)： string transform integer
                '$skip' => (int)$docSize
            ],
            [
                '$limit' => 6
            ]
        ];
        return $this->_dao->aggregate($collname, $pipeline);
    }

    function InsertMessage($openId, $nickName, $message, $timeStamp)
    {
        $collname = 'messages';
        $document = [
            'openId' => $openId,
            'nickName' => $nickName,
            'message' => $message,
            'timeStamp' => $timeStamp
        ];
        $data = $this->_dao->insert($collname, $document);
        return $data;
    }
}
