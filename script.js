const form = document.getElementById('calc-form');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent form submission

  const length = parseFloat(document.getElementById('length').value);
  const breadth = parseFloat(document.getElementById('breadth').value);
  const width = parseFloat(document.getElementById('width').value);

  const weight = calculateWeight(length, breadth, width);
  const thrust = calculateThrustForce(weight);

  const propellerDiameter = calculateDiameter(length, width, weight, thrust/4); // calculate diameter based on dimensions and weight
  const propellerPitch = calculatePitch(length, width, thrust/4); // calculate pitch based on dimensions and thrust

  const kv = calculateKv(thrust/4, propellerDiameter, propellerPitch, weight);

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
  const F_per_propeller = F_total;

  return F_per_propeller;
}

function calculateKv(thrust, propellerDiameter, propellerPitch, motorWeight) {
  // Given the motor specifications: 4 x 900-1000kv motors
  // and the propeller specifications: 8 inches diameter, 4.5 inches pitch
  // We can calculate the Kv rating based on the thrust and motor weight

  // Assuming a motor weight of approximately 0.035 kg (based on the previous calculation)
  const motorWeight_kg = 0.035;

  // Calculate the Kv rating based on the thrust and motor weight
  const kv = (thrust * 1000) / (motorWeight_kg * 11000); // 11000 rpm is the given motor speed

  return kv;
}

function calculatePitch(L, W, T) {
  // Define a scaling factor to map dimension values to pitch values
  const scaleFactor = 0.5;

  // Calculate a dimension-based value (larger dimensions -> higher value)
  const dimensionValue = Math.sqrt(L * L + W * W);

  // Calculate a thrust-based value (higher thrust -> higher value)
  const thrustValue = T / 100; // adjust the divisor to fine-tune the effect of thrust

  // Combine the dimension and thrust values to get a pitch value
  const pitchValue = scaleFactor * (dimensionValue + thrustValue);

  // Map the pitch value to a range between 3 and 17
  const pitch = Math.max(3, Math.min(17, pitchValue));

  return pitch;
}

function calculateDiameter(L, W, weight, thrust) {
  // Define a scaling factor to map dimension values to diameter values
  const scaleFactor = 0.1;

  // Calculate a dimension-based value (larger dimensions -> larger diameter)
  const dimensionValue = Math.sqrt(L * L + W * W);

  // Calculate a weight-based value (heavier weight -> larger diameter)
  const weightValue = weight / 100; // adjust the divisor to fine-tune the effect of weight

  // Calculate a thrust-based value (higher thrust -> larger diameter)
  const thrustValue = thrust / 100; // adjust the divisor to fine-tune the effect of thrust

  // Combine the dimension, weight, and thrust values to get a diameter value
  const diameterValue = scaleFactor * (dimensionValue + weightValue + thrustValue);

  // Map the diameter value to a range between 3 and 10 inches
  const diameter = Math.max(3, Math.min(10, diameterValue));

  return diameter;
}
