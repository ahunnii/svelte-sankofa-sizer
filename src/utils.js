import { onMount } from 'svelte';
import { writable } from 'svelte/store';

export const actual_pattern = writable(
	{
		'blob': null,
		'width': null,
		'height': null
	}
);

export const the_id_of_the_base_pattern = "base_pattern"
export const the_id_of_the_virtual_pattern = "virtual-pattern"

export const show_popup_pattern = writable(false);
export const pixels_per_inch = writable(12); // this is PPI for VirtualResize, on screen 
export const toggle_overlay = writable(null);
export const box_to_checkbox = writable(
	{
		'bodyPart': null,
		'toggle': false // todo: i just flip this back and forth to force an update, better to do it the right way
	}
);
export const add_image_toggle = writable(false);

/* parts are filled in from the BodyPart widget */
export const parts = writable([
  { 
		name: 'Shoulder to wrist (arm)',
		id: 1,
		 x: 0, 
		 y: 0, 
		 lineX: 0,
		 lineY: 0,
		 virtual_length: 21, // inches
		 actual_length: 21,
		selected: false,
		type: 'vertical'
	},{ 
		name: 'Biceps',
		id: 2,
		x: 0,
		y: 0,
 	  lineX: 0,
		lineY: 0,
		virtual_length: 4, // inches
		actual_length: 4,
		selected: false, 
		type: 'horizontal'
	},{
		name: 'Wrist',
		id: 3,
		x: 0, 
		y: 0, 
  	lineX: 0,
	  lineY: 0,
	  virtual_length: 8, // inches
		 actual_length: 8,		
		selected: false, 
		type: 'horizontal'
	},{
		name: 'Ankle',
		id: 4,
		x: 0, 
		y: 0, 
  	lineX: 0,
	  lineY: 0,
	  virtual_length: 16, // inches
		 actual_length: 16,		
		selected: false, 
		type: 'horizontal'
	},{
		name: 'Inseam',
		id: 5,
		x: 0, 
		y: 0, 
  	lineX: 0,
	  lineY: 0,
	  virtual_length: 8, // inches
		 actual_length: 8,		
		selected: false, 
		type: 'vertical'
	},{
		name: 'Knee',
		id: 6,
		x: 0, 
		y: 0, 
  	lineX: 0,
	  lineY: 0,
	  virtual_length: 28, // inches
		 actual_length: 28,		
		selected: false, 
		type: 'horizontal'
	},{
		name: 'Seatback',
		id: 7,
		x: 0, 
		y: 0, 
  	lineX: 0,
	  lineY: 0,
	  virtual_length: 8, // inches
		 actual_length: 8,		
		selected: false, 
		type: 'horizontal'
	}
]);


/*
export const parts = writable([
  { 
		name: 'Shoulder to wrist (arm)',
		id: 1,
		 x: 60, 
		 y: 15, 
		 lineX: 60,
		 lineY: 15,
		 length: 320, // inches
		selected: true,
		type: 'vertical'
	},{ 
		name: 'Wrist width',
		id: 2,
		x: 70, 
		y: 40, 
  	lineX: 70,
	  lineY: 45,
	  length: 120, // inches
		selected: true, 
		type: 'horizontal'
	},{ 
		name: 'Biceps',
		id: 3,
		x: 55,
		y: 25,
 	  lineX: 55,
		lineY: 25,
		length: 150, // inches
		selected: false, 
		type: 'horizontal'
	},
]);
*/

export function updateParts(lengthUpdates) {
  parts.update(($parts) => {
    // Iterate over the lengthUpdates array and update the corresponding $parts
    for (let i = 0; i < lengthUpdates.length; i++) {
      $parts[i].virtual_length = lengthUpdates[i]['length'];
      $parts[i].actual_length = lengthUpdates[i]['length'];
    }
    return $parts; // Return the updated $parts array
  });
}

export function addModifiedParts(lengthUpdates) {
  parts.update(($parts) => {
    // Here we're copying and modifying the parts
    // We use the lengthUpdates array to set the new length of each part
    // and append ' (new)' to the name
    const modifiedParts = $parts.map((part, index) => ({
      ...part,
      name: `${part.name} (new)`,
      length: lengthUpdates[index].length,
    }));

    // Finally, add the modified parts to the store array by concatenating it with the original parts
    return [...$parts, ...modifiedParts];
  });
}

// UNITS OF CENTIMETER


const female_bartol_meas_coefs = [
	[ 3.15525996e-02,  9.67413580e-04,  3.97834157e-01],
	[-9.42942153e-02,  2.41811311e-03,  3.43067334e-01],
	[ 2.61448761e-01,  3.05607510e-04,  1.54298807e-01],
	[-4.36313535e-01,  8.33874573e-03,  1.08423174e+00],
	[-2.58118855e-01,  8.04489569e-03,  8.04607416e-01],
	[ 2.60780911e-02,  5.42628572e-03,  6.24665865e-01],
	[ 4.80207136e-03,  6.61830080e-04,  1.02236013e-01],
	[-1.56243767e-01,  3.14081447e-03,  3.35462832e-01],
	[-1.56025580e-02,  1.47653255e-03,  1.74466694e-01],
	[ 3.43654829e-01, -9.23793240e-05, -7.56489634e-02],
	[ 5.95233639e-01, -4.13995391e-04, -2.39390746e-01],
	[-3.67677472e-02,  3.60631301e-03,  4.22049939e-01],
	[ 1.49676114e-02,  1.43857223e-03,  2.31222725e-01],
	[ 1.54970513e-02,  7.71576603e-04,  1.33036929e-01],
	[ 1.69510652e-02,  1.00870331e-03,  2.30476218e-01]
]


