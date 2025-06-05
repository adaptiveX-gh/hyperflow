<script lang="ts">
  import "../app.css"
  import { writable } from "svelte/store"
  import { setContext } from "svelte"
  import { WebsiteName } from "../../config"
  interface Props {
    children?: import("svelte").Snippet
  }
  let { children }: Props = $props()

  const adminSectionStore = writable("")
  setContext("adminSection", adminSectionStore)
  let adminSection: string | undefined = $state()
  adminSectionStore.subscribe((v) => (adminSection = v))
  function closeDrawer() {
    const adminDrawer = document.getElementById(
      "admin-drawer",
    ) as HTMLInputElement
    adminDrawer.checked = false
  }
</script>

<div class="drawer lg:drawer-open">
  <input id="admin-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <div class="navbar bg-base-100 lg:hidden">
      <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl" href="/">{WebsiteName}</a>
      </div>
      <div class="flex-none">
        <div class="dropdown dropdown-end">
          <label for="admin-drawer" class="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              /></svg
            >
          </label>
        </div>
      </div>
    </div>
    <div class="container px-6 lg:px-12 py-3 lg:py-6">
      {@render children?.()}
    </div>
  </div>
  <div class="drawer-side">
    <label for="admin-drawer" class="drawer-overlay"></label>
    <ul
      class="menu menu-lg p-4 w-80 min-h-full bg-base-100 lg:border-r text-primary"
    >
      <li>
        <div
          class="normal-case menu-title text-xl font-bold text-primary flex flex-row"
        >
          <a href="/" class="grow">{WebsiteName}</a>
          <label for="admin-drawer" class="lg:hidden ml-3"> &#x2715; </label>
        </div>
      </li>
      <li>
        <a
          href="/account"
          class={adminSection === "home" ? "active" : ""}
          onclick={closeDrawer}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            /></svg
          >
          Home
        </a>
      </li>
      <li>
        <a
          href="/account/billing"
          class={adminSection === "billing" ? "active" : ""}
          onclick={closeDrawer}
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            stroke="none"
            fill="currentColor"
            ><path
              d="M18,1H6A3,3,0,0,0,3,4V22a1,1,0,0,0,1.8.6L6.829,19.9l1.276,2.552a1,1,0,0,0,.8.549.981.981,0,0,0,.89-.4L12,19.667,14.2,22.6a.983.983,0,0,0,.89.4,1,1,0,0,0,.8-.549L17.171,19.9,19.2,22.6a1,1,0,0,0,.8.4,1,1,0,0,0,1-1V4A3,3,0,0,0,18,1Zm1,18-1.2-1.6a.983.983,0,0,0-.89-.4,1,1,0,0,0-.8.549l-1.276,2.552L12.8,17.4a1,1,0,0,0-1.6,0L9.171,20.105,7.9,17.553A1,1,0,0,0,7.09,17a.987.987,0,0,0-.89.4L5,19V4A1,1,0,0,1,6,3H18a1,1,0,0,1,1,1ZM17,9a1,1,0,0,1-1,1H8A1,1,0,0,1,8,8h8A1,1,0,0,1,17,9Zm-4,4a1,1,0,0,1-1,1H8a1,1,0,0,1,0-2h4A1,1,0,0,1,13,13Z"
            /></svg
          >
          Billing
        </a>
      </li>
      <li>
        <a
          href="/dashboard"
          class={adminSection === "dashboard" ? "active" : ""}
          onclick={closeDrawer}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M12 6v.01M5 9h14M5 15h14M10 12h4"
            /></svg
          >
          Dashboard
        </a>
      </li>
      <li>
        <a
          href="/account/settings"
          class={adminSection === "settings" ? "active" : ""}
          onclick={closeDrawer}
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" stroke="none" fill="none"
            ><g id="Interface / Settings"
              ><g id="Vector"
                ><path
                  d="M20.3499 8.92293L19.9837 8.7192C19.9269 8.68756 19.8989 8.67169 19.8714 8.65524C19.5983 8.4982 19.4079 8.2355 19.3489 7.93497C19.3428 7.90519 19.3428 7.87454 19.3428 7.81324V7.10001C19.3428 4.38632 17.5565 2.00001 15.1714 2.00001H8.82895C6.44376 2.00001 4.65755 4.38632 4.65755 7.10001V7.81324C4.65755 7.87454 4.65755 7.90519 4.65142 7.93497C4.59239 8.2355 4.40205 8.4982 4.1289 8.65524C4.10144 8.67169 4.07341 8.68756 4.01634 8.7192L3.65014 8.92293C2.39025 9.64629 2.39025 11.3537 3.65014 12.0771L4.01634 12.2808C4.07341 12.3125 4.10144 12.3283 4.1289 12.3448C4.40205 12.5018 4.59239 12.7645 4.65142 13.065C4.65755 13.0948 4.65755 13.1255 4.65755 13.1868V13.9C4.65755 16.6137 6.44376 19 8.82895 19H15.1714C17.5565 19 19.3428 16.6137 19.3428 13.9V13.1868C19.3428 13.1255 19.3428 13.0948 19.3489 13.065C19.4079 12.7645 19.5983 12.5018 19.8714 12.3448C19.8989 12.3283 19.9269 12.3125 19.9837 12.2808L20.3499 12.0771C21.6098 11.3537 21.6098 9.64629 20.3499 8.92293Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /><path
                  d="M8.00033 12C8.00033 14.2091 9.79119 16 12.0003 16C14.2095 16 16.0003 14.2091 16.0003 12C16.0003 9.79086 14.2095 8 12.0003 8C9.79119 8 8.00033 9.79086 8.00033 12Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></g
              ></g
            ></svg
          >
          Settings
        </a>
      </li>
      <li class="mt-auto">
        <a href="/account/sign_out" class="mt-auto text-base">Sign Out</a>
      </li>
    </ul>
  </div>
</div>
