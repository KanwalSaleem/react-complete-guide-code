function generateArrayOfYears() {
  var max = new Date().getFullYear()
  var min = max - 90
  var years = []

  for (var i = max; i >= min; i--) {
    years.push(i.toString())
  }
  return years
}

export default generateArrayOfYears
