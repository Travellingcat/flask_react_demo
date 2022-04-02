from flask import Flask, request
import json
import SqliteUtil as DBUtil

app = Flask(__name__, template_folder='../front-end', static_folder='../front-end', static_url_path='')

@app.route('/hi')
def hi():
    return 'hi~'

# api接口前缀
apiPrefix = '/api/v1/'

######################  Staff接口 ##################

@app.route(apiPrefix + 'updateStaff', methods=['POST'])
def updateStaff():
    # 从前端拿的数据
    data = request.get_data(as_text=True)
    # 返回给前端的数据
    re = DBUtil.addOrUpdateStaff(data)
    return json.dumps(re)

@app.route(apiPrefix + 'getStaffList/<int:job>')
def getStaffList(job):
    array = DBUtil.getStaffList(job)  # [('1', '1', '1', '1', '1'), ('1', '1', '2', '3', '4'), ...] 二维数组
    jsonStaffs = DBUtil.getStaffsFromData(array)
    # print("jsonStaffs:", jsonStaffs)
    return json.dumps(jsonStaffs)

if __name__ == "__main__":
    app.run(debug=True, port=5001)