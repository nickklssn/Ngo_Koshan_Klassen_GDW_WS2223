getDriver();
async function getDriver() {
  const response = await fetch("/driver");
  const data = await response.json();
  console.log(data);
}
