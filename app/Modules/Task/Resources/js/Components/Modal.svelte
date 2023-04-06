<script>
  import { onDestroy, onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let modalId, modalTitle, centered = false, lg = false, sm = false, xl = false;

  let modal;

  onDestroy(() => {
    modal.parentNode.removeChild(modal)
  })

  onMount(() => jQuery(`#${modalId}`).on('hidden.bs.modal', () => dispatch('modal-closed') ) )
</script>

<style lang="scss">
  .close{
    background: #ffffff;
    color: #0a0a0a;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
    border: none;
    border-radius: 50%;
    transition: all .5s ease;

    [class^=flaticon-]:before{
      font-size: 12px;
    }
  }
</style>

<!-- EXAMPLE USAGE -->

<!-- <Modal modalId="updateUserPermissionsModal" modalTitle="Update User Permissions" on:modal-closed={() => shouldTeleport = false} centered lg>

  <LoadingButton on:click={updateUserPermissions} slot="footer-button1" loading={isLoading} className="btn-success btn-long" icon='check-circle'>Update User Permissions</LoadingButton>
</Modal> -->

<div class="modal fade" id={modalId} tabindex="-1" role="dialog" aria-labelledby={`${modalId}Label`} aria-hidden="true" bind:this={modal}>
  <div class="modal-dialog" class:modal-dialog-centered={centered} class:modal-lg={lg} class:modal-sm={sm} class:modal-xl={xl} role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title h2 text-capitalize" id={`${modalId}PopupLabel`}>{@html modalTitle}</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span class="flaticon-cross"></span>
        </button>
      </div>

      <div class="modal-body">
        <slot />
      </div>

      <div class="modal-footer">
        <slot name="footer-button1" />
        <slot name="footer-button2" />
        <slot name="footer-button3" />
        <slot name="footer-button4" />
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Close
        </button>
      </div>
    </div>
  </div>
</div>
