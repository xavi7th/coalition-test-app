<script>
  import FlashMessage from '@task-components/FlashMessage.svelte';
  import { afterUpdate } from 'svelte';


  export let label = undefined, name = undefined, grid = undefined, className = '', errors = [], placeholder = undefined, delimiter=';';

  let val;

  $: props = (({ label, name, className, errors, grid, ...rest }) => rest)($$props);

  /**
   * ! Whatever you export like this can be bound to in the component eg bind:val={details.property}
   */
   export { val };

   afterUpdate(() => {
    if (Array.isArray(val)) {
      val = val.join(delimiter);
    }
   })
</script>

<!-- Example Usage -->
<!-- <TextAreaInput className="p-0" label="Phone" name="phone" placeHolder="Username" delimiter="," errors={errors.password} bind:val={details.summary}/> -->

<style lang="scss">
  .form-input{
    position: relative;

    .form-label{
      font-weight: normal;
    }

    .form-control{
      padding: 20px 20px 20px 20px;
      border-radius: 5px 5px 5px 5px;
      border-style: solid;
      border-width: 0 0 0 0;
      background-color: #F6F7F9;
      width: 100%;
      max-width: 100%;
      box-shadow: 1px 2.5px 5px 0 #e3e3e3;
      transition: .2s ease-in-out;
      transition-property: color, background-color, border;

      &textarea{
        height: 120px;
      }

      &:focus{
        outline: 0;
        background-color: #fff;
        border-color: var(--brand);
        border-width: 1px;
        box-shadow: none;
      }
    }

    .border-rounded{
      border-radius: 7px;
    }
  }
</style>

<!-- Example Usage -->
<!-- <TextAreaInput grid="col-lg-6 mb-30 col-md-6 col-sm-6" label="Address" name="address" placeholder="User Address" errors={errors.address} bind:val={details.address}/> -->

<div class="form-input {grid}">
  {#if label}
      <label class="form-label" for={name}>{label}:</label>
  {/if}

  <textarea id={name} name={name} {...props} {placeholder} class="form-control {className}" class:error={errors && errors.length} on:blur bind:value="{val}" />

  {#if errors && errors.length}
    <FlashMessage formError={errors} />
  {/if}
</div>
