<script>
  import FlashMessage from '@task-components/FlashMessage.svelte';
  import { isNumeric } from "@task-shared/helpers";

  export let label = undefined, inputIcon = null, flipIcon = false, placeholder = undefined, name = undefined, grid = '', errors = [], className = '';

  let val;

  $: val = isNumeric(val) && $$props['type'] == 'number' ? Number(val) : val;

  $: props = (({ label, name, grid, errors, ...rest }) => rest)($$props);


  /**
   * ! Whatever you export like this can be bound to in the component eg bind:val={details.property}
   */
   export { val };
</script>

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

    .has-icon{
      padding-left: 42px !important;
    }

    .form-icon{
      position: absolute;
      bottom: auto;
      top: 3.3rem;
      left: 7px;
      width: 42px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      color: #999;

      &:not(a):not(button):not(input) {
        pointer-events: none;
      }

      &-flip {
        left: auto !important;
        right: .5rem !important;

        &~.has-icon{
          padding-right: 42px !important;
          padding-left: 20.5px !important;
        }
      }
    }

  }
</style>

<!-- Example Usage -->
<!-- <TextInput grid="uk-margin-small uk-width-1-1 uk-inline" label="Password" name="password" type="password" inputIcon="fa-user" flipIcon={true} placeholder="Username" errors={errors.password} bind:val={details.password}/> -->

<div class="form-input {grid}">
  {#if label}
      <label for={name} class="form-label">{label}:</label>
  {/if}

  <span class="form-icon fa {inputIcon} fa-sm" class:form-icon-flip={flipIcon}></span>
  <input id={name} name={name} {...props} class="form-control {className}" {placeholder} class:error={errors && errors.length} class:has-icon={inputIcon} on:blur on:keypress bind:value="{val}"/>

  {#if errors}
    <FlashMessage formError={errors} />
  {/if}
</div>
