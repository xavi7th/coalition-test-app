<script>
  import { inertia, page } from '@inertiajs/inertia-svelte';

  export let routes = {};

  $: ({ auth } = $page.props);

</script>

<!-- Canvas Menu start -->
<nav class="right_menu_togle home14-style-togle " class:hidden-md={route().current('app.*') || route().current('auth.*')}>
  <div class="close-btn">
    <div class="nav-link">
      <a id="nav-close" class="humburger nav-expander" href="#">
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
    </div>
  </div>

  {#if route().current('app.*')}
    <div class="canvas-logo">
      <a href="{ route('app.index') }"><img src="/assets/img/logo-dark.png" alt="logo"></a>
    </div>
    <div class="offcanvas-text">
      <p>Enski is an ed-tech company that nurtures young talents for in-demand skillsets with the most qualitative learning resources from top experts and industry leaders setting them up to truly stand out in the global labour market and gain true financial freedom.</p>
    </div>
    <div class="canvas-contact">
      <div class="address-area">
        <div class="address-list">
          <div class="info-icon">
            <i class="flaticon-location"></i>
          </div>
          <div class="info-content">
            <h4 class="title">Address</h4>
            <em>Auta-Balefi, Abuja-Keffi Rd, New karu, Nassarawa State</em>
          </div>
        </div>
        <div class="address-list">
          <div class="info-icon">
            <i class="flaticon-email"></i>
          </div>
          <div class="info-content">
            <h4 class="title">Email</h4>
            <em><a href="mailto:contact@enski.net">contact@enski.net</a></em>
          </div>
        </div>
        <div class="address-list">
          <div class="info-icon">
            <i class="flaticon-call"></i>
          </div>
          <div class="info-content">
            <h4 class="title">Phone</h4>
            <em><a href="tel:(+234)8160055067">(+234) 816 005 5067</a></em>
          </div>
        </div>
      </div>
      <ul class="social">
        <li><a target="_blank" rel="noreferrer" href="https://fb.me/enski.impact.summit"><i class="fa fa-facebook"></i></a></li>
        <li><a target="_blank" rel="noreferrer" href="https://www.twitter.com/enski_official"><i class="fa fa-twitter"></i></a></li>
        <li><a target="_blank" rel="noreferrer" href="https://www.linkedin.com/company/enski-integrated-services/"><i class="fa fa-linkedin"></i></a></li>
        <li><a target="_blank" rel="noreferrer" href="https://www.instagram.com/enski_official"><i class="fa fa-instagram"></i></a></li>
      </ul>
    </div>
  {:else}
    <div class="canvas-contact">
      <div class="address-area">

        <div class="address-list justify-content-center">
          <div class="info-content">
            <h3 class="text-capitalize fw-light">
              {auth.user?.user_type} Dashboard
            </h3>
          </div>
        </div>

          {#each Object.entries(routes) as [route_name, route_cont]}
            {#if route_cont.length == 1}
              <div class="address-list">
                <div class="info-icon">
                  <i class="fa fa-{route_cont[0].icon}"></i>
                </div>
                <div class="info-content">
                  <h4 class="title">
                    <a href={ route(route_cont[0].name) } use:inertia>{ route_cont[0].menu_name }</a>
                  </h4>
                </div>
              </div>
            {:else if route_cont.length > 1}
              {#each route_cont as elem}
                <div class="address-list">
                  <div class="info-icon">
                    <i class="fa fa-{elem.icon}"></i>
                  </div>
                  <div class="info-content">
                    <h4>
                      <a href={ route(elem.name) } use:inertia>{ elem.menu_name }</a>
                    </h4>
                  </div>
                </div>
              {/each}
            {/if}
          {/each}

          <div class="address-list">
            <div class="info-icon">
              <i class="fa fa-lock"></i>
            </div>
            <div class="info-content">
              <h4 class="title">
                <a href="{ route('auth.logout') }" use:inertia="{{method: 'post' }}">Logout</a>
              </h4>
            </div>
          </div>

      </div>
    </div>
  {/if}

</nav>
<!-- Canvas Menu end -->
