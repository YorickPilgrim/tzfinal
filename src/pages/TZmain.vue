<template>
  <header class="header">
    <div class="icon" @click="tabOne">
      <div><img src="../assets/photo/OBJECTS.png" alt="" /></div>
    </div>
    <div to="/favorites" class="fav" @click="tabTwo"></div>
  </header>

  <div class="container" v-if="tab === 1">
    <!-- search -->
    <div class="searcher">
      <input
        v-model="searchQuery"
        placeholder="Введите запрос для поиска"
        @keydown.enter="searchPhotos"
      />
      <button @click="searchPhotos">Искать</button>
    </div>
    <div class="centrium">
      <div v-if="searchError">
        <p>{{ searchError }}</p>
      </div>

      <!-- random -->
      <div v-else>
        <img
          v-for="photo in searchResults"
          :key="photo.id"
          :src="photo.urls.regular"
          :alt="photo.alt_description"
          @click="openModal(photo)"
        />
      </div>
      <!-- finded photo -->
      <div v-if="!searchResults.length && !searchError">
        <img
          v-for="photo in randomPhotos"
          :key="photo.id"
          :src="photo.urls.regular"
          :alt="photo.alt_description"
          @click="openModal(photo)"
        />
      </div>
    </div>

    <!-- загрузить ещё -->
    <button class="loadElse" v-if="searchQuery" @click="loadMoreSearchPhotos">
      Загрузить ещё
    </button>
    <button class="loadElse" v-else @click="loadMorePhotos">
      Загрузить ещё
    </button>
    <p v-if="loadingMore">Загрузка...</p>

    <!-- Модальное окно -->
    <div v-if="modalPhoto" class="modal-overlay">
      <header class="headerModal">
        <div class="icon" @click="tabOne">
          <div><img src="../assets/photo/OBJECTS.png" alt="" /></div>
        </div>
        <div to="/favorites" class="fav" @click="tabTwo"></div>
      </header>

      <div class="modal" style="background-color: antiquewhite">
        <span class="close" @click="closeModal">&times;</span>
        <img :src="modalPhoto.urls.regular" :alt="modalPhoto.alt_description" />
        <p>{{ modalPhoto.description }}</p>
        <!-- Добавляем кнопку "Добавить в избранное" -->
        <button
          style="
            background-color: brown;
            color: antiquewhite;
            padding: 5px 15px;
          "
          @click="like(modalPhoto.urls.regular)"
        >
          like
        </button>
        <a :href="link + modalPhoto.id + downloadlink">
          <button
            style="
              background-color: rgb(42, 165, 73);
              color: antiquewhite;
              padding: 5px 15px;
            "
          >
            Download
          </button>
        </a>
        <!-- <button @click="addToFavoritesFromModal">Добавить в избранное</button> -->
      </div>
    </div>
    <!-- Добавляем кнопку для перехода к странице "Избранное" -->
  </div>

  <div class="likeSection" v-if="tab === 2">
    <h1>Избранное</h1>
    <div>
      <img v-for="fav in favmass" :src="fav" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
//download
const link = "https://unsplash.com/photos/"
const downloadlink =
  "/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzAwODcyOTA3fA&force=true"
// tabs
const tab = ref(1)
const tabOne = () => {
  tab.value = 1
}
const tabTwo = () => {
  tab.value = 2
}
// import likedPost from '../assets/unsplash'

// const myArray = ref([1, 2, 3])

// file-1 pinia (data) => file-2  pinia(data)

// export { myArray }
const like = (photo) => {
  favmass.value.push(photo)
  closeModal()
}
const favmass = ref([])

const randomPhotos = ref([])
const searchQuery = ref("")
const searchResults = ref([])
const searchError = ref(null)
const modalPhoto = ref(null)
const page = ref(1) // добавляем переменную для отслеживания текущей страницы
const loadingMore = ref(false) // добавляем переменную для отслеживания загрузки дополнительных фотографий

// const router = useRouter()

// const addToFavoritesFromModal = () => {
//   store.commit("addToFavorites", modalPhoto)
//   console.log("Добавлено в избранное", modalPhoto)
//   closeModal()
// }

// TYFUGYHJIOIHBVGTRDFYGTYUHU
const unsplash1 = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: "Client-ID dOr70LR7IxcflAmv0Uo5QF1oBm39_6tXJkZPih9fE0k",
  },
})
// VYUBYIGVFCYRTFUGYIU
const loadRandomPhotos = async () => {
  try {
    const response = await unsplash1.get("/photos/random", {
      params: {
        count: 8,
      },
    })
    randomPhotos.value = response.data
  } catch (error) {
    console.error("Error fetching random photos", error)
  }
}

