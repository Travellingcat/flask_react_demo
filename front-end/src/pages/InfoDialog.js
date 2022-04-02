import {Modal, Form, Row, Input, Col, Select, Button, message} from "antd";
import React from "react";
import ApiUtil from "../Utils/ApiUtil";
import HttpUtil from "../Utils/HttpUtil";

const styles = {
    formItemLayout:{
        labelCol: {span:4},
        wrapperCol: {span:15},
    },
    formItem2Col:{
        labelCol: {span:4},
        wrapperCol: {span:8},
    },
    my_name:{
        labelCol: {span:4},
        wrapperCol: {span:15},
    },
    my_card:{
        labelCol:{span:4},
        wrapperCol:{span:16},
    },
};

const service_choice = [
    {id: '1', name: '新开'},
    {id: '2', name: '续卡'}
]


class InfoDialog extends React.Component{
    state = {
        visible: false,
        staff: {},
        can_shop_guide: true,       //是否可选导购员
    }
    componentWillReceiveProps(newProps) {
        //可以传递父组件值进来
        if(this.state.visible !== newProps.visible){
            this.setState({
                visible: newProps.visible       //子组件和父组件一致
            });
        }
    }

    //点击确认按钮
    handleOK = ()=>{
        this.props.form.validateFields((err,values)=>{
            if(err){
                message.error("表单数据有误，请根据提示填写！")
            }else {
                // console.log("填写正确！");
                //post处理
                HttpUtil.post(ApiUtil.API_STAFF_UPDATE, values).then(re=>{
                    console.log("返回结果：", re);       //拿到post的结果打印出来
                    message.info(re.message);
                }).catch(error=>{
                    message.error(error.message);
                });

                this.setState({
                    visible:false,
                });
                this.props.onDialogConfirm(values);
            }
        })
    }
    //点击取消按钮
    handleCancle = ()=>{
        this.setState({
            visible:false,
        });
    }

    render() {
        const {visible} = this.state;
        const {
            getFieldDecorator
        } = this.props.form;

        return(
            <Modal
                title="信息编辑"
                okText="保存"
                style={{top:20}}
                width={500}
                afterClose={this.props.afterClose}
                onCancel={this.handleCancle}
                cancelText="取消"
                visible={visible}
                onOk={this.handleOK}
            >
                <div>
                    <Form layout="horizontal" onSubmit={this.handleSubmit}>
                        <Form.Item {...styles.formItem2Col}>
                            {getFieldDecorator('id')(
                                <Input type="hidden" />
                            )}
                        </Form.Item>

                        <Form.Item label="业务" {...styles.formItem2Col}>
                            {getFieldDecorator('service',{
                                rules: [{ required: true, message: '请选择业务!'}],
                            })(
                                // onChange={value => console.log(value)}
                                <Select style={{ width:140 }} onChange={
                                    value => {
                                        var tmp;
                                        if(value==="新开")
                                        {tmp=true;}
                                        else
                                        {tmp=false;}        //续卡不能加导购员
                                        this.setState({
                                            can_shop_guide: tmp,
                                        });
                                    }
                                }>
                                    {service_choice.map((item)=> <Select.Option value={item.name} key={item.id}>
                                        {item.name}
                                    </Select.Option>)}
                                </Select>
                            )}
                        </Form.Item>

                        <Form.Item label="金额" {...styles.formItem2Col}>
                            {getFieldDecorator('money', {
                                rules: [{required: true, message:"请填写金额！"}]
                            })(
                                <Input placeholder=""/>
                            )}
                        </Form.Item>

                        <Form.Item label="卡号" {...styles.my_card}>
                            <Row gutter={20}>
                                <Col span={22}>
                                    {getFieldDecorator('card_number', {
                                        rules: [{required: true, message:"请填写卡号！"}]
                                    })(
                                        <Input placeholder="" item="card_number" onChange={this.handleTextChange}/>
                                    )}
                                </Col>
                                <Col span={2}>
                                    <Button shape="circle" icon="search" onClick={this.handleSearch} />
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item label="姓名" {...styles.my_name}>
                            <Row gutter={20}>
                                <Col span={13}>
                                    {getFieldDecorator('name',{
                                        rules: [{required: true, message:"请填写姓名！"}]
                                    })(
                                        <Input placeholder="" item="name" onChange={this.handleTextChange}/>
                                    )}
                                </Col>
                                <Col span={8}>
                                    <Button shape="circle" icon="search" onClick={this.handleSearch}/>
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item label="手机号" {...styles.my_name}>
                            <Row gutter={20}>
                                <Col span={22}>
                                    {getFieldDecorator('phone', {
                                        rules: [{required:true, message:"请填写手机号！"}]
                                    })(
                                        <Input placeholder="" item="phone" onChange={this.handleTextChange}/>
                                    )}
                                </Col>
                                <Col span={2}>
                                    <Button shape="circle" icon="search" onClick={this.handleSearch}/>
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item label="项目" {...styles.formItem2Col}>
                            {getFieldDecorator('project')(
                                <Input placeholder=""/>
                            )}
                        </Form.Item>

                        <Form.Item label="导购员" {...styles.formItem2Col}>
                            {getFieldDecorator('shop_guide')(
                                <Input placeholder={this.state.can_shop_guide?'':'不能输入'} disabled={this.state.can_shop_guide?false:true}/>
                            )}
                        </Form.Item>

                        <Form.Item label="老师" {...styles.formItem2Col}>
                            {getFieldDecorator('teacher')(
                                <Input placeholder=""/>
                            )}
                        </Form.Item>

                        <Form.Item label="财务情况" {...styles.formItem2Col}>
                            {getFieldDecorator('financial')(
                                <Input placeholder=""/>
                            )}
                        </Form.Item>

                        <Form.Item label="备注1" {...styles.formItem2Col}>
                            {getFieldDecorator('remarks1')(
                                <Input placeholder=""/>
                            )}
                        </Form.Item>

                        <Form.Item label="收钱吧详情" {...styles.formItem2Col}>
                            {getFieldDecorator('collect_money')(
                                <Input placeholder=""/>
                            )}
                        </Form.Item>

                        <Form.Item label="备注2" {...styles.formItem2Col}>
                            {getFieldDecorator('remarks2')(
                                <Input placeholder=""/>
                            )}
                        </Form.Item>

                    </Form>
                </div>
            </Modal>
        );
    }
}

const InfoDialogForm = Form.create({
    name: 'information_dialog'
})(InfoDialog);

export default InfoDialogForm;