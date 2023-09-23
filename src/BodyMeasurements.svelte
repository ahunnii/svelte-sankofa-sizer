<script>
  import { onMount } from 'svelte';
  import { draggable } from './draggable.js';	
  import { createEventDispatcher } from 'svelte';
	import { parts, updateParts, addModifiedParts, add_image_toggle, bartol_et_al_measurements, bartol_to_part } from './utils.js';
	const dispatch = createEventDispatcher(); // for cloning pattern in Interpolator

	/*
		 This should be updated to work in inches and pounds ... :X
 */
	
	//export let unit = "mm"
	let clonedImage;
	
  let cursorX = -9999; // Initial value set far outside the viewport
  let cursorY = -9999; // Initial value set far outside the viewport
  let isMouseOverImage = false;
  let image;
  let handleClickEnabled = true;

  function cloneImage() {
		$add_image_toggle = !$add_image_toggle // Interpolator.svelte handles
  }
	
  function handleMouseMove(event) {
    if (isMouseOverImage) {
      cursorX = event.clientX;
      cursorY = event.clientY;
    }
  }
	
	//const to_inch = () => {return 2.53} // cm -> inch
	const to_cm = () => {return 2.53} // inch -> cm
	const cm_to_inch = () => {return 0.393701} // cm -> inch	

	let weightInLb = 191;
	let heightInInches = 72;
	let gender = "female"

	let weightInKg = 87;
	let heightInMeters = 1.83;

	$: weightInKg = weightInLb * 0.453592;
	$: heightInMeters = heightInInches / 39.37;

  function handleClick() {
/*
	'Ankle': (meas, heightInMeters) => {return meas['ankle_circumference']},
	'Inseam': (meas, heightInMeters) => {return meas['inside_leg_length']},		
 	'Knee': (meas, heightInMeters) => {return calc_bartol_knee(meas)},			

*/
		let bartol = bartol_et_al_measurements(gender, heightInMeters, weightInKg)

		let newValues = [
			{length: bartol_to_part['Shoulder to wrist (arm)'](bartol, heightInInches * to_cm()) * cm_to_inch()},
			{length: bartol_to_part['biceps'](bartol, heightInInches * to_cm())  * cm_to_inch()},
			{length: bartol_to_part['Wrist width'](bartol, heightInInches * to_cm())  * cm_to_inch()},
			{length: bartol_to_part['Ankle'](bartol, heightInInches * to_cm())  * cm_to_inch()},
			{length: bartol_to_part['Inseam'](bartol, heightInInches * to_cm())  * cm_to_inch()},			
			{length: bartol_to_part['Knee'](bartol, heightInInches * to_cm())  * cm_to_inch()},
			{length: bartol_to_part['Seatback'](bartol, heightInInches * to_cm())  * cm_to_inch()},			
		]		

				updateParts(newValues);
  }

</script>


<style>
	.container {
	  display: flex;
	  flex-direction: column;
		color: black;
		background-color: white;
	}
	
	.input-wrapper {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 10px; 
	}

	.estimate-input {
		width: 3em;
	}
	
	.gender {
		height: 2em;
	}	
/*todo: fig out later */
	.measurement-button {
		display: flex;
		align-items: center;	
	}
</style>

<div class="container">
  <div class="input-wrapper">
    <div>height (in)</div>
    <div>
			<input class="estimate-input" step="1" type="number" bind:value={heightInInches} />
		</div>
  </div>
  <div class="input-wrapper">
    <div>weight (lb)</div>
    <div>
			<input class="estimate-input" step="1" type="number" bind:value={weightInLb} />
		</div>
  </div>

	<div class="input-wrapper">
		<div> 
			gender
		</div>
		<div class="gender">
			<select name="gender" id="cars" bind:value={gender}>
			  <option value="female">female</option>
			  <option value="male">male</option>
			</select>		
		</div>
	</div>
	
  <div class="measurement-button">
		<div>
			<button on:click={handleClick}>
			Add Measurement Rulers		
			</button>
		</div>
	</div>
</div>