const searchPhotos = async () => {
  try {
    const response = await unsplash1.get("/search/photos", {
      params: {
        query: searchQuery.value,
        page: 1,
        per_page: 8,
      },
    })
    searchResults.value = response.data.results
    searchError.value = null
    page.value = 1 // сбросим страницу при новом поиске
  } catch (error) {
    searchResults.value = []
    searchError.value = "Ничего не найдено"
    console.error("Error searching photos", error)
  }
}

const loadMorePhotos = async () => {
  try {
    loadingMore.value = true
    const response = await unsplash1.get("/photos/random", {
      params: {
        count: 8,
      },
    })
    randomPhotos.value = [...randomPhotos.value, ...response.data]
  } catch (error) {
    console.error("Error loading more photos", error)
  } finally {
    loadingMore.value = false
  }
}
const loadMoreSearchPhotos = async () => {
  try {
    loadingMore.value = true
    const response = await unsplash1.get("/search/photos", {
      params: {
        query: searchQuery.value,
        page: page.value + 1,
        per_page: 8,
      },
    })
    searchResults.value = [...searchResults.value, ...response.data.results]
    page.value++
    hasMoreResults.value = response.data.results.length > 0
  } catch (error) {
    console.error("Error loading more photos", error)
  } finally {
    loadingMore.value = false
  }
}

const openModal = (photo) => {
  modalPhoto.value = photo
  document.body.style.overflow = "hidden" // блокировать скролл при открытом модальном окне
}

const closeModal = () => {
  modalPhoto.value = null
  document.body.style.overflow = "" // разблокировать скролл при закрытом модальном окне
}

onMounted(() => {
  loadRandomPhotos()
})

onBeforeUnmount(() => {
  // Очистите ресурсы при выходе из компонента
  // (например, отмена запросов или отписка от событий)
})
</script>

<!-- main -->
<style scoped>
.loadElse {
  display: block;
  margin: 0 auto 30px;
  background-color: rgb(23, 23, 100);
  color: white;
  padding: 10px 15px;
}
.centrium {
  text-align: center;
  padding: 50px 150px;
}
.container img,
.likeSection img {
  width: 300px;
  height: 300px;
  margin: 5px;
}
/* searcher */
.searcher {
  background: url(../assets/photo/background.png) no-repeat;
  background-size: 100%;
  padding: 70px 0;
  display: flex;
  justify-content: center;
}
.searcher input {
  display: block;
  padding: 10px 20px;
  width: 460px;
}
.searcher button {
  display: block;
  padding: 0 10px;
}
/* Стили для модального окна */
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.9); */
  background: url(../assets/photo/modalback.png) no-repeat;
  background-size: cover;
  z-index: 999;
}
.headerModal {
  background-color: black;
  padding: 20px 10%;
  display: flex;
  justify-content: space-between;
  color: white;
  position: absolute;
  top: 0;
  height: 10%;
  width: 100%;
  padding: 0 100px;
}
.headerModal img {
  width: 100px;
  height: auto;
}
.modal {
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
  /* padding: 20px; */
  position: relative;
  background-color: antiquewhite;
}
.modal img {
  width: auto;
}
.close {
  color: rgb(145, 10, 10);
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
}
</style>
<!-- header -->
<style scoped>
.header {
  background-color: black;
  padding: 20px 10%;
  display: flex;
  justify-content: space-between;
  color: white;
}
.icon {
  cursor: pointer;
}
.icon img {
  width: 140px;
}
.fav {
  align-self: center;
  cursor: pointer;
}
.fav::before {
  content: "";
  padding: 1px 9.5px;
  background: url(../assets/photo/fav.png) no-repeat;
  margin-right: 5px;
  background-size: cover;
}
/* .fav img {
  width: 20px;
  padding-right: 10px;
} */
</style>

<!-- like -->
<style scoped>
.likeSection {
  text-align: center;
  padding: 50px 150px;
}
.likeSection h1 {
  font-size: 30px;
  font-weight: bold;
  padding-bottom: 30px;
}
</style>

<style scoped>
@media (max-width: 700px) {
  .searcher {
    background-size: cover;
    padding: 30px;
  }
  .searcher input {
    width: auto;
  }
  .centrium {
    padding: 0;
  }
  .headerModal {
    padding: 0 10px;
  }
  .likeSection {
    padding: 0;
  }
  .likeSection p {
    padding: 30px 0;
  }
}
</style>
