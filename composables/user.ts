import { acceptHMRUpdate, defineStore } from 'pinia'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


export const useUserStore = defineStore('user', () => {
  /**
   * Current named of the user.
   */
  
  /**
   * Changes the current name of the user and saves the one that was used
   * before.
   *
   * @param name - new name to set
   */
  
  return {
    
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
