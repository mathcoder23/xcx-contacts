var eventBus = require('pages/contacts/EventBus.js')
var Pinyin = require('utils/pinyin.js')
var bus = eventBus.eventBus
var contactList = []
//更新联系人列表
bus.on('contactsUpdateContacts', () => {
  console.log('更新联系人列表')
  return new Promise((resolve, reject) => {
    let clist = wx.getStorageSync('contactList')
    //不是数组初始化为数组
    if (Object.prototype.toString.call(clist) != '[object Array]') {
      contactList = []
      wx.setStorageSync('contactList', contactList)
    } else {
      contactList = clist
    }

    resolve(contactList)
  })
})

//点击联系人
bus.on('contactsClicContact', (contact) => {
  console.log('点击联系人', contact)

})

//保存联系人
bus.on('contactSubmit', (contact) => {
  console.log('保存联系人', contact)
  //增加拼音索引
  let pinyins = Pinyin.parse(contact.name)
  let pyFirst = "" //第一个字符的首字母
  let pyFirstLetter = "" //首字母
  let pinyin = "" //全拼
  for (let i in pinyins) {

    let py = pinyins[i]
    console.log(i, py)
    if (i == 0) {
      //第一个字符
      if (py.type != 2 && py.type != 1) {
        //不为中文,或字母
        pyFirst = '#'

      } else {
        pyFirst = py.target.substr(0, 1).toUpperCase()
        pinyin += py.target
        pyFirstLetter += py.target.substr(0, 1).toUpperCase()
      }
    } else {
      if (py.type == 2 || py.type == 1) {
        pinyin += py.target
        pyFirstLetter += py.target.substr(0, 1).toUpperCase()
      }
    }
  }
  contact.pyFirst = pyFirst
  contact.pyFirstLetter = pyFirstLetter
  contact.pinyin = pinyin

  //id存在更新值
  if (contact.id) {
    if (contact.id <= contactList.length) {
      contactList[contact.id - 1] = contact
    }

  } else {
    //新增
    if (contactList.length == 0) {
      contact.id = 1
    } else {
      contact.id = contactList[contactList.length - 1].id + 1
    }

    contactList.push(contact)
  }
  wx.setStorageSync('contactList', contactList)
  return new Promise((resolve, reject) => {
    resolve(contact)
  })
})


//删除联系人
bus.on('contactsRemoveContact', (contact) => {
  console.log('删除联系人', contact)
  contactList.splice(contact.id - 1, 1)
  wx.setStorageSync('contactList', contactList)
  bus.emit('contactsPassiveUpdateContacts', contactList)
})