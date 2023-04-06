<script>
  import { onMount } from 'svelte';


  export let label = undefined, placeHolder = undefined, name = undefined, className = '', errors = [], tags = {}, onBlur = () => {}, canCreate = false, grid = '';

  $: props = (({ onChange, label, name, className, errors, tags, onBlur, grid, ...rest }) => rest)($$props);

  let elem, val = _.isString(tags) ? tags : ( Array.isArray(tags) ? tags.join(',') : Object.values(tags).join(',') );

  $: addedItems = _.isString(val) ? val.split(',') : ( Array.isArray(val) ? val : Object.values(val) )
  /**
   * ! Whatever you export like this can be bound to in the component eg bind:val={details.property}
   */
   export { val };

   onMount(() => {

    jQuery(elem).selectize({
      delimiter: ",",
      persist: true,
      create: canCreate,
      // onItemAdd: (value, $item) => {
      //   console.log(value, $item);
      // },
      // onItemRemove: (value, $item) => {
      //   console.log(value, $item);
      // },
      onChange: v => {
        val =  v
      },
      onBlur: () => {
        onBlur(); // fire any onBlur handler that is supplied
      }
    });
   })
</script>

<style lang="scss">
  .form-input{
    position: relative;

    .form-control{
      transition: .2s ease-in-out;
      transition-property: color, background-color, border;

      &:focus{
        outline: 0;
        background-color: #fff;
        border-color: var(--brand);
        box-shadow: none;
      }
    }

    .border-rounded{
      border-radius: 7px;
    }
  }
</style>

<!-- Example Usage -->
<!-- <TagTextInput grid="col-12" tags="{tags}" bind:val="{details.selxc}" label="Other Options" name="other-options" errors={errors.selxc} type="text"/> -->

<div class="row xs-gap mb-15 text-center">
  {#each addedItems as item}
     <div class="col-sm">
         <div class="bg-grey-1 p-5 br-4 text-nowrap mb-5"> { item } </div>
     </div>
  {:else}
     <div class="col-12">
         <div class="bg-grey-1 pt-15 pr-20 pb-15 pl-20 br-4">No Items Added Yet</div>
     </div>
  {/each}
</div>

<div class="form-input rui-selectize rui-custom-selectize {grid}">
  {#if label}
      <label for={name}>{label}:</label>
  {/if}

  <input id={name} name={name} {...props} bind:this={elem} bind:value="{val}" class="form-control rui-selectize-element rui-selectize-input {className}" {placeHolder} class:error={errors && errors.length}/>

  {#if errors && errors.length}
      <div class="form-error">{errors}</div>
  {/if}
</div>
