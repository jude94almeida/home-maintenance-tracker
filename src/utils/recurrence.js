export function describeRecurrence(code) {
  const map = {
    once:'One time', weekly:'Weekly', biweekly:'Biweekly', monthly:'Monthly',
    quarterly:'Quarterly', every_6_months:'Every 6 months',
    annually:'Annually', every_other_year:'Every other year',
  };
  return map[code] || code;
}
