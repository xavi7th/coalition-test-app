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
  import SelectizeInput from '@task-components/SelectizeInput.svelte';
  import DataSearchComponent from '@task-components/DataSearchComponent.svelte';

  export let course_categories = [], skill_sets = [];

  $: ({ errors } = $page.props);

  $: {
    try {
      pageModals.teleport_to($modalRoot)
    } catch (e) {};

    filteredRecords = skill_sets;

    pageTitle.update(title => 'Manage Skill Sets');
  }


  let details = {}, pageModals, filteredRecords = [], action, isLoading = false,

 processDetails = () => {
    isLoading = true;

    if (action == 'update') {
      details._method = 'PUT';
    }

    let url = action == 'create' ? route("skillsets.store") : route("skillsets.update", details.id)

    Inertia.post(url, details, {
        preserveState: true,
        preserveScroll: true,
        only: ["flash", "errors", 'skill_sets'],
        onSuccess: () =>{
          details = {};
          jQuery('#skillSetModal').modal('hide');
        },
        onFinish: () => isLoading = false
    })
  }

  onMount(() => {
    jQuery('#skillSetModal').on('hidden.bs.modal', function (e) {
      details = {};
    })
  })
</script>

<div id="rs-services" class="rs-services style9 bg26 pt-120 pb-95 md-pt-80 md-pb-75">
  <div class="container">
    <div class="services-top-section">

      <div class="sec-title6 text-center mb-40">
        <h2 class="title pb-14">
          <span>Skill Sets</span> List
        </h2>
        <div class="title-img">
          <img src="/assets/img/shape.png" alt="Images">
        </div>
      </div>

      <DataSearchComponent searchData={skill_sets} searchProperty="name" on:results={e => filteredRecords = e.detail} />
      <div class="row vertical-gap mb-100">
        <div class="col d-flex justify-content-center">
          <button type="button" class="readon started get-ready5 text-center text-nowrap" data-bs-toggle="modal" data-bs-target="#skillSetModal" on:click="{ () => action = 'create' }"> Create New Skill Set</button>
        </div>
      </div>

      <div class="row">

        {#each filteredRecords as skill_set (skill_set.id)}
          <div class="col-lg-4 col-md-6" animate:flip="{{duration:d => 30 * Math.sqrt(d)}}" in:fly={{x:100}} out:fly={{x:-100}}>
            <div class="services-item">
              <div class="image-part">
                <img src="{skill_set.poster_thumb_url || '/assets/img/services/style11/1.jpg'}" alt="Services">
                <ul class="btn-edit">
                  <li><a data-bs-toggle="modal" href="#skillSetModal" on:click="{ () => { action = 'update'; details = skill_set } }">Edit</a></li>
                </ul>
              </div>
              <div class="addon-services">
                <!-- <div class="services-icon">
                  <img src="{skill_set.icon_url || '/assets/img/services/style11/icons/1.png'}" alt="Icons">
                </div> -->
                <div class="services-text">
                  <h2 class="title text-capitalize"> <a href="#/">{skill_set.name}</a></h2>
                  <h4 class="title fw-light text-capitalize"> <a href="#/">Category: {skill_set.course_category || 'Suspended'}</a></h4>
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
  <Modal modalId="skillSetModal" modalTitle="{action} Skill Set" lg>

    <form class="rs-my-account" on:submit|preventDefault|stopPropagation={processDetails} id="skillSetForm">
      <div class="row rs-login">
        <TextInput required grid="col-12" className="mb-30"  label="Skill Set Name" name="category-name" type="text" placeholder="Skill Set Name" errors="{errors.name}" bind:val="{details.name}" />

        <SelectizeInput required grid="col-12" bind:val={details.course_category_id}  label="Course Category" placeholder="Course Category" name="course-category" availableItems="{course_categories}" selectedItems="{[details.course_category_id]}" valueField='id' labelField='name' resetData={details}/>
      </div>
    </form>

    <LoadingButton type="submit" form="skillSetForm" slot="footer-button1" loading={isLoading} className="{action === 'update' ? 'btn-warning' : 'btn-success'} btn-long" icon='check-circle' shouldDisable={ !details.name }>
      { action === 'update' ? 'Update' : 'Create' } Skill Set
    </LoadingButton>
  </Modal>
</Portal>
