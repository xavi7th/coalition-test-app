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
</style>

<div class="rs-breadcrumbs img3">
  <div class="breadcrumbs-inner text-center">
      <h1 class="page-title text-nowrap">{$pageTitle}</h1>
      <ul>
          <!-- <li title="Braintech - IT Solutions and Technology Startup HTML Template">
              <a class="active" href="index.html">Home</a>
          </li> -->
          <!-- <li>My Account</li> -->
      </ul>
  </div>
</div>
