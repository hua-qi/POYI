<?php
class BaseModel
{
    // 用于存储数据工具类的实例（对象）
    protected $_dao = null;
    function __construct()
    {
        $config = array(
            'host' => '127.0.0.1',
            'port' => '27017',
            'db' => 'huaqiEnglish'
        );
        $this->_dao = MongoDB::GetInstance($config);
    }
}
