<script>
  import { page, inertia } from "@inertiajs/inertia-svelte";

  $: ({ auth, course_menu, app } = $page.props);

</script>

<!-- Menu Start -->
<div class="menu-area menu-sticky">
  <div class="container">
    <div class="row-table">
      <div class="cell-col">
        <div class="logo-part">
          <a href="{ route('app.index') }">
            <img class="normal-logo" src="/assets/img/logo-orange.png" alt="logo">
            <img class="sticky-logo" src="/assets/img/logo-dark.png" alt="logo">
          </a>

        </div>
        <div class="mobile-menu">
          {#if route().current('app.*')}
            <a class="pl-20 btn-login" href="{ route('auth.login') }">
              {#if auth.user?.user_type}
                Dashboard
              {:else}
                Login
              {/if}
            </a>
          {/if}

          {#if route().current('app.*') || route().current('auth.*')}
            <a href="#" class="rs-menu-toggle rs-menu-toggle-close">
              <i class="fa fa-bars"></i>
            </a>
          {/if}

        </div>
      </div>

      {#if route().current('app.*') || route().current('auth.*')}
         <div class="cell-col">
           <div class="rs-menu-area">
             <div class="main-menu">
               <nav class="rs-menu">
                 <ul class="nav-menu">
                   <li> <a href="{ route('app.index') }">Home</a></li>
                   {#if course_menu.length}
                     <li class="menu-item-has-children">
                       <a href="academy">academy</a>
                       <ul class="sub-menu">
                          {#each course_menu as menu_item}
                            <li class="menu-item-has-children">
                                <a href="#">{menu_item.name}</a>
                                <ul class="sub-menu">
                                {#each menu_item.skill_sets as skill_set}
                                  <li><a href="{ route('app.courses', skill_set.slug) }">{ skill_set.name }</a></li>
                                {/each}
                                </ul>
                            </li>
                          {/each}
                       </ul>
                     </li>
                   {/if}
                   <li>
                     <a href="{ route('app.courses') }">Courses</a>
                   </li>
                   <li>
                     <a href="{ route('app.about') }">About Us</a>
                   </li>
                   <li class="menu-item-has-children">
                     <a use:inertia href="{ route('app.page-pending') }">Explore</a>
                     <ul class="sub-menu">
                       <li><a use:inertia href="{ route('app.page-pending') }"> Join Community</a> </li>
                       <li><a use:inertia href="{ route('app.page-pending') }">Entertainment</a></li>
                       <li><a use:inertia href="{ route('app.page-pending') }">Become an Instructor</a></li>
                     </ul>
                   </li>
                   <li>
                     <a target="_blank" rel="noreferrer" href="https://api.whatsapp.com/send/?phone={app.phone}">Become a Facilitator</a>
                     <!-- <a href="{route('app.contact')}">Contact Us</a> -->
                   </li>
                   <li>
                     <a use:inertia href="{ route('app.page-pending') }">Blog</a>
                   </li>
                 </ul> <!-- //.nav-menu -->
               </nav>
             </div> <!-- //.main-menu -->
           </div>
         </div>
      {/if}

      <div class="cell-col">
        {#if !route().current('auth.*')}
          <div class="expand-btn-inner search-icon " class:hidden-md={route().current('app.*') || route().current('auth.*')}>
            <ul>
              {#if route().current('app.*')}
                <li class="pr-20">
                  <a class="btn-login" href="{ route('auth.login') }">
                    {#if auth.user?.user_type}
                      Dashboard
                    {:else}
                      Login
                    {/if}
                  </a>
                </li>
              {/if}

              <li class="sidebarmenu-search">
                <a class="hidden-xs rs-search" data-bs-toggle="modal" data-bs-target="#searchModal" href="#/">
                  <i class="flaticon-search"></i>
                </a>
              </li>

              <li>
                <a id="nav-expander" class="humburger nav-expander" href="#/">
                  <span class="dot1"></span>
                  <span class="dot2"></span>
                  <span class="dot3"></span>
                  <span class="dot4"></span>
                  <span class="dot5"></span>
                  <span class="dot6"></span>
                  <span class="dot7"></span>
                  <span class="dot8"></span>
                  <span class="dot9"></span>
                </a>
              </li>
            </ul>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
<!-- Menu End -->
