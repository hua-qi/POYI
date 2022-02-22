<?php

use function PHPSTORM_META\type;

/**
 * mongoDB 简单 封装
 * 请注意：mongoDB 支持版本 3.2+
 * 具体参数及相关定义请参见： https://docs.mongodb.com/manual/reference/command/
 *
 * @author huaqi_
 */
final class MongoDB
{

    //--------------  定义变量  --------------//
    private $_host;
    private $_port;
    private $_db;
    private static $_instance = null;
    private $_manager = null;

    // 单例模式
    static function GetInstance(array $config)
    {
        if (!(self::$_instance instanceof self)) {
            self::$_instance = new self($config);
        }
        return self::$_instance;
    }

    private function __construct(array $config)
    {
        $this->_host = $config['host'];
        $this->_port = $config['port'];
        $this->_db = $config['db'];
        $this->_manager = new MongoDB\Driver\Manager("mongodb://{$this->_host}:{$this->_port}/{$this->_db}");
    }

    function getBulk()
    {
        return new MongoDB\Driver\BulkWrite;
    }

    function getWriteConcern()
    {
        return new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
    }

    // 可为空（Nullable）类型 
    // 参数以及返回值的类型现在可以通过在类型前加上一个问号使之允许为空。 当启用这个特性时，传入的参数或者函数返回的结果要么是给定的类型，要么是 null 。
    function getObjectId(?string $_id)
    {
        if (isset($_id)) {
            return new MongoDB\BSON\ObjectId($_id);
        } else {
            return new MongoDB\BSON\ObjectID;
        }
    }

