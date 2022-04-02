import React from "react";
import {Layout, Table, Button, message} from "antd";
import InfoDialog from './InfoDialog'
import HttpUtil from "../Utils/HttpUtil";
import ApiUtil from "../Utils/ApiUtil";


const { Header, Content, Icon } = Layout;

// 定义表格列属性
var columns = [
    {
        title: '业务',
        dataIndex: 'service',
        width: "80px",
    },
    {
        title: '金额',
        dataIndex: 'money',
        width: "80px",
    },
    {
        title: '卡号',
        dataIndex: 'card_number',
        width: "100px",
    },
    {
        title: '姓名',
        dataIndex: 'name',
        width: "80px",
    },
    {
        title: '手机号',
        dataIndex: 'phone',
        width: "120px",
    },
    {
        title: '项目',
        dataIndex: 'project',
        width: "80px",
    },
    {
        title: '导购员',
        dataIndex: 'shop_guide',
        width: "80px",
    },
    {
        title: '老师',
        dataIndex: 'teacher',
        width: "80px",
    },
    {
        title: '财务情况',
        dataIndex: 'financial',
    },
    {
        title: '备注1',
        dataIndex: 'remarks1',
    },
    {
      title: '收钱吧详情',
      dataIndex: 'collect_money',
    },
    {
        title: '备注2',
        dataIndex: 'remarks2',
    },
];

//测试用例
// var tmp = {
//   service:'新开',
//   money:'1200',
//   card_number:'1002886',
//   name:"王牛马",
//   phone:"1000292020221",
//   project:"散打",
//   shop_guide:"卖瓜的",
//   teacher:"王冰冰",
//   financial:"图片1",
//   remarks1:'xxxxxxxxxxxx',
//   collect_money:'图片2',
//   remarks2:'xxxxxxxxxxxxxxxx'
// };
// var data = [];
// for(var i=0; i<30; i++){
//     data.push(tmp);
// }

const columns1 = columns.slice(0);          //拷贝原列表元素生产一个新列表columns

class HomePage extends React.Component{
    columns2 = [];           //定义一个管理员对应得新列表
    state = {
        showInfoDialog: false,   //是否显示添加表单
        editingItem: null,      //对话框编辑的内容
        mData: [],              //数据
        my_columns:[],          //列
        showAdmin: false,       //是否是管理员
        show_back: "none",      //是否显示“返回”按钮
    }

    //管理员增加的‘操作’列元素
    admin_item = {
      title: '操作',
      render: (staff)=>(
          <span>
              <Icon type="edit" onClick={()=>this.showUpdateDialog(staff)} />
              <Icon type="close" title="删除" style={{ color:'#ee6633', marginLeft:12}} onClick={()=>this.deleteConfirm(staff)} />
          </span>
      ),
    };

    //增加管理员的列表元素，初始化(这个函数很奇怪，为什么这个函数名不能改？这是什么函数？)
    componentDidMount() {
        columns.push(this.admin_item);      //往原列表中加一个元素，赋给columns2
        this.columns2 = columns;
        this.getData();             //初始化数据并显示
        this.getMyColumns();        //获取列
    }

    //刷新列表
    getMyColumns(){
        //当前是否是管理员
        if(this.state.showAdmin===true){
            this.setState({
                my_columns: this.columns2,
            });
        }else{
            this.setState({
                my_columns: columns1,
            });
        }
    }

    gotoAdmin = ()=>{
        console.log("进入管理员模式");
        this.setState({
            showAdmin: true,
            show_back: "block",
        },function () {     //setState之后浏览器并不会立即刷新页面，需要积攒到一定修改量才会刷新(不太清楚)，因此添加一个回调函数，修改完之后立马调用这个函数
            this.getMyColumns();    //刷新列表
        });
    }
    onBack = ()=>{
        console.log("退出管理员模式");
        this.setState({
            showAdmin: false,
            show_back:"none",
        },function () {
            this.getMyColumns();     //刷新列表
        })
    }

    showUpdateDialog(item){
          console.log("hi, showUpdateDialog");
          this.setState({
              showInfoDialog: true,
          });

    }
    deleteConfirm = (staff)=>{
        console.log("hi,deleteConfirm");
    }

    getData(){
        HttpUtil.get(ApiUtil.API_STAFF_LIST+0).then(staffList =>{
            this.mAllData = staffList;
            this.setState({
                mData: staffList,
                showInfoDialog: false,
            });
        }).catch(error=>{
            message.error(error.message);
        });
    }

    handleInfoDialogClose = (staff)=>{
        if(staff){
            if(staff.id){
                //修改
                let datas = [...this.state.mData];
                for(let i=0; i<datas.length; i++){
                    if(datas[i].id === staff.id){
                        //更新该数据
                        datas[i] = staff;
                        this.setState({
                            mData: datas,
                            showInfoDialog: false,
                        });
                        break;      //找到了退出
                    }
                }
            }else {
                //新增 staff.id为0
                console.log("新增数据");
                this.getData();
            }
        }else {
            //删除
            this.getData();
        }
    }


  render() {
    return (
        <Layout>
          <Header>
            <div style={{lineHeight:'64px', fontSize:"20px", color:"white", textAlign:"center"}}>
              拉不拉卡不拉卡 - 卡片管理系统
            </div>
          </Header>

          <Content>
            <div style={{ background: '#fff', padding: 24, minHeight: 480}}>
                <Button style={{position:"absolute", right:"70px", top:"20px"}} onClick={()=>this.showUpdateDialog()}>添加</Button>
                <Table
                    columns={this.state.my_columns}
                    dataSource={this.state.mData}
                    rowKey={item=>item.id}
                    pagination={{pageSize: 20}}
                    scroll={{ y: 340}} />

                <InfoDialog
                    visible={this.state.showInfoDialog}
                    staff={this.state.editingItem}
                    afterClose={()=>{
                        this.setState({
                            showInfoDialog:false
                        });
                    }}
                    onDialogConfirm={this.handleInfoDialogClose}/>

                <div style={{position:"absolute", left:"10px", bottom:"10px"}}>
                    <a onClick={this.gotoAdmin}>管理员</a>
                </div>
                <div style={{position:"absolute", left:"70px", bottom:"10px", display:this.state.show_back}}>
                    <a onClick={this.onBack}>返回</a>
                </div>
            </div>
          </Content>
        </Layout>
    );
  }
}

export default HomePage;