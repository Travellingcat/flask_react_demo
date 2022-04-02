# -*- coding:utf-8 -*-
import hashlib
import sqlite3
import json
import csv
import threading

db_name = 'from_zero'

conn = sqlite3.connect(db_name + '.db', check_same_thread=False)
cursor = conn.cursor()


lock = threading.Lock()

# 创建数据库
def createTables():
    try:
        sql_create_t_staff = '''create table IF NOT EXISTS t_staff(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            service VARCHAR(20) NOT NULL,
            money VARCHAR(10),
            card_number VARCHAR(40),
            name VARCHAR(20),
            phone VARCHAR(20),
            project VARCHAR(20),
            shop_guide VARCHAR(20),
            teacher VARCHAR(20),
            financial VARCHAR(100),
            remarks1 VARCHAR(100),
            collect_money VARCHAR(100),
            remarks2 VARCHAR(100),
            create_time TIMESTAMP NOT NULL DEFAULT (datetime('now','localtime')),
            modify_tiem TIMESTAMP NOT NULL DEFAULT (datetime('now','localtime'))
        )'''
        cursor.execute(sql_create_t_staff)
    except Exception as e:
        print(repr(e))

# 每次执行或导入该文件都会尝试创建数据库
createTables()

staffColumns = ("id", "service", "money", "card_number", "name", "phone", "project", "shop_guide", "teacher", "financial", "remarks1", "collect_money", "remarks2")

# 添加数据
def addOrUpdateStaff(json_str):
    try:
        print(json_str)  # {"service":"1","money":"2","card_number":"3","name":"4","phone":"1"}
        # print("=="*30)
        staff = json.loads(json_str)
        id = staff.get('id', 0)
        result = ''
        newId = id

        if id == 0:  # 新增
            keys = ''
            values = ''
            isFirst = True
            for key, value in staff.items():
                if isFirst:
                    isFirst = False
                else:
                    keys += ','
                    values += ','
                keys += key
                if isinstance(value, str):
                    values += ("'%s'" % value)
                else:
                    values += str(value)

            sql = "INSERT INTO t_staff (%s) values (%s)" % (keys, values)

            # print(sql)
            lock.acquire(True)
            cursor.execute(sql)
            result = '添加成功'
            newId = cursor.lastrowid
            print(result, "newId:", newId)

        conn.commit()
        lock.release()
        re = {
            'code': 0,
            'id': newId,
            'message': result
        }
        return re
    except Exception as e:
        print(repr(e))
        re = {
            'code': -1,
            'message': repr(e)
        }
        return re


def getStaffList(job):
    # 当job为0时，表示获取所有数据
    tableName = 't_staff'
    where = ''

    columns = ','.join(staffColumns)
    order = ' order by id desc'  # 按照id的递减顺序排列，之后要改
    sql = "select %s from %s%s%s" % (columns, tableName, where, order)
    # print(sql)

    lock.acquire(True)
    cursor.execute(sql)

    dateList = cursor.fetchall()  # fetchall() 获取所有记录
    lock.release()
    print(dateList)
    print('------------')
    conn.commit()
    return dateList


def getStaffsFromData(dataList):
    staffs = []
    for itemArray in dataList:  # dataList数据库返回的数据集，是一个二维数组
        # itemArray: ('1', '1', '2', '3', '4')
        staff = {}
        for columnIndex, columnName in enumerate(staffColumns):
            columnValue = itemArray[columnIndex]
            # if columnValue is None: #后面remarks要用，现在不需要
            #     columnValue = 0 if columnName in (
            #         'job', 'education', 'birth_year') else ''
            staff[columnName] = columnValue

        staffs.append(staff)

    return staffs