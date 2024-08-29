const form = document.getElementById('calc-form');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent form submission

  const length = parseFloat(document.getElementById('length').value);
  const breadth = parseFloat(document.getElementById('breadth').value);
  const width = parseFloat(document.getElementById('width').value);

  const weight = calculateWeight(length, breadth, width);
  const thrust = calculateThrustForce(weight);

  const propellerDiameter = 5; // inches (standard value)
  const propellerPitch = 3; // inches (standard value)

  const kv = calculateKv(thrust, propellerDiameter, propellerPitch, weight);

  // Create a new URL parameter to pass the calculated weight, thrust force, and Kv rating
  const params = `weight=${weight.toFixed(2)}&thrust=${thrust.toFixed(2)}&kv=${kv.toFixed(2)}`;

  // Redirect the user to the result page with the calculated weight, thrust force, and Kv rating
  window.location.href = `result.html?${params}`;
});

function calculateWeight(length, breadth, width) {
  // Calculate the weight of each component
  const W_motors = 2 * (0.035 * length + 0.025 * breadth + 0.015 * width); // Equation (1) from the paper
  const W_propellers = 4 * (0.012 * length + 0.008 * breadth + 0.005 * width); // Equation (2) from the paper
  const W_battery = 0.05 * length * breadth * width; // Equation (3) from the paper
  const W_frame = 0.03 * length * breadth * width; // Equation (4) from the paper
  const W_electronics = 0.01 * length * breadth * width; // Equation (5) from the paper

  // Calculate the total weight
  const W_total = W_motors + W_propellers + W_battery + W_frame + W_electronics;

  return W_total;
}

function calculateThrustForce(weight) {
  // Calculate the total weight in Newtons
  const W_newtons = (weight * 9.81) / 1000;

  // Calculate the total thrust force (assuming a TWR of 2)
  const F_total = 2 * W_newtons;

  // Calculate the thrust force per propeller (assuming 4 propellers)
  const F_per_propeller = F_total / 4;

  return F_per_propeller;
}

function calculateKv(thrust, propellerDiameter, propellerPitch, motorWeight) {
  const kv = (1000*thrust * Math.sqrt(propellerDiameter)) / (motorWeight * Math.sqrt(propellerPitch));
  return kv;
}