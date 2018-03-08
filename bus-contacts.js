var eventBus = require('pages/contacts/EventBus.js') 
var bus = eventBus.eventBus
//更新联系人列表
bus.on('contactsUpdateContacts',()=>{
  console.log('更新联系人列表')
  return new Promise((resolve,reject)=>{
    let contacts=[{
      name:'a'
    }
    ]
    resolve(contacts)
  })
})

//更新联系人列表
bus.on('contactsClicContact', (contact) => {
  console.log('点击联系人', contact)
  
})

//保存联系人
bus.on('contactSubmit', (contact)=>{
  console.log('保存联系人',contact)

  return new Promise((resolve,reject)=>{
    resolve()
  })
})