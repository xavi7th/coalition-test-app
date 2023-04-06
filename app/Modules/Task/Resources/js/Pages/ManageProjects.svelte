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

  export let course_categories = [];

  $: ({ errors } = $page.props);

  $: {
    try {
      pageModals.teleport_to($modalRoot)
    } catch (e) {};

    filteredRecords = course_categories;

    pageTitle.update(title => 'Manage Course Categories');
  }


  let details = {}, pageModals, filteredRecords = [], action, isLoading = false,

 processDetails = () => {
    isLoading = true;

    if (action == 'update') {
      details._method = 'PUT';
    }

    let url = action == 'create' ? route("coursecategories.store") : route("coursecategories.update", details.id)

    Inertia.post(url, details, {
        preserveState: true,
        preserveScroll: true,
        only: ["flash", "errors", 'course_categories'],
        onSuccess: () =>{
          details = {};
          jQuery('#createCategoryModal').modal('hide');
        },
        onFinish: () => isLoading = false
    })
  }

  onMount(() => {
    jQuery('#createCategoryModal').on('hidden.bs.modal', function (e) {
      details = {};
    })
  })
</script>

<div id="rs-services" class="rs-services style9 bg26 pt-120 pb-95 md-pt-80 md-pb-75">
  <div class="container">
    <div class="services-top-section">

      <div class="sec-title6 text-center mb-40">
        <h2 class="title pb-14">
          <span>Programmes</span> List
        </h2>
        <div class="title-img">
          <img src="/assets/img/shape.png" alt="Images">
        </div>
      </div>

      <DataSearchComponent searchData={course_categories} searchProperty="name" on:results={e => filteredRecords = e.detail} />
      <div class="row vertical-gap mb-100">
        <div class="col d-flex justify-content-center">
          <button type="button" class="readon started get-ready5 text-center text-nowrap" data-bs-toggle="modal" data-bs-target="#createCategoryModal" on:click="{ () => action = 'create' }"> Create New Programme</button>
        </div>
      </div>

      <div class="row">

        {#each filteredRecords as category (category.id)}
          <div class="col-lg-4 col-md-6" animate:flip="{{duration:d => 30 * Math.sqrt(d)}}" in:fly={{x:100}} out:fly={{x:-100}}>
            <div class="services-item">
              <div class="image-part">
                <img src="{category.poster_thumb_url || '/assets/img/services/style11/1.jpg'}" alt="Services">
                <ul class="btn-edit">
                  <li><a data-bs-toggle="modal" href="#createCategoryModal" on:click="{ () => { action = 'update'; details = category } }" class="btn-xs">Edit Category</a></li>
                </ul>
              </div>
              <div class="addon-services">
                <div class="services-icon">
                  <img src="{category.icon_url || '/assets/img/services/style11/icons/1.png'}" alt="Icons">
                </div>
                <div class="services-text">
                  <h2 class="title text-capitalize"> <a href="#/">{category.name}</a></h2>
                </div>
              </div>
            </div>
          </div>
        {/each}

      </div>
    </div>
  </div>
</div>

<Portal bind:this={pageModals}>
  <Modal modalId="createCategoryModal" modalTitle="{action} Programme" lg>
    <form class="rs-my-account" on:submit|preventDefault|stopPropagation={processDetails} id="createCategoryForm">

      <div class="row rs-login">
        <TextInput required grid="col-12 mb-30" label="Programme Name" name="category-name" type="text" placeholder="Programme Name" errors="{errors.name}" bind:val="{details.name}" />
      </div>

    </form>

    <LoadingButton type="submit" form="createCategoryForm" slot="footer-button1" loading={isLoading} className="{action === 'update' ? 'btn-warning' : 'btn-success'} btn-long" icon='check-circle' shouldDisable={!details.name }>
      { action === 'update' ? 'Update' : 'Create' } Programme
    </LoadingButton>
  </Modal>
</Portal>
