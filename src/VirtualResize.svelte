<script>
	import { onMount } from "svelte";
	import VirtualizedInchMarker from './VirtualizedInchMarker.svelte'	
	import Switch from './Switch.svelte'	

	import {the_id_of_the_base_pattern, parts, pixels_per_inch, actual_pattern } from './utils.js'
	import Moveable from "svelte-moveable";
	import { throttle } from "@daybrush/utils";	

	let image_url = "https://www.theshapesoffabric.com/wp-content/uploads/2022/11/sleeve-pattern-parts.jpg";

  function updateLength(event, index) {
		//event.stopPropagation()
    const newLength = Number(event.target.value);
    if (newLength > 0) {
      parts.update(($parts) => {
        $parts[index].actual_length = newLength;
        return $parts;
      });
    }
  }

	let multiValue;
	let largest_width;
	let largest_height
	$: {
		
		let the_lengths = $parts.map(part => 
			part.type === "vertical" ? part.virtual_length : -1
		)
		largest_height = Math.max(...the_lengths)
	}

	$: {
		let the_lengths = $parts.map(part => 
			part.type === "horizontal" ? part.virtual_length : -1
		)
		largest_width = Math.max(...the_lengths)
	}
/*
	// pre-scale the image so it's not such a pain to resize rulers onto it
	const handleImageLoad = (event) => {
		// modifying the value make moveable set the pattern as moveable again
		// very strange behavior

		function nudge_image(event){
			event.target.width = event.target.width
			event.target.height = event.target.height
	
			$actual_pattern['width'] = event.target.width
			$actual_pattern['height'] = event.target.height
	
			$actual_pattern['blob'] = event.target.src;			
		}

		setTimeout(function (event) {
			nudge_image(event);
		  console.log('nudging image so it actually can be manipulated')
		}, 1000)
	}
 */

	const ruler_length_inches = 80;
	const ruler_height_px = 3099;
	const ruler_width_px = 39;
	const ruler_inch_px = 39; 
	const virtual_constant = 2.046 // todo: weirdness
	
	let device_pixels_per_inch;
	$: backgroundSize_hortz = `100% ${ruler_height_px/$pixels_per_inch}px`;
	$: backgroundSize_vert = `${ruler_height_px/$pixels_per_inch}px 100% `;	

	// 			    background-size: { scale_factor(part.virtual_length) * $pixels_per_inch * part.virtual_length}px 100%;
	const scale_factor = (virtual_length, part_type) => {
		// used within
		// 			    background-size: { scale_factor(part.virtual_length) * $pixels_per_inch * part.virtual_length}px 100%;
		// something strange about this conversion, I thought it would be more straightforward

		const the_factor = (ruler_inch_px / virtual_length) * virtual_constant * $pixels_per_inch * virtual_length;
		return  part_type === "horizontal" ? `${the_factor}px 100%` : `100% ${the_factor}px`
	}
	

</script>

<VirtualizedInchMarker 
	bind:ppi_slider={$pixels_per_inch}
	length=1
	height=35
/>


