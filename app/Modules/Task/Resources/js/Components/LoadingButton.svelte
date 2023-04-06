<script>
    export let loading = false, shouldDisable = false, className = 'readon learn-more submit', icon = undefined, grid = undefined, rounded = false;

    $: props = (({loading, shouldDisable = false, className, icon, grid, ...rest}) => rest)($$props); // pass all other props passed down e.g type=submit to the props variable
</script>

<style lang="scss">
  .btn{
    padding: 7px 20px;

    &.btn-long{
      padding: 7px 30px;
    }

    i, :global(svg:not(.feather)){
        display: none;
    }

    &.is-loading{
      i, :global(svg:not(.feather)){
        display: inline;
      }
    }
  }
</style>

<!-- Example Usage -->
<!-- <LoadingButton type="submit" grid="col-12" slot="footer-button1" className="btn-primary btn-long" icon='check-circle' loading={isLoading} shouldDisable={!details.email || !details.first_name } on:click={() => alert('hello')}>
  Create Product
</LoadingButton> -->

<div class="{grid} text-center">
  <button disabled={loading || shouldDisable} class="btn {className}" class:add-btn={rounded} {...props} class:is-loading={loading} on:click>
    <span class="text">
      <slot/>
    </span>
    {#if undefined !== icon}
      <span class="fa fa-{icon} rui-icon" />
    {/if}
    <i class="fa fa-spinner fa-spin mt-2 ml-5"/>
  </button>
</div>
