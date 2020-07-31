function sqlDateParser(sqlDate) {
  let dateRepresentationMiliseconds = Date.parse(sqlDate);
  let date = new Date.parse(dateRepresentationMiliseconds);
  `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

export {sqlDateParser}
