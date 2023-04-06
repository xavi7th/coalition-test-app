<script>
  /**
   * An in-place search component useful for filtering a collection of objects, either by searchin the full object or searching a specific provided field
   * @example
   * import DataSearchComponent from '@miscellaneous-assets/js/Components/DataSearchComponent.svelte';
   * <DataSearchComponent searchData={resellers} searchProperty='business_name' on:results={e => filteredRecords = e.detail}/>
   * <DataSearchComponent searchData={users} fullObjectSearch on:results={e => filteredRecords = e.detail}/>
   *
   * {#each filteredRecords as reseller,idx (reseller.id)} {/each}
   *
   * @property {Boolean} fullObjectSearch determine whether to search a particular key or search every STRING fields in the object
   * @property {Object} searchData the data to filter through
   * @property {String} searchProperty the field inside the object to search if available
   *
   * @event isSearching Event emitted when filteration is ongoing. Useful for displaying a loading icon. However this may be redundant since this is a browser based search and so should be typically very fast
   * @event results Event emmited after the filteration is done. The payload carries the filtered result set. An alternative would be to export this result set so that it can be bound to.
   *
   * @see {@link ManageResellers.svelte} for further information on usage.
   */


  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let fullObjectSearch = false, searchData = [], searchProperty = 'full_name';

    let searchQuery;

    let performSearch  = () =>{
      if (searchQuery.length == 0) {
        resetData();
        return;
      }

      let searchResults = fullObjectSearch
          ? _.filter(searchData, function(o) { return _.some(o, v => typeof v === 'string' && v.toLowerCase().includes(searchQuery.toLowerCase())); })
          : _.filter(searchData, function(o) { return _.toLower(o[searchProperty]).includes(_.toLower(searchQuery)); });

      dispatch('isSearching', false)
      dispatch('results', searchResults)
    }

    let resetData = () => {
      dispatch('isSearching', false)
      dispatch('results', searchData)
    };

    let throttledSearch = _.debounce(performSearch, 1000)
  </script>

  <style lang="scss">
    .search-form{
      border-radius: 3px;
      padding: 0 20px;

      input{
        background: #e8f0ff;
        border: 1px solid #a6d4f7;
        border-radius: 30px 0 0 30px;
        box-shadow: inset 1px -2px 15px -6px #ccc;
        color: #0a0a0a;
        font-size: 13px;
        margin: 0;
        overflow: hidden;
        padding: 16px 60px 16px 20px;
        width: 91%;
      }

      .data-search{
        position: relative;

        button{
          background-image: linear-gradient(180deg,#2371dd 19%,#1eb2f2);
          border: none;
          border-radius: 50%;
          bottom: 1px;
          font-family: Flaticon;
          font-size: 0;
          position: absolute;
          right: 62px;
          top: 1px;
          width: 54px;
          height: 54px;

          @media only screen and (max-width: 991px) {
            right: 25px;
            top: 0;
          }
        }

        i{
          bottom: 0;
          color: #fff;
          padding: 12px 20px;
          pointer-events: none;
          position: absolute;
          right: 59px;
          top: 3px;

          @media only screen and (max-width: 991px) {
            right: 22px;
          }
        }
      }

    }
  </style>

  <div class="row justify-content-center search-form mb-50">
    <div class="col-md-8 data-search">
      <input type="search" class="form-control form-control-clean " placeholder="Type to search..." bind:value="{searchQuery}" on:keypress="{() => {dispatch('isSearching', true)}}" on:input="{throttledSearch}">
      <button type="button" on:click={resetData}></button>
      <i class="flaticon-left-arrow"></i>
    </div>
  </div>
