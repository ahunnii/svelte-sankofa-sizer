<script>
	//import PPIToMarker from './PPIToMarker.svelte'
	import InchMarker from './InchMarker.svelte' // our virtual marker	

	export let ppi_slider = 72;
	export let height = 45;
	export let length = 3;
	export let unit = "inches"
</script>

<div>
	<div>
<InchMarker 
	unit={unit}
	length={length}
	height={height}
	pixels_per_inch={ppi_slider}
	display_footer={false}
	bg_color={'rgba(255, 213, 45)'}
	/> 
	</div>

	<input type=range min=1 max=326 step=1 bind:value={ppi_slider} />{ppi_slider} ppi
</div>
