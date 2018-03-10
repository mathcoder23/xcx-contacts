const Zan = require('../../dist/index');
const config = require('./config');
var controller = require('controller.js');
var app = getApp()
var bus = app.globalData.bus
Page(Object.assign({}, Zan.Field, Zan.Toast, {
  data: {
    config,
    name: '',
    tel1:'',
    tel2:'',
    tel3:'',
    remarks:'',
    contact:{}
  },
  onLoad(opt){
    //如果存在，编辑联系人
    if(opt.params && opt.params.length>0){
      let contact = JSON.parse(opt.params)
      //遍历 初始化表单值
      for(let key in contact){
        let item = this.data.config.form[key]
        if(item){
          item.value = contact[key]
        }
      }
      this.setData({
        config:this.data.config
      })
      //表单的值
      this.data.contact = contact 
    }
  },
  onAreaChange(e) {
   
  },

  handleZanFieldChange(e) {
    const { componentId, detail } = e;
    //更新表单的值
    this.data.contact[componentId]=detail.value
    console.log('[zan:field:change]', this.data.contact);
  },
 /**文本焦点 */
  handleZanFieldFocus(e) {
    const { componentId, detail } = e;

    // console.log('[zan:field:focus]', componentId, detail);
  },
  /**文本焦点 */
  handleZanFieldBlur(e) {
    const { componentId, detail } = e;

    // console.log('[zan:field:blur]', componentId, detail);
  },

  clearInput() {
    this.setData({
      value: ''
    });
  },

 
  /**表单提交数据 */
  formSubmit(event) {
    console.log('[zan:field:submit]', event.detail.value);
    let form = event.detail.value
    if (!form.name || form.name.length === 0 ){
      this.showZanToast({
        title: '请输入姓名',
         icon: 'fail'
      });
      return
    }
    form.name=form.name.trim()
    console.log(form.tel1)
    if (!form.tel1 || form.tel1.length === 0) {
      this.showZanToast({
        title: '请输入手机号',
        icon: 'fail'
      });
      return
    }
    //手机号格式判断
    if (!(/\d+$/.test(form.tel1))) {
      this.showZanToast({
        title: '手机号1格式不正确',
        icon: 'fail'
      });
      return
    } 
    if (form.tel2 && !(/^1[34578]\d{9}$/.test(form.tel2))) {
      this.showZanToast({
        title: '手机号2格式不正确',
        icon: 'fail'
      });
      return
    } 
    if (form.tel3 &&  !(/^1[34578]\d{9}$/.test(form.tel3))) {
      this.showZanToast({
        title: '手机号3格式不正确',
        icon: 'fail'
      });
      return
    } 
    bus.emit('contactSubmit', this.data.contact).then(data=>{
      if(data){
        wx.navigateBack()
      }
    })
    

  },

  formReset(event) {
    console.log('[zan:field:reset]', event);
  },
  clickSaveToPhone(e){

    wx.addPhoneContact({
      nickName:this.data.name,
      firstName:this.data.name,
      remark:this.data.remarks,
      mobilePhoneNumber:this.data.tel1
    })
  }



}));
