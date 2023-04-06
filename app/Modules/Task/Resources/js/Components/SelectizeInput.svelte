<!-- https://github.com/selectize/selectize.js/blob/v0.12.6/docs/usage.md -->
<script>
  import FlashMessage from '@task-components/FlashMessage.svelte';
  import { onMount } from 'svelte';

  /**
   * @var isCSV {bool} This determines whether to get the values (for multiselect) as an array or as a comma separated value
   * @var canCreateItems {bool} This determines whether the user can create more items on the fly other than those specified
   */
  export let label = undefined, name = undefined, grid = undefined, className = '', isCSV = false, canCreateItems = false, isMultiSelect = false, maxItems = null,
          placeholder = 'Select an option', errors = [], onChange = () => {}, onBlur = () => {}, selectedItems = [], availableItems = [],
          valueField = 'value', labelField = 'text', resetData = undefined, sortField = undefined;

  let val, elem, selectField, displayItems = [],

  initialize = () => {
    /**
     *? When the availableItems option is specified, selectize requires an array of objects. Se we map the numeric array into an array of objects
    */
    if (Array.isArray(availableItems) && (availableItems[0] !== Object(availableItems[0]) )) {
      availableItems = _.map(availableItems, (v) => {
        return {
          value: v,
          text:v
        }
      })
    }
    selectField = jQuery(elem).selectize({
      persist: canCreateItems,
      maxItems: isMultiSelect ? maxItems : 1, // null = unlimited
      placeholder: 'Select ' + placeholder,
      options: availableItems,
      items: selectedItems, // Should be an array of the labelField or the valueField
      valueField: valueField,
      labelField: labelField,
      sortField: sortField || labelField,
      searchField: [labelField],
      selectOnTab: ! isMultiSelect, // when you tab away on the active item without using the enter key, the last selected item is selected
      create: canCreateItems,
      onChange: v => {
        val = isCSV && isMultiSelect ? v.join(',') : (isNaN(v) ? v : Number(v))

        onChange(); // fire any onChange handler that is supplied
      },
      onItemAdd: (value, $item) => {
        // console.log(value, $item);
      },
      onItemRemove: (value, $item) => {
        // console.log(value, $item);
      },
      onBlur: () => {
        onBlur(); // fire any onBlur handler that is supplied
      }
    });
  },

  reInitialize = () => {
    if (selectField) {
      selectField[0].selectize.destroy();
      initialize();
    }
  };

  /**
   * if the value of reset data changes and there is a selectField object, reInitialize the selectize field
   * ? This is useful for resetting on data change
  */
  $: resetData &&  reInitialize()
  $: props = (({ label, name, grid, className, errors, onChange, value, ...rest }) => rest)($$props);
  $: displayItems = isCSV && isMultiSelect ? (val || []).join(',') : (! isCSV && isMultiSelect ? (val || []) : [])

  onMount(() => initialize())

  /**
   * ! Whatever you export like this can be bound to in the component eg bind:val={details.property}
   */
  export { val }
</script>

<style lang="scss" global>
  .rui-custom-selectize {
    position: relative;

    .rui-icon{
      position: absolute;
      top: var(--position);
      right: 30px;
      z-index: 2;
      stroke: #96999c;
      cursor: pointer;

      &::before{
        font-size: 10px;
      }
    }

    .selectize-control{
      text-transform: capitalize;
      background-color: #fbfcfc;
      min-height: 36px;
      padding: 0;
      border: 0;
    }

    .rui-selectize-select .selectize-input{
      border: 1px solid #e6ecf0;
      min-height: 36px;

      background-color: #f6f7f9;
      border-radius: 5px 5px 5px 5px;
      border-style: solid;
      border-width: 0;
      box-shadow: 1px 2.5px 5px 0 #e3e3e3;
      max-width: 100%;
      padding: 20px;
      transition: .2s ease-in-out;
      transition-property: color,background-color,border;
      width: 100%;

      &:after{
        border-color: transparent !important;
      }

      & > div{
        font-weight: 300;
      }
    }
  }

  .rui-selectize .rui-selectize-element .selectize-dropdown{
    border: 1px solid #e6ecf0;
    border-radius: 0.25rem;
    box-shadow: 0 3px 10px rgb(0 0 0 / 3%);
    height: auto;
    margin-top: 10px;
    padding: 9px 5px 10px;

    .option{
      color: #6c757d;
      cursor: pointer;
      padding: 6px 14px;
      transform: 1;
      transition: .1s ease-in-out;
      transition-property: color, transform, font-weight, padding-left;
      padding-left: 15px;

      &.active{
        color: var(--orange);
        font-weight: 900;
        padding-left: 40px;
        transform: scale(1.05);
      }
    }
  }

  .items-display{
    max-height: 300px;
    overflow-y: auto;
    margin-left: -5px;
    margin-right: -5px;
  }
</style>

<!-- Example Usage -->
<!-- <SelectizeInput grid="col-12" bind:val={details.category_id}  placeholder="Category" label="Category" name="category" onChange={() => alert('hi')} canCreateItems isMultiSelect isCSV maxiTems="5" selectedItems="{['Pro']}" resetData={details.name}>
  {#each categories as category}
    <option value={category.id}>{category.name}</option>
  {/each}
</SelectizeInput> -->
<!-- OR -->
<!-- <SelectizeInput required grid="col-12" className="mb-30" bind:val={details.series}  label="Add New Series" name="modelSeries" availableItems="{[{name: 'Pro'}, {name: 'Air'}, {name: 'Pavilion'}]}" selectedItems="{['Pro']}" canCreateItems isMultiSelect valueField='name' labelField='name' resetData={details.name}/> -->

{#if isMultiSelect}
  <div class="items-display row xs-gap mb-15 text-center fw-light">
    {#each displayItems as item}
      <div class="col-sm">
        <div class="bg-grey-1 p-5 br-4 text-nowrap mb-5"> { item } </div>
      </div>
    {/each}
  </div>
{/if}

<div class="rui-selectize rui-custom-selectize {grid} fw-light pl-15 pr-15">
  {#if label}
    <label class="form-label" for={name}>Select {label}:</label>
  {/if}
  <span class="flaticon-search rui-icon rui-icon-stroke-1_5 rui-selectize-select-icon" style="--position:{label ? '53px' : '33px'}"></span>
  <select id={name} name={name} {...props} class="form-control rui-selectize-element rui-selectize-select {className}" class:error={errors} bind:this={elem}>
    <slot />
  </select>

  {#if errors}
    <FlashMessage formError={errors} />
  {/if}
</div>
