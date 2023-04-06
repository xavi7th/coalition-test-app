<script context="module">
  import { tweened } from "svelte/motion";

  const createStyle = ({
    from = 0,
    to = 1,
    reverse = false,
    duration = 300,
    delay = 0,
    css = {},
    onChange = () => false,
    onEnd = () => false,
    easing
  }) => {
    const animation = tweened(reverse ? to : from, {
      duration,
      delay,
      easing
    });
    animation.subscribe(t => {
      let newStyle = "";
      for (let item in css) {
        const {
          input,
          output,
          onComplete = () => false,
          beforeStart = () => false
        } = css[item];
        const inRange = input.filter(i => i <= t).reverse()[0];
        const index = input.indexOf(inRange);
        let val;
        if (!inRange && inRange !== 0) {
          val = output[0];
          beforeStart();
        } else {
          if (input.length - 1 === index) {
            val = output[output.length - 1];
            input[input.length - 1] <= t && onComplete();
          } else {
            const endRange = input[index + 1];
            const percent = ((t - inRange) * 100) / (endRange - inRange);
            const firstItem = output[index];
            const lastItem = output[index + 1];
            if (typeof lastItem === "object") {
              val = "";
              lastItem.map(i => {
                val += firstItem + ((i - firstItem) * percent) / 100;
                val += " ";
              });
            } else {
              val = firstItem + ((lastItem - firstItem) * percent) / 100;
            }
          }
        }
        newStyle += `${item}: ${val};`;
      }
      onChange(newStyle);
      if (t === to || t === from) {
        onEnd();
      }
    });
    return {
      play: () => animation.set(to),
      reverse: () => animation.set(from)
    };
  };

export { createStyle };
</script>

<script>
  import { sineInOut } from "svelte/easing";
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  let self,
    mounted = false,
    canChange = true,
    changeBg = false,
    borderStyle,
    checkStyle,
    val = undefined;

  export let
    value = '',
    group = [],
    checked = group.indexOf(value) >= 0,
    label = undefined,
    size = "3",
    name = "",
    duration = 500,
    primaryColor = "var(--brand)",
    secondaryColor = "var(--secondary)";

  $: props = (({ checked, size, name, primaryColor, secondaryColor, duration, value, ...rest }) => rest)($$props);

  $: updateValue(checked)

  const animationOptions = {
    to: 100,
    duration,
    easing: sineInOut,
    reverse: checked
  };

  const borderAnimation = createStyle({
    ...animationOptions,
    duration,
    css: {
      "stroke-dashoffset": {
        input: [0, 45, 75],
        output: [342, -150, -307],
        onComplete: () => (changeBg = true)
      },
      "stroke-dasharray": {
        input: [0, 45, 75],
        output: [342, 154, [0, 310]]
      },
      opacity: { input: [0, 5], output: [0, 1] }
    },
    onChange: style => (borderStyle = style),
    onEnd: () => (canChange = true)
  });

  const checkAnimation = createStyle({
    ...animationOptions,
    css: {
      "stroke-dashoffset": {
        input: [65, 100],
        output: [300, 144],
        beforeStart: () => (changeBg = false)
      },
      "stroke-dasharray": { input: [65, 100], output: [100, 84] }
    },
    onChange: style => (checkStyle = style)
  });

  const handleChange = () => {
    if (!canChange) return false;
    if (checked) {
      checkAnimation.reverse();
      borderAnimation.reverse();
    } else {
      borderAnimation.play();
      checkAnimation.play();
    }
    canChange = false;
    checked = !checked;
    if (checked) {
      dispatch("change", value);
    }
    else{
      dispatch("change", '');
    }
  };

	const updateValue = (checked) => {
    if (!mounted) return;

    val = checked ? value : undefined;

    /** update group */
    const index = group.indexOf(value)
		if (checked) {

			if (index < 0) {
				group.push(value)
				group = group
			}
      dispatch("selected");
		} else {
			if (index >= 0) {
				group.splice(index, 1)
				group = group
			}
      dispatch('unchecked')
		}
	};

  const setProp = (prop, val) => self.style.setProperty(prop, val);

  onMount(() => {
    setProp("--checkbox-color-primary", primaryColor);
    setProp("--checkbox-color-secondary", secondaryColor);

    mounted = true;
  });


  /**
   * ! Whatever you export like this can be bound to in the component eg bind:val={details.property}
   */
   export { val };
</script>

<style>
  .checkbox {
    --checkbox-color-primary: var(--brand);
    --checkbox-color-secondary: var(--secondary);
    --checkbox-border-width: 4%;
    --checkbox-border-width-active: 7%;
    position: relative;
  }
  .checkbox input {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }
  .checkbox__svg {
    width: 100%;
    height: 100%;
    margin-bottom: 2px;
  }
  .checkbox__check,
  .checkbox__border {
    stroke-width: var(--checkbox-border-width);
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .checkbox__border {
    width: calc(100% - (var(--checkbox-border-width) * 2));
    height: calc(100% - (var(--checkbox-border-width) * 2));
    transform: translate(
        calc(var(--checkbox-border-width) * -1),
        var(--checkbox-border-width)
      )
      rotate(90deg);
    stroke: var(--checkbox-color-secondary);
    transition: 0.2s;
    transform-origin: 50% 50%;
  }
  .checkbox__border.-active {
    stroke: var(--checkbox-color-primary);
    transition: none;
  }
  .checkbox:hover .checkbox__border,
  .checkbox.-checked .checkbox__border {
    --checkbox-border-width: var(--checkbox-border-width-active);
  }
  .checkbox.-changeBg .checkbox__border {
    stroke: var(--checkbox-color-primary);
  }
  .checkbox__check {
    --checkbox-border-width: var(--checkbox-border-width-active);
    stroke: var(--checkbox-color-primary);
  }

  label{
    cursor: pointer;
  }
</style>

<!-- Usage Exmples  -->
<!-- <CheckBoxInput class="main__checkbox" size="{size}" bind:checked name="inputName" secondaryColor="rgba(1, 50, 67,0.2)" primaryColor="rgb(77, 5, 232)" /> -->
<!-- <CheckBoxInput class="main__checkbox" size="{size}" checked={true} on:change={handleChange} /> -->
<!-- <CheckBoxInput className="pr-6 pb-8 w-full lg:w-1/2" label="Remember me" name="remember" errors={errors.remember} bind:checked={details.remember}/> -->

<div bind:this={self} class="d-inline-block checkbox {$$props.class}" class:-changeBg={changeBg} class:-checked={checked || !canChange} style="width: {size}rem;height: {size}rem;">
  <input id={name} type="checkbox" on:change={handleChange} {name} {...props} {value}/>
  <svg class="checkbox__svg" preserveAspectRatio="none" viewBox="0 0 100 100">
    <rect class="checkbox__border" rx="15%" />
    <rect class="checkbox__border -active" style={borderStyle} rx="15%" />
    <path style={checkStyle} class="checkbox__check" d="M 89.5 13 L 46 71 L 28 54" />
  </svg>
</div>
{#if label}
  <label for={name} class="mr-10 mb-0"> {label} </label>
{/if}
