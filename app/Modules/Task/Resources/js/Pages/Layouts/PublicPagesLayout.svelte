
<script>
  import { onMount } from 'svelte';
  import { fly } from "svelte/transition";
  import { Portal } from 'svelte-teleport';
  import { page } from "@inertiajs/inertia-svelte";
  import Footer from '@task-partials/Footer.svelte';
  import MainNav from '@task-partials/MainNav.svelte';
  import CanvasNav from '@task-partials/CanvasNav.svelte';
  import Preloader from '@task-partials/Preloader.svelte';
  import PageTitle from '@task-partials/PageTitle.svelte';
  import { pageTitle, modalRoot } from "@task-shared/stores";

  $: ({ app, routes, auth, appInitPath } = $page.props);

  $: {
    try {
      pageModals.teleport_to($modalRoot)
    } catch (e) {}
  }

  let isMounted = false, pageModals = undefined;

  onMount(() => {
    setTimeout(() => {
      isMounted = true;
      console.log('---====== app mounted =====---');
    }, 600);
  });

  function onReceived(e) {
    console.log(e);
  }
</script>

<svelte:head>
  <title>{ $pageTitle }</title>
  <meta name="description" content="{ $pageTitle }" />
</svelte:head>

<style>
  #rs-header{
    padding: 20px 0;
  }
</style>

<!-- The blur filter on menu open -->
<div class="offwrap"></div>

<Preloader />

<!-- Main content Start -->
<div class="main-content" in:fly={{ x: -300, duration: 700, delay: 400 }} out:fly={{ y: 30, duration: 400, delay: 0 }}>

  <!--Full width header Start-->
  <div class="full-width-header">
    <header id="rs-header" class="rs-header style3 modify3 home14-style header-transparent">
      <MainNav />
    </header>

    {#if ! route().current('app.index')}
      <PageTitle />
    {/if}

    <CanvasNav {routes}/>
  </div>

  <slot />

</div>

<Footer />

<!-- start scrollUp  -->
<div id="scrollUp" class="oranage2">
  <i class="fa fa-angle-up"></i>
</div>


<Portal bind:this={pageModals} >
  <!-- Search Modal Start -->
  <div class="modal fade search-modal" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
    <button type="button" class="close" data-bs-dismiss="modal">
      <span class="flaticon-cross"></span>
    </button>
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="search-block clearfix">
          <form>
            <div class="form-group">
              <input class="form-control" placeholder="Search Here..." type="text">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</Portal>

<Portal bind:this={$modalRoot} on:received:={onReceived}></Portal>

{#if isMounted}
  <script src={appInitPath}></script>
{/if}
