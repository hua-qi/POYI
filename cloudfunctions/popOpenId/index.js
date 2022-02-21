const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {

  const { openId } = event.myData;
  try {
    return await db.collection(event.collection).where({
      ...event.myWhere
    }).update({
      data: {
        userOpenIds: _.pull(openId)
      }
    })
  } catch (e) {
    console.error(e);
  }
}