var eventBus = require('pages/contacts/EventBus.js')
var Pinyin = require('utils/pinyin.js')
var bus = eventBus.eventBus
var contactList = []
//取服务器数据
function serverToSync() {
  //检查用户信息
  var huaqiUser = wx.getStorageSync('huaqiUser')
  if (!huaqiUser) {
    return
  }
  huaqiUser = JSON.parse(huaqiUser)
  if (!huaqiUser.phone) {
    return
  }
  //检查配置信息
  var config = wx.getStorageSync('config')
  if (!config || !config.baseUrl) {
    return
  }
  wx.request({
    url: config.baseUrl + '/api/contact/list',
    method: "GET",
    data: {
      key: huaqiUser.phone
    },
    success: function (res) {
      contactList = res.data
      wx.setStorageSync('contactList', contactList)
      bus.emit('contactsPassiveUpdateContacts', contactList)
    }
  })
}
//同步到服务器
function syncToServer() {
  //检查用户信息
  var huaqiUser = wx.getStorageSync('huaqiUser')
  if (!huaqiUser) {
    return
  }
  huaqiUser = JSON.parse(huaqiUser)
  if (!huaqiUser.phone) {
    return
  }
  //检查配置信息
  var config = wx.getStorageSync('config')
  if (!config || !config.baseUrl) {
    return
  }
  wx.request({
    url: config.baseUrl + '/api/contact/saveList',
    method: "POST",
    data: {
      key: huaqiUser.phone,
      contactList: JSON.stringify(contactList)
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      console.log(res.data)
    }
  })
}
setTimeout(() => {
  serverToSync()
}, 5000)
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
  var itemList = []
  if (contact.tel1) {
    itemList.push(contact.tel1)
  }
  if (contact.tel2) {
    itemList.push(contact.tel2)
    if (contact.tel3) {
      itemList.push(contact.tel3)
    }
  }

  wx.showActionSheet({
    itemList: itemList,
    success: function (res) {
      var phone = itemList[res.tapIndex]
      //呼叫号码
      bus.emit('keypadCallPhone', phone)
    }
  })
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
        //不为中文
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
    let index = getObjIndexByArrayOfKV(contactList, "id", contact.id)
    contactList[index] = contact

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
  syncToServer()//保存到服务器
  return new Promise((resolve, reject) => {
    resolve(contact)
  })
})


//删除联系人
bus.on('contactsRemoveContact', (contact) => {
  console.log('删除联系人', contact)

  let index = getObjIndexByArrayOfKV(contactList, "id", contact.id)
  console.log(index)
  contactList.splice(index, 1)
  wx.setStorageSync('contactList', contactList)
  syncToServer()//保存到服务器
  bus.emit('contactsPassiveUpdateContacts', contactList)
})
//对象数组，通过对象中的k-v值来返回匹配的第一个对象
function getObjIndexByArrayOfKV(array, key, value) {
  let obj = null
  let i = 0
  if ("object" === typeof (array)) {

    array.every(item => {

      if ("object" === typeof item) {
        if ("undefined" !== typeof item[key]) {
          console.log(item[key], value)
          if (item[key] == value) {
            obj = item
            return false
          }
        }
      }
      i++
      return true
    })
  }
  return i
}