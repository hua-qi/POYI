const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {

  try {
    return await db.collection(event.collection).where({
      ...event.myWhere
    }).update({
      data: {
        userOpenIds: _.push(event.myData.openId)
      }
    })
  } catch (e) {
    console.error(e);
  }
}