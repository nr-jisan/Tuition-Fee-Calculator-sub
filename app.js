const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/calculate", (req, res) => {
  const ssc = parseFloat(req.body.ssc);
  const hsc = parseFloat(req.body.hsc);
  const department = req.body.department;

  let baseFee = 0;
  if (department === "CSE") baseFee = 50000;
  else if (department === "EEE") baseFee = 48000;
  else if (department === "BBA") baseFee = 45000;
  else baseFee = 40000;

  const avgGPA = (ssc + hsc) / 2;
  let discount = 0;
  if (avgGPA >= 5.00) discount = 0.30;
  else if (avgGPA >= 4.50) discount = 0.20;
  else if (avgGPA >= 4.00) discount = 0.10;

  const finalFee = baseFee - baseFee * discount;

  res.json({
    department,
    baseFee,
    discount: discount * 100,
    finalFee,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
