const but = document.getElementById("create");

but.addEventListener("click", async () => {
  console.log("test");
  const driverName = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const car = document.getElementById("car").value;
  const budget = document.getElementById("budget").value;

  const lat = document.getElementById("lat").value;
  const lng = document.getElementById("lng").value;
  const pos = { lat: parseFloat(lat), lng: parseFloat(lng) };

  const data = { driverName, age, car, budget, pos };
  console.log(data);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch("/driver", options);
  const json = await response.json();
  console.log(json);
});
