
var eventBus = require('pages/contacts/EventBus.js') 
var businit = require('bus-contacts.js') 
//app.js
App({
  globalData: {
    bus: eventBus.eventBus
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
  }
})