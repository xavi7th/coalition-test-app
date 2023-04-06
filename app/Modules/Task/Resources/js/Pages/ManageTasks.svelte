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
  import ConfirmModal from '@task-components/ConfirmModal.svelte';
  import LoadingButton from "@task-components/LoadingButton.svelte";
  import SelectizeInput from '@task-components/SelectizeInput.svelte';
  import DataSearchComponent from '@task-components/DataSearchComponent.svelte';

  export let projects = [], tasks = [];

  $: ({ errors } = $page.props);

  $: {
    try {
      pageModals.teleport_to($modalRoot)
    } catch (e) {};

    filteredRecords = tasks;
    filterTasks();

    pageTitle.update(title => 'Manage Tasks');
  }


  let details = {}, pageModals, filteredRecords = [], taskFiltered = [], action, isLoading = false, resetID = 0, task_filter = undefined,

 processDetails = () => {
    isLoading = true;

    if (action == 'update') {
      details._method = 'PUT';
    }

    let url = action == 'create' ? route("app.tasks.store") : route("app.tasks.update", details.id)

    Inertia.post(url, details, {
        preserveState: true,
        preserveScroll: true,
        only: ["flash", "errors", 'tasks'],
        onSuccess: () =>{
          details = {};
          jQuery('#taskModal').modal('hide');
          resetID++
        },
        onFinish: () => isLoading = false
    })
  },

  filterTasks = () => {
    if (isNaN(task_filter)){
      taskFiltered = filteredRecords;
      return;
    }

    taskFiltered = _.filter(filteredRecords, o => o.project_id == task_filter );
  };

  onMount(() => {
    jQuery('#taskModal').on('hidden.bs.modal', function (e) {
      details = {};
    })

    jQuery("#task-list").sortable({
      cursor: "move",
      opacity: 0.5,
      revert: true,
      update: function(event, ui) {
        this.classList.add('sorting');

        let values = [];
        jQuery('.task-item').each(function(index) {
            values.push(jQuery(this).attr("id").replace("task-", ""));
        });
        Inertia.post(route('app.tasks.priorities'), {values}, {
          onSuccess: () => filterTasks(),
          onFinish: () => this.classList.remove('sorting')
        })
      }
    })
  })
</script>


<style lang="scss" global>
  #task-list{
    &.sorting{
      position: relative;
      pointer-events: none;

      &::before{
        content: 'loading ...';
        display: flex;
        position: absolute;
        height: 100%;
        width: 100%;
        background: #000000b8;
        pointer-events: none;
        color: white;
        text-align: center;
        vertical-align: unset;
        justify-content: center;
        align-items: center;
      }
    }
  }

</style>


<div id="rs-blog" class="rs-blog active-courses style2 pt-100 pb-100 md-pt-80 md-pb-80">
  <div class="container">
    <div class="services-top-section">

      <div class="sec-title6 text-center mb-40">
        <h2 class="title pb-14">
          <span>Tasks</span> List
        </h2>
        <div class="title-img">
        </div>
      </div>

      <DataSearchComponent searchData={tasks} searchProperty="name" on:results={ e => { filteredRecords = e.detail; filterTasks(); } } />


        <div class="row vertical-gap mb-100 d-flex justify-content-between align-items-center">
          <SelectizeInput required grid="col-4" className="p-5" bind:val={task_filter} placeholder="Filter Tasks" name="filter-tasks" availableItems="{projects}" valueField='id' labelField='name' onChange={filterTasks}/>
          <button type="button" class="btn readon started get-ready5 text-center text-nowrap col-2" data-bs-toggle="modal" data-bs-target="#taskModal" on:click="{ () => action = 'create' }"> Create New Task</button>
      </div>

      <div id="task-list" class="row">

        {#each taskFiltered as task (task.id)}

          <div id="task-{task.id}" class="col-lg-4 col-md-6 task-item" animate:flip="{{duration:d => 30 * Math.sqrt(d)}}" in:fly={{x:100}} out:fly={{x:-100}}>
            <div class="blog-item">
              <div class="blog-content">
                <ul class="blog-meta">
                  <li class="date"><i class="fa fa-calendar-check-o"></i>Created On: {task.created_at || 'N/A'} </li>
                </ul>
                <h3 class="blog-title"><a href="#/">{task.name}</a></h3>
                <p class="desc"><i class="fa fa-user-md mr-10"></i> Priority: #{task.priority} </p>
                <p class="desc"><i class="fa fa-package"></i> Project: {task.project || 'N/A'}</p>
              </div>
              <ul class="d-flex flex-wrap justify-content-evenly">
                <li><a class="btn btn-warning btn-xs" data-bs-toggle="modal" href="#taskModal" on:click="{ () => { action = 'update'; details = task; resetID++ } }">Edit Task</a></li>
                {#if ! task.is_completed}
                  <li>
                      <ConfirmModal actionUrl={route('app.tasks.complete', task)} actionMethod="PATCH" dataToReload={['tasks']} className="btn-outline-secondary btn-xs"> Mark Complete <i class="fa fa-check ml-5"></i></ConfirmModal>
                  </li>
                  <li>
                    <ConfirmModal actionUrl={route('app.tasks.delete', task)} actionMethod="DELETE" dataToReload={['tasks']} className="btn-danger btn-xs"> Delete <i class="fa fa-times ml-5"></i></ConfirmModal>
                  </li>
                {/if}
              </ul>
            </div>
          </div>
        {/each}

      </div>
    </div>
  </div>
</div>

<Portal bind:this={pageModals}>
  <Modal modalId="taskModal" modalTitle="{action} Task" lg>

    <form class="rs-my-account" on:submit|preventDefault|stopPropagation={processDetails} id="taskForm">
      <div class="row rs-login">
        <TextInput required grid="col-12" className="mb-30"  label="Task Name" name="category-name" type="text" placeholder="Task Name" errors="{errors.name}" bind:val="{details.name}" />
        <TextInput required grid="col-12" className="mb-30"  label="Priority" name="category-name" type="number" placeholder="Priority" errors="{errors.priority}" bind:val="{details.priority}" />

        <SelectizeInput required grid="col-12" bind:val={details.project_id}  label="Project" placeholder="Project" name="project" availableItems="{projects}" selectedItems="{[details.project_id]}" valueField='id' labelField='name' resetData={resetID}/>
      </div>
    </form>

    <LoadingButton type="submit" form="taskForm" slot="footer-button1" loading={isLoading} className="{action === 'update' ? 'btn-warning' : 'btn-success'} btn-long" icon='check-circle' shouldDisable={ !details.name }>
      { action === 'update' ? 'Update' : 'Create' } Task
    </LoadingButton>
  </Modal>
</Portal>
