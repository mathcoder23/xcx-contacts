/**
 * 使用依赖
 * 需要在app.json中注入页面
 * "pages":[
 *   "xxx/contacts/contacts",
 *   "xxx/contacts/example/pages/contact/index"
 * ],
 * app.js注入事件总线
 * 
 * var eventBus = require('xxx/contacts/EventBus.js')
 * //app.js
 * App({
 *   globalData: {
 *     bus: eventBus.eventBus
 *   }
 * })
 * 备注:xxx为contacts所在的目录相对路径
 * 
 * 通讯录、联系人事件总线及使用方法
 * 
 * 
 * ***contacts 通讯录事件总线-发送端
 * 
 * 事件名:点击联系人 contactsClicContact
 * 参数:联系人对象 contact
 * 
 * 
 * ***contacts 通讯录事件总线-接收端
 * 
 * 事件名:更新联系人组 contactsUpdateGroups 
 * 参数:联系人组 groups 
 * 备注:groups 是一个已经被分组的对象，需要满足内部的groups结构
 */