<script context="module">
  import PublicPagesLayout from "@task-pages/Layouts/PublicPagesLayout.svelte";
  export const layout = PublicPagesLayout;
</script>

<script>
  import { onMount } from 'svelte';
  import { flip } from "svelte/animate";
  import { fly } from "svelte/transition";
	import { Portal } from 'svelte-teleport';
  import { Inertia } from '@inertiajs/inertia';
  import { page} from "@inertiajs/inertia-svelte";
  import Modal from '@task-components/Modal.svelte';
  import TextInput from "@task-components/TextInput.svelte";
  import { pageTitle, modalRoot } from '@task-shared/stores';
  import LoadingButton from "@task-components/LoadingButton.svelte";
  import DataSearchComponent from '@task-components/DataSearchComponent.svelte';

  export let projects = [];

  $: ({ errors } = $page.props);

  $: {
    try {
      pageModals.teleport_to($modalRoot)
    } catch (e) {};

    filteredRecords = projects;

    pageTitle.update(title => 'Manage Projects');
  }

  let details = {}, pageModals, filteredRecords = [], action, isLoading = false,

 processDetails = () => {
    isLoading = true;

    if (action == 'update') {
      details._method = 'PUT';
    }

    let url = action == 'create' ? route("app.projects.store") : route("app.projects.update", details.id)

    Inertia.post(url, details, {
        preserveState: true,
        preserveScroll: true,
        only: ["flash", "errors", 'projects'],
        onSuccess: () =>{
          details = {};
          jQuery('#createProjectModal').modal('hide');
        },
        onFinish: () => isLoading = false
    })
  }

  onMount(() => {
    jQuery('#createProjectModal').on('hidden.bs.modal', function (e) {
      details = {};
    })
  })
</script>


<style lang="scss">
  .addon-services{
    margin: 0 !important;
    padding: 20px !important;
    position: relative;

    .btn-edit{
      bottom: 20px;
      position: absolute;
      right: 20px;
      z-index: 10;

      li{
        display: inline-block;
      }

      a{
        background: #000;
        border-radius: 8px 8px 8px 8px;
        color: #fff;
        display: block;
        font-size: 14px;
        font-weight: 500;
        padding: 5px 15px;
        transition: .4s;
      }
    }
  }

</style>

<div id="rs-services" class="rs-services style9 pt-120 pb-95 md-pt-80 md-pb-75">
  <div class="container">
    <div class="services-top-section">

      <div class="sec-title6 text-center mb-40">
        <h2 class="title pb-14">
          <span>Projects</span> List
        </h2>
        <div class="title-img">
          <!-- <img src="/assets/img/shap.png" alt="Images"> -->
        </div>
      </div>

      <DataSearchComponent searchData={projects} searchProperty="name" on:results={e => filteredRecords = e.detail} />
      <div class="row vertical-gap mb-100">
        <div class="col d-flex justify-content-center">
          <button type="button" class="btn readon started get-ready5 text-center text-nowrap" data-bs-toggle="modal" data-bs-target="#createProjectModal" on:click="{ () => action = 'create' }"> Create New Project</button>
        </div>
      </div>

      <div class="row">

        {#each filteredRecords as project (project.id)}
          <div class="col-lg-4 col-md-6" animate:flip="{{duration:d => 30 * Math.sqrt(d)}}" in:fly={{x:100}} out:fly={{x:-100}}>
            <div class="services-item">
              <div class="addon-services">
                <div class="services-text">
                  <h2 class="title text-capitalize"> <a href="#/">{project.name}</a></h2>
                </div>
                <ul class="btn-edit">
                  <li><a data-bs-toggle="modal" href="#createProjectModal" on:click="{ () => { action = 'update'; details = project } }">Edit Project</a></li>
                </ul>
              </div>
            </div>
          </div>
        {/each}

      </div>
    </div>
  </div>
</div>

<Portal bind:this={pageModals}>
  <Modal modalId="createProjectModal" modalTitle="{action} Project" lg>
    <form class="rs-my-account" on:submit|preventDefault|stopPropagation={processDetails} id="createProjectForm">

      <div class="row rs-login">
        <TextInput required grid="col-12 mb-30" label="Project Name" name="project-name" type="text" placeholder="Project Name" errors="{errors.name}" bind:val="{details.name}" />
      </div>

    </form>

    <LoadingButton type="submit" form="createProjectForm" slot="footer-button1" loading={isLoading} className="{action === 'update' ? 'btn-warning' : 'btn-success'} btn-long" icon='check-circle' shouldDisable={!details.name }>
      { action === 'update' ? 'Update' : 'Create' } Project
    </LoadingButton>
  </Modal>
</Portal>