    /**
     * 插入数据
     * @param $db 数据库名
     * @param $collname 集合名
     * @param $document 数据 array格式
     * @return
     */
    function insert($collname, array $document)
    {
        $bulk = $this->getBulk();
        $document['_id'] = $this->getObjectId(null);

        $bulk->insert($document);
        $res = $this->_manager->executeBulkWrite($this->_db . '.' . $collname, $bulk);

        if (empty($res->getWriteErrors())) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 删除数据
     * @param  string $collname
     * @param  array  $deletes      [['q'=>query,'limit'=>int], ...]
     * @param  array  $writeOps     ['ordered'=>boolean,'writeConcern'=>array]
     * @return \MongoDB\Driver\Cursor
     */
    function delete($collname, array $deletes, array $writeOps = [])
    {
        foreach ($deletes as &$_) {
            if (isset($_['q']) && !$_['q']) {
                $_['q'] = (object)[];
            }
            if (isset($_['limit']) && !$_['limit']) {
                $_['limit'] = 0;
            }
        }
        $cmd = [
            'delete'    => $collname,
            'deletes'   => $deletes,
        ];
        $cmd += $writeOps;
        return $this->command($cmd);
    }

    /**
     * 更新数据
     * @param array $filter 类似where条件
     * @param array $newObj  要更新的字段
     * @param bool $upsert 如果不存在是否插入，默认为false不插入
     * @param bool $multi 是否更新全量，默认为false
     * @param string $db   数据库
     * @param string $collname 集合
     * @return mixed
     */
    function update($collname, $filter = array(), $newObj = array(), $upsert = false, $multi = false)
    {
        if (empty($filter)) {
            return 'filter is null';
        }
        if (isset($filter['_id'])) {
            $filter['_id'] = $this->getObjectId($filter['_id']);
        }

        $bulk = $this->getBulk();
        $write_concern = $this->getWriteConcern();

        $bulk->update($filter, $newObj, array('multi' => $multi, 'upsert' => $upsert));
        $res = $this->_manager->executeBulkWrite($this->_db . '.' . $collname, $bulk, $write_concern);

        if (empty($res->getWriteErrors())) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 查询
     * @param  string $collname
     * @param  array  $filter = where    [query]     参数详情请参见文档。
     * @return \MongoDB\Driver\Cursor
     */
    function query($collname, array $filter, array $writeOps = [])
    {
        if (isset($filter['_id'])) {
            $filter['_id'] = $this->getObjectId($filter['_id']);
        }
        $cmd = [
            'find'      => $collname,
            'filter'    => $filter
        ];
        $cmd += $writeOps;
        $data = $this->command($cmd);
        $list = [];
        foreach ($data as $document) {
            // 将 objectId（mongodb 特有方式处理 _id） 转化为 stringId
            $document->_id = $document->_id->__toString();
            // 返回一个数组。获取$object对象中的属性，组成一个数组
            $list[] = get_object_vars($document);
        };
        return $list;
    }

    /**
     * 聚合操作
     * @param  string $collname
     * @param  array  $pipeline     [query]     参数详情请参见文档。
     * @param  array  $cursor       [query]
     * @return \MongoDB\Driver\Cursor
     */
    function aggregate($collname, array $pipeline, array $cursor = ['batchSize' => 0], array $writeOps = [])
    {
        $cmd = [
            'aggregate'   => $collname,
            'pipeline'    => $pipeline,
            'cursor'      => $cursor
        ];
        $cmd += $writeOps;
        $data = $this->command($cmd);
        $list = [];
        foreach ($data as $document) {
            // 将 objectId（mongodb 特有方式处理 _id） 转化为 stringId
            $document->_id = $document->_id->__toString();
            // 返回一个数组。获取$object对象中的属性，组成一个数组
            $list[] = get_object_vars($document);
        };
        return $list;
    }

    /**
     * 统计
     * @param  string $collname
     * @param  array  $filter     [query]     参数详情请参见文档。
     * @return \MongoDB\Driver\Cursor
     */
    function countm($collname, array $filter, array $writeOps = [])
    {
        $cmd = [
            'count'    => $collname,
            'query'    => $filter
        ];
        $cmd += $writeOps;

        return $this->command($cmd);
    }

    /**
     * 自增长ID
     * @param  string $collname
     * @param  array  $filter     [query]     参数详情请参见文档。
     * @return \MongoDB\Driver\Cursor
     */
    function autoid($aid, $collname)
    {
        $update     = array('$inc' => array('id' => 1));
        $query      = array('tid' => $aid);
        $command    = array(
            'findandmodify' => $collname,
            'update' => $update,
            'query' => $query,
            'new' => true,
            'upsert' => true
        );
        return $this->command($command);
    }

    /**
     * 执行MongoDB命令
     * @param array $param
     * @return \MongoDB\Driver\Cursor
     */
    function command(array $param)
    {
        $cmd = new MongoDB\Driver\Command($param);
        // return var_dump($param); 
        return $this->_manager->executeCommand($this->_db, $cmd);
    }

    /**
     * 获取当前mongoDB Manager
     * @return MongoDB\Driver\Manager
     */
    function getMongoManager()
    {
        return $this->_manager;
    }

    /** command 遇到难以解决的bug update 更换使用 Mongodb\Driver\BulkWrite 驱动
     * 更新数据
     * @param  string $collname
     * @param  array  $updates      [['q'=>query,'u'=>update,'upsert'=>boolean,'multi'=>boolean], ...]
     * @param  array  $writeOps     ['ordered'=>boolean,'writeConcern'=>array]
     * @return \MongoDB\Driver\Cursor
     */
    /* function update($collname, array $updates, array $writeOps = [])
    {
        $cmd = [
            'update'  => $collname,
            'updates' => $updates,
        ];
        $cmd += $writeOps;
        // return var_dump($updates);
        return $this->command($cmd);
    } */


    /**
     * 插入数据
     * @param  string $collname
     * @param  array  $documents    [['name'=>'values', ...], ...]
     * @param  array  $writeOps     ['ordered'=>boolean,'writeConcern'=>array]
     * @return \MongoDB\Driver\Cursor
     */
    /* function insert($collname, array $documents, array $writeOps = [])
    {
        $cmd = [
            'insert'    => $collname,
            'documents' => $documents,
        ];
        $cmd += $writeOps;
        return $this->command($cmd);
    } */
}
