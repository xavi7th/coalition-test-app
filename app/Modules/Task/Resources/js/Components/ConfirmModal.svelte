<script>
  import { Portal } from 'svelte-teleport';
  import { inertia } from '@inertiajs/inertia-svelte';
  import { modalRoot } from '@task-shared/stores';

  export let  actionMethod = 'PUT', actionUrl, details = {}, className = "btn-danger btn-sm text-white", dataToReload = [];

  $: {
    try {
      pageModals.teleport_to($modalRoot)
    } catch (e) {}
  }

  let pageModals, shouldTeleport = false, modalInstance = undefined,

  configureRequest = {
    method: actionMethod,
    only: ['flash', 'errors', ...dataToReload],
    preserveState:true,
    preserveScroll:true,
    onBefore: () => {
      BlockToast.fire({ text: "Please wait ..." });
    },
    onSuccess:() => {
      details = {};
    },
    onFinish: () => {
      modalInstance.hide();
    }
  },

  showModal = e => {
    shouldTeleport = true;
    setTimeout(() => {
      (modalInstance = new bootstrap.Modal(document.getElementById('confirm-action-modal'), {})).show()
      jQuery('#confirm-action-modal').on('hidden.bs.modal', () => shouldTeleport = false )
    }, 300);
  }
</script>

<style lang="scss">
  $orange: #4285f4;
  $primary: black;

  .modal{
    .modal-body{
      padding: 1.25rem;
      text-align: center;

      .alert-sign{
        margin: 0 auto;
        margin-top: 0.75rem;
        width: 4rem;
        height: 4rem;
        color: #d00;
        font-size: 4rem;
      }

      .question{
        margin-top: 1.25rem;
        font-size: 2.875rem;
        line-height: 4.25rem;
      }
    }

    .action-buttons{
      padding: 0 1.25rem 2rem;
      text-align: center;
      justify-content: space-around;

      .cancel-button{
        background: #000;
      }
    }

  }
</style>

<!-- USAGE -->
<!-- import ConfirmModal from '@task-components/ConfirmModal.svelte'; -->
<!-- <ConfirmModal actionUrl={route('students.activate', student)} actionMethod="PUT" dataToReload={['student_list']} className="btn-success btn-sm text-white"><i class="fa fa-check mr-5"></i> ACTIVATE </ConfirmModal> -->

<button type="button" class="btn align-items-center {className}" on:click|capture|self|stopPropagation={showModal}>
  <slot />
</button>

{#if shouldTeleport}
  <Portal bind:this={pageModals} >
    {#if actionUrl}
      <div class="modal fade" id="confirm-action-modal" tabindex="-1" role="dialog" aria-labelledby='confirmActionModalLabel' aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">

            <div class="modal-body">
              <i class="alert-sign fa fa-exclamation-circle"></i>
              <div class="question fw-light title">Are you sure?</div>
            </div>
            <div class="modal-footer action-buttons">
              <button type="button" data-bs-dismiss="modal" class="readon started get-ready5 cancel-button">Cancel</button>
              <a href="{actionUrl}"  class="readon started more" use:inertia={configureRequest}>Confirm</a>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </Portal>
{/if}
