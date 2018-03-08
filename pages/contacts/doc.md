# 使用文档
## 代码集成至已有项目
> 此项目整体上来说是个demo程序，核心的代码在pages/contacts中，集成方式需要将pages/contacts拷贝到目标项目中
## 使用方法
### 使用准备
#### app.json中注入contacts的页面
```

"pages":[
  "xxx/contacts/contacts",
  "xxx/contacts/example/pages/contact/index"
]
```
#### app.js注入事件总线
```
App({
   globalData: {
     bus: eventBus.eventBus
   }
})
```
#### app.wxss注入样式
```
@import "xxx/contacts/example/app.wxss";
```
`备注:xxx为contacts所在的目录相对路径`

### 事件总线文档

#### contacts 通讯录事件总线


|类型|事件名|事件|参数|备注|  
|:---------------------:|  
|接收|点击联系人|contactsUpdateGroups | contacts|contacts 是一个contact数组，程序将会自动对contact进行pinyin分组|  
|发送|更新联系人列表|contactsClicContact|contact|contact 联系人对象|  
  