{#each $parts as part, index}	
		{#if part.selected}	
<div class="virtual-part">		
		<!-- This is the ruler, a gray rect that is horizontal or vertical; the user moves this into place on their pattern -->		
			<div
				class={"virtual-part-"+index + " virtual-part " + (part.type === "vertical" ? "vertical-line" : "horizontal-line")}
				style="
					width: {part.type === 'horizontal' ? part.virtual_length * $pixels_per_inch : ruler_width_px}px;
					height: {part.type === 'vertical' ? part.virtual_length * $pixels_per_inch : ruler_width_px}px;
			    background-size: {scale_factor(part.virtual_length, part.type)};
			    overflow: hidden; /* Clip the graphic to the specified number of inches */
					position: relative;
					opacity: 0.7;
				"
				tabindex={index}
				role="button"				
			>
				<!--
				<span 
						class="part-name"
						style="
							transform: rotate({part.type === "vertical" ? -90 : 0}deg) !important;
							z-index: 1;
							top: 0;
							overflow: visible;
							"
						>
						{part.name}
					</span>
				-->
				<div id={"input-virtual-part-"+index}>
	        <input
	          type="number"
	          value={part.actual_length}
	          class="length-input no-spinner"
						on:click={() => {}}
	          on:input={(event) => updateLength(event, index)}
						style="
							z-index: 1;
							top: 0;
						"
	        />
	      </div>			
			</div>
		<Moveable
			target={".virtual-part-"+ index}	
			edge={true}
			draggable={true}
			rotatable={true}
			hideDefaultLines={true}
			rotationPosition={'left'} 
			on:drag={({ detail: e }) => {
				e.target.style.transform = e.transform;

				// update part offset so that we can plot in actual space later
				$parts[index].x = e.translate[0]
				$parts[index].y = e.translate[1]

				/*
				// update input box rotation				
				let input = document.getElementById("input-virtual-part-"+index)
				input.style.transform = e.transform;
				*/
			}}
			on:resize={({ detail: e }) => {
				e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
				e.target.style.transform = e.drag.transform;

				$actual_pattern['width'] = e.width;
				$actual_pattern['height'] = e.height;
				
			}}
			on:beforeRotate={({ detail: e }) => {
				e.setRotation(throttle(e.rotation, 15));
			}}			
			on:rotate={({ detail: e }) => {
				// Apply the transformation to the Moveable target
				  e.target.style.transform = e.drag.transform;
			}}
		/>
	</div>
{/if}			
	{/each}

<img 
	id="virtual-pattern" 
	class="virtual-pattern" 
	alt="" 
	src={image_url} 
	/>
	<Moveable
		target=".virtual-pattern"
		edge={true}
		resizable={true}
		on:resize={({ detail: e }) => {
				e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
				$actual_pattern['width'] = e.width;
				$actual_pattern['height'] = e.height;				
		}}
		/>
<!--
		renderDirections={["nw","ne","n"]}

	<Moveable
		target=".virtual-pattern"
		warpable={true}
		renderDirections={["sw","s","se"]}
		on:warp={({ detail: e }) => {
			e.target.style.transform = e.transform;
			}}
		/>
{multiValue}
-->

<!--
	<Moveable
		target=".virtual-pattern"
		edge={multiValue != 'Warp'}
		resizable={true}
		bounds={{ left: 0, top: 0, bottom: 0, right: "", position: "css" }}	
		on:resize={({ detail: e }) => {
			e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
			$actual_pattern['width'] = e.width;
			$actual_pattern['height'] = e.height;
	
		}}
	/>

-->

<style>		
	.virtual-part {
		position: absolute;
		white-space: nowrap;
		color: black;
	}
	
  .vertical-line {
    width: 10px;
    /* 
		background-color: rgba(0, 0, 0, 0.4); */
		background-image: url("https://raw.githubusercontent.com/robinsonkwame/af-parametric-sewing/4074fa1ae9314b76265fa16134613b563cfa7b13/tmp/tape_vertical.jpeg");
		/*background-size: 100% auto;*/
		background-repeat: no-repeat;		
		border: 1px solid black;
		will-change: transform;		
  }

	/*
		background-image: url("https://raw.githubusercontent.com/robinsonkwame/af-parametric-sewing/4074fa1ae9314b76265fa16134613b563cfa7b13/tmp/tape_vertical.jpeg");
		background-size: 100% auto;
		background-repeat: no-repeat;		
		border: 1px solid black;
		will-change: transform;	
	*/
	
  .horizontal-line {
    height: 10px; 
    /*background-color: rgba(0, 0, 0, 0.4);		*/
		background-image: url("https://raw.githubusercontent.com/robinsonkwame/af-parametric-sewing/4074fa1ae9314b76265fa16134613b563cfa7b13/tmp/tape_horizontal.jpeg");
		background-repeat: no-repeat;		
		border: 1px solid black;
		will-change: transform;				
  }

  .part-name {
    margin-left: 0.25em;
		position: relative;
		top: -1.7em;		
		color: black;
  }
	
  .length-input {
		position: relative;
		top: -2em;
    width: 2.5em;
	  -webkit-appearance: none;
	  -moz-appearance: textfield;
	  appearance: textfield;		
	}

	/* Chrome, Safari, Edge, Opera */
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox 
.input-length[type=number] {
  -moz-appearance: textfield;
}
	*/
	
  .length-container {
  }

	.virtual-pattern {
		pointer-events: none;
		z-index: -1;
	}
	
</style>