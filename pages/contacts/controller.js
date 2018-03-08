//接口控制器
let cb;
/**
 * 联系人列表点击用户回调
 */
function setCallbackClickUser(cb){
  this.cb = cb
}
function getCallbackClickUser(cb) {
  return cb
}
module.exports = {
  setCallbackClickUser: setCallbackClickUser,
  getCallbackClickUser: getCallbackClickUser
}