// NOTE:THIS IS FOR MALES
const bartol_meas_coefs = [
	[-0.00843030307, 0.00131652804, 0.447547912],
	[-0.120123132, 0.00236365418, 0.434361632],
	[0.193903283, 0.00139706978, 0.219167417],
	[-0.397436516, 0.00736043837, 1.09456939],
	[-0.287314058, 0.00742628431, 0.850773834],
	[0.010597377, 0.00414945566, 0.671920092],
	[0.0118373525, 0.000588985393, 0.103642264],
	[-0.137002408, 0.00245121599, 0.355032717],
	[-0.0214599125, 0.00124200087, 0.218721466],
	[0.336286377, -0.0000717186131, -0.063483009],
	[0.612709628, -0.000969801753, -0.254300726],
	[-0.0583795701, 0.00283900146, 0.474284018],
	[-0.0407932606, 0.00160870682, 0.30903314],
	[0.00520639762, 0.000828895423, 0.149071685],
	[-0.02324052, 0.00121216556, 0.313450831],
];

  const bartol_labels = [
    'head_circumference',
    'neck_circumference',
    'shoulder_to_crotch',
    'chest_circumference',
    'waist_circumference',
    'pelvis_circumference',
    'wrist_circumference',
    'bicep_circumference',
    'forearm_circumference',
    'arm_length',
    'inside_leg_length',
    'thigh_circumference',
    'calf_circumference',
    'ankle_circumference',
    'shoulder_breadth',
  ];


function bodyPartEstimations(heightInMeters, weightInKg) {	
  const measurements = meas_coefs.map((coef) => {
    return heightInMeters * coef[0] + weightInKg * coef[1] + coef[2];
  });

  let output = '';

  for (let i = 0; i < labels.length; i++) {
    output += `${labels[i]}: ${(measurements[i] * 100).toFixed(2)}cm\n`;
  }

  return output;
}

export const bartol_et_al_measurements = (gender, heightInMeters, weightInKg) => {

	let use_these_coef = female_bartol_meas_coefs
	if (gender === 'male'){
		use_these_coef = bartol_meas_coefs;
	}

	

  const measurements = use_these_coef.map((coef) => {
    return heightInMeters * coef[0] + weightInKg * coef[1] + coef[2];
  });

	let estimations = {}
  for (let i = 0; i < bartol_labels.length; i++) {
    estimations[bartol_labels[i]] = measurements[i] * 100;
  }

  estimations['height'] = heightInMeters * 100;
  estimations['weight'] = weightInKg;

  return estimations;
}

const calc_bartol_knee = (meas) => {
	return (meas['thigh_circumference'] + meas['calf_circumference'])/2;
}

const calc_bartol_seatback = (meas) => {
	/*
 Estimating the "seatback" measurement based on waist and pelvis circumferences can be challenging, as it depends on several factors such as body shape, posture, and individual variation. However, you can make a rough estimation using a simple ratio or proportion.

One common approach is to use the waist-to-hip ratio (WHR), which is calculated by dividing the waist circumference by the hip circumference:

WHR = Waist Circumference / Hip Circumference

The WHR is often used as an indicator of body shape. A lower WHR indicates a smaller waist relative to the hips, while a higher WHR indicates a larger waist relative to the hips.

In your case, you have waist and pelvis circumferences. You can calculate the WHR based on these measurements. Then, you can estimate the "seatback" measurement based on the WHR and the known waist circumference.

Here's how you can estimate the "seatback" measurement:

Calculate the WHR:
WHR = Waist Circumference / Pelvis Circumference

Use the WHR to estimate the "seatback" measurement:
Seatback = WHR * Waist Circumference
 */
	const WHR = meas['waist_circumference'] / meas['pelvis_circumference']
	return WHR * meas['waist_circumference'] * 0.8; // constant for demo; need to circle back on this
}

export const bartol_to_part = {
	'Shoulder to wrist (arm)': (meas, heightInMeters) => {return meas['arm_length']}, // does that include the hand?
	'biceps': (meas, heightInMeters) => {return meas['bicep_circumference']},
	'Wrist width': (meas, heightInMeters) => {return meas['wrist_circumference']},
	'Ankle': (meas, heightInMeters) => {return meas['ankle_circumference']},
	'Inseam': (meas, heightInMeters) => {return meas['inside_leg_length']},
	'Knee': (meas, heightInMeters) => {return calc_bartol_knee(meas)},
	'Seatback': (meas, heightInMeters) => {return calc_bartol_seatback(meas)},				
}

const shoulder_to_wrist = "shoulder_to_wrist"
const bicep = "bicep"
const wrist = "wrist"
const ankle = "ankle"
const	inseam = "inseam"
const knee = "knee"
const seatback = "seatback"

export const checkboxStates = [
	shoulder_to_wrist,  // note to self, should really be using const varibale names; tracking this bug cost me 2 h :_(
	bicep,
	wrist,
	ankle,
	inseam,
	knee,
	seatback
]

// TODO: finish after demo given
export const checkBoxToPartId = {
	shoulder_to_wrist: 1,
	bicep: 2,
	wrist: 3,
	ankle: 4,
	inseam: 5,
	knee: 6,
	seatback: 7	
}