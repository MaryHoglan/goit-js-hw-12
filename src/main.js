
import { fetchImages } from "./js/pixabay-api.js";
import { renderGallery, clearGallery } from "./js/render-functions.js";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

iziToast.settings({
  position: "topRight",
  iconColor: "#fff",
  messageColor: "#fff",
});

const form = document.querySelector(".form");
const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
const perPage = 15;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  query = e.target.elements["search-text"].value.trim();
  if (!query) {
    iziToast.warning({ title: "Warning", message: "Please enter a search query!" });
    return;
  }
  
  page = 1;
  clearGallery();
  toggleLoadMore(false);
  toggleLoader(true);

  try {
    const { images, totalHits } = await fetchImages(query, page, perPage);
    handleImagesResponse(images, totalHits);
  } catch (error) {
    iziToast.error({ title: "Error", message: "Failed to fetch images." });
  } finally {
    toggleLoader(false);
  }
});

loadMoreBtn.addEventListener("click", async () => {
  page += 1;
  toggleLoader(true);
  toggleLoadMore(false);

  try {
    const { images, totalHits } = await fetchImages(query, page, perPage);
    renderGallery(images);
    handlePagination(totalHits);
    scrollPage();
  } catch (error) {
    iziToast.error({ title: "Error", message: "Failed to fetch images." });
  } finally {
    toggleLoader(false);
  }
});

function handleImagesResponse(images, totalHits) {
  if (images.length === 0) {
    iziToast.error({ title: "Error", message: "No images found. Try another query." });
  } else {
    renderGallery(images);
    handlePagination(totalHits);
  }
}

function handlePagination(totalHits) {
  if (page * perPage >= totalHits) {
    iziToast.info({ message: "We're sorry, but you've reached the end of search results." });
  } else {
    toggleLoadMore(true);
  }
}

function toggleLoader(visible) {
  loader.classList.toggle("hidden", !visible);
}

function toggleLoadMore(visible) {
  loadMoreBtn.classList.toggle("hidden", !visible);
}

function scrollPage() {
  const galleryItem = document.querySelector(".gallery-item");
  if (galleryItem) {
    const cardHeight = galleryItem.getBoundingClientRect().height;
    window.scrollBy({ top: cardHeight * 2, behavior: "smooth" });
  }
}
