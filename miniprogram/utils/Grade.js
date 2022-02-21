// 获取分数
const getGrade = (analyses, scores) => {
  // RAS: reply answer score
  let RAS = [];
  let i = 0;
  for (let key in analyses) {
      const section = key;
      const score = scores[i];
      let answers = [];
      let replies = [];
      analyses[key].forEach((item, index) => {
          answers[index] = item.answer ? item.answer : "";
          replies[index] = item.reply ? item.reply : ""
      })
      RAS[i] = {
          section,
          score,
          answers,
          replies
      };
      i++;
  };
  return RAS;
}
export {
  getGrade
}