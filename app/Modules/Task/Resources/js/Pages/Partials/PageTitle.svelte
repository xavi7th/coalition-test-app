<script>
  import { pageTitle } from "@task-shared/stores";
</script>

<style lang="scss" global>
  body:not(.test-app){
    .page-title{
      width: 50%;
      margin: 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .breadcrumbs-inner{
    padding: 20px 0 !important;
    background: #000000f2;
  }
</style>

<div class="rs-breadcrumbs img3">
  <div class="breadcrumbs-inner text-center">
      <h1 class="page-title text-nowrap">{$pageTitle}</h1>
  </div>
</div>
