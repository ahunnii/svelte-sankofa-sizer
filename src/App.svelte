<!-- Svelte Component -->
<script>
	import BodyPartsUI from './BodyPartsUI.svelte'
	import VirtualPattern from './VirtualPattern.svelte'
	import BodyMeasurements from './BodyMeasurements.svelte'
	import Popup from './Popup.svelte'

	let components = [BodyPartsUI, VirtualPattern, Popup];
	let activeComponent = components[0]; // at the start, show Component1
	
	function next() {
	    const i = components.indexOf(activeComponent);
	    activeComponent = components[i + 1]; // proceeds to next component
	}
	
	function back() {
	    const i = components.indexOf(activeComponent);
	    activeComponent = components[i - 1]; // goes back to previous component
	}
	
</script>
<div class="button-container">
  <button on:click={back} disabled={activeComponent === components[0]} class="button">Back</button>
  <button on:click={next} disabled={activeComponent === components[components.length - 1]} class="button">Next</button>
</div>

<div class="new-row">	
    <div class="rounded-border component">
			<svelte:component this={activeComponent} />
		</div>
		{#if activeComponent === VirtualPattern}
    <div class="rounded-border component">
			<BodyMeasurements />
		</div>
		{/if}
</div>

<style>

 .button-container {
    display: flex;
    align-items: center;
    margin-top: 20px; /* Adjust the margin as needed */
  }

  .button {
    background-color: rgb(128,128,0);
    color: white; /* Text color */
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }

  .button:disabled {
    background-color: #ccc; /* Change to your preferred disabled button color */
    cursor: not-allowed;
  }
	
  /* Style for adding a rounded curved border */
  .rounded-border {
    border: 1px solid lightgray;
    border-radius: 10px;
    padding: 100px;
    margin: 5px;
  }

  /* Style for arranging components in a new row */
  .new-row {
    display: flex;
    flex-direction: row; /* Display items in a column */
		
  }

  /* Style to target each component */
  .component {
    /* Additional component-specific styles here */
  }

/* Visually hide origin marker */
:global(.moveable-origin) {
	border-color: transparent  !important;
	background: transparent  !important;
}

/* Moveable-svelte CSS for markers */

/* Visually hide draggable markers */
:global(.moveable-resizable) {
	border-color: transparent  !important;
	background: transparent  !important;
}
	
</style>