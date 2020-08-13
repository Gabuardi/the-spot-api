function dateStringParser(sqlDate) {
  let dateRepresentationMiliseconds = Date.parse(sqlDate);
  let date = new Date(dateRepresentationMiliseconds);
  return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`
}

module.exports = dateStringParser;